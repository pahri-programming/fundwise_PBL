import db from '../config/db.mjs';

const Ringkasan = {

    async saldo(userId, sampai) {
        const [rows] = await db.query(
            `SELECT COALESCE((SELECT SUM(CASE WHEN jenis = 'masuk' THEN nominal ELSE -nominal END)
                              FROM transaksi
                              WHERE user_id = ? AND tanggal <= ?), 0)
                        - COALESCE((SELECT SUM(s.nominal)
                                    FROM setoran_tabungan s
                                             JOIN target_tabungan t ON t.id = s.target_id
                                    WHERE t.user_id = ?), 0) AS saldo`,
            [userId, sampai, userId]
        );
        return rows[0].saldo;
    },

    async totalTabungan(userId) {
        const [rows] = await db.query(
            `SELECT COALESCE(SUM(s.nominal), 0) AS total
             FROM setoran_tabungan s
                      JOIN target_tabungan t ON t.id = s.target_id
             WHERE t.user_id = ?`,
            [userId]
        );
        return rows[0].total;
    },

    async totalBulan(userId, bulan) {
        const [rows] = await db.query(
            `SELECT COALESCE(SUM(CASE WHEN jenis = 'masuk' THEN nominal ELSE 0 END), 0) AS pemasukan,
                    COALESCE(SUM(CASE WHEN jenis = 'masuk' THEN 0 ELSE nominal END), 0) AS pengeluaran
             FROM transaksi
             WHERE user_id = ?
               AND tanggal >= ? AND tanggal < DATE_ADD(?, INTERVAL 1 MONTH)`,
            [userId, `${bulan}-01`, `${bulan}-01`]
        );
        return rows[0];
    },
};

export default Ringkasan;