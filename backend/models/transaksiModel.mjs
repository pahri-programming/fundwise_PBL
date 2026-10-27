import db from '../config/db.mjs';

const select_dasar = `
    SELECT t.id, t.jenis, t.nominal, t.tanggal, t.catatan, t.kategori_id, k.nama AS kategori
    FROM transaksi t JOIN kategori k ON k.id = t.kategori_id`;

const Transaksi = {
    async getAll(userId, { jenis, bulan } = {}) {
        const kondisi = ['t.user_id = ?'];
        const nilai = [userId];

        if (jenis) {
            kondisi.push('t.jenis = ?');
            nilai.push(jenis);
        }
        if (bulan) {
            kondisi.push('t.tanggal >= ? AND t.tanggal < DATE_ADD(?, INTERVAL 1 MONTH)');
            nilai.push(`${bulan}-01`, `${bulan}-01`);
        }

        const [rows] = await db.query(
            `${select_dasar} WHERE ${kondisi.join(' AND ')} ORDER BY t.tanggal DESC, t.id DESC`,
            nilai
        );
        return rows;
    },

    async getById(userId, id) {
        const [rows] = await db.query(
            `${select_dasar} WHERE t.id = ? AND t.user_id = ?`,
            [id, userId]
        );
        return rows[0];
    },

    async create(userId, { kategori_id, jenis, nominal, tanggal, catatan }) {
        const [result] = await db.query(
            'INSERT INTO transaksi (user_id, kategori_id, jenis, nominal, tanggal, catatan) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, kategori_id, jenis, nominal, tanggal, catatan]
        );
        return result.insertId;
    },

    async update(userId, id, { kategori_id, jenis, nominal, tanggal, catatan }) {
        const [result] = await db.query(
            'UPDATE transaksi SET kategori_id = ?, jenis = ?, nominal = ?, tanggal = ?, catatan = ? WHERE id = ? AND user_id = ?',
            [kategori_id, jenis, nominal, tanggal, catatan, id, userId]
        );
        return result.affectedRows;
    },

    async remove(userId, id) {
        const [result] = await db.query(
            'DELETE FROM transaksi WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows;
    },
};

export default Transaksi;