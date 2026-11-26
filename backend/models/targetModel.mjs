import db from '../config/db.mjs';

const select_target = `
    SELECT t.id, t.nama, t.nominal_target, t.tenggat,
           COALESCE(SUM(s.nominal), 0) AS terkumpul
    FROM target_tabungan t
             LEFT JOIN setoran_tabungan s ON s.target_id = t.id`;

const kelompok = 'GROUP BY t.id, t.nama, t.nominal_target, t.tenggat';

const Target = {
    async getAll(userId) {
        const [rows] = await db.query(
            `${select_target} WHERE t.user_id = ? ${kelompok} ORDER BY t.id DESC`,
            [userId]
        );
        return rows;
    },

    async getById(userId, id) {
        const [rows] = await db.query(
            `${select_target} WHERE t.id = ? AND t.user_id = ? ${kelompok}`,
            [id, userId]
        );
        return rows[0];
    },

    async create(userId, { nama, nominal_target, tenggat }) {
        const [result] = await db.query(
            'INSERT INTO target_tabungan (user_id, nama, nominal_target, tenggat) VALUES (?, ?, ?, ?)',
            [userId, nama, nominal_target, tenggat]
        );
        return result.insertId;
    },

    async remove(userId, id) {
        const [result] = await db.query(
            'DELETE FROM target_tabungan WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows;
    },

    async setor(userId, targetId, nominal, tanggal) {
        await db.query('INSERT IGNORE INTO pengaturan (user_id) VALUES (?)', [userId]);

        const koneksi = await db.getConnection();
        try {
            await koneksi.beginTransaction();

            // Kunci per pengguna supaya dua setoran bersamaan tidak saling menimpa
            await koneksi.query('SELECT user_id FROM pengaturan WHERE user_id = ? FOR UPDATE', [userId]);

            const [baris] = await koneksi.query(
                'SELECT id, nominal_target FROM target_tabungan WHERE id = ? AND user_id = ?',
                [targetId, userId]
            );
            if (!baris[0]) {
                await koneksi.rollback();
                return { status: 404, galat: 'Target tidak ditemukan' };
            }

            const [[hitung]] = await koneksi.query(
                `SELECT
                     (SELECT COALESCE(SUM(CASE WHEN jenis = 'masuk' THEN nominal ELSE -nominal END), 0)
                      FROM transaksi WHERE user_id = ? AND tanggal <= ?) AS arus,
                     (SELECT COALESCE(SUM(s.nominal), 0)
                      FROM setoran_tabungan s
                               JOIN target_tabungan t ON t.id = s.target_id
                      WHERE t.user_id = ?) AS ditabung,
                     (SELECT COALESCE(SUM(nominal), 0)
                      FROM setoran_tabungan WHERE target_id = ?) AS terkumpul`,
                [userId, userId, targetId]
            );

            const saldo = Number(hitung.arus) - Number(hitung.ditabung);
            const sisa = Number(baris[0].nominal_target) - Number(hitung.terkumpul);

            if (sisa <= 0) {
                await koneksi.rollback();
                return { status: 400, galat: 'Target ini sudah tercapai' };
            }
            if (nominal > sisa) {
                await koneksi.rollback();
                return { status: 400, galat: `Setoran melebihi sisa target (sisa Rp ${sisa.toLocaleString('id-ID')})` };
            }
            if (nominal > saldo) {
                await koneksi.rollback();
                return { status: 400, galat: 'Saldo tidak cukup untuk disetor' };
            }

            await koneksi.query(
                'INSERT INTO setoran_tabungan (target_id, nominal, tanggal) VALUES (?, ?, ?)',
                [targetId, nominal, tanggal]
            );

            // Dana cadangan (pengaturan.sisihkan_tabungan) sengaja TIDAK diubah di sini.

            await koneksi.commit();
            return { ok: true };
        } catch (error) {
            try {
                await koneksi.rollback();
            } catch {
                // koneksi sudah mati, biarkan error aslinya yang dilempar
            }
            throw error;
        } finally {
            koneksi.release();
        }
    },
};

export default Target;