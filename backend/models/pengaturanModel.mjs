import db from '../config/db.mjs';

const Pengaturan = {
    async get(userId) {
        const [rows] = await db.query(
            'SELECT kewajiban, sisihkan_tabungan, pemasukan_berikutnya FROM pengaturan WHERE user_id = ?',
            [userId]
        );
        if (rows[0]) return rows[0];

        await db.query('INSERT IGNORE INTO pengaturan (user_id) VALUES (?)', [userId]);
        return { kewajiban: 0, sisihkan_tabungan: 0, pemasukan_berikutnya: null };
    },

    async update(userId, { kewajiban, sisihkan_tabungan, pemasukan_berikutnya }) {
        const [result] = await db.query(
            'UPDATE pengaturan SET kewajiban = ?, sisihkan_tabungan = ?, pemasukan_berikutnya = ? WHERE user_id = ?',
            [kewajiban, sisihkan_tabungan, pemasukan_berikutnya, userId]
        );
        return result.affectedRows;
    },
};

export default Pengaturan;