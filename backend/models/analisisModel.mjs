import db from '../config/db.mjs';

const Analisis = {
    async pengeluaranPerKategori(userId, bulan, sampai) {
        const [rows] = await db.query(
            `SELECT k.nama AS kategori,
                    SUM(t.nominal) AS total,
                    COUNT(*)       AS jumlah
             FROM transaksi t
                      JOIN kategori k ON k.id = t.kategori_id
             WHERE t.user_id = ?
               AND t.jenis = 'keluar'
               AND t.tanggal >= ?
               AND t.tanggal < DATE_ADD(?, INTERVAL 1 MONTH)
               AND t.tanggal <= ?
             GROUP BY k.id, k.nama
             ORDER BY total DESC`,
            [userId, `${bulan}-01`, `${bulan}-01`, sampai]
        );
        return rows;
    },
};

export default Analisis;