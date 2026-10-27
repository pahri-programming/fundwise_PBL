import db from '../config/db.mjs';

const Kategori = {
    async getAll(jenis) {
        if (jenis) {
            const [rows] = await db.query(
                'SELECT id, nama, jenis FROM kategori WHERE jenis = ? ORDER BY nama',
                [jenis]
            );
            return rows;
        }
        const [rows] = await db.query(
            'SELECT id, nama, jenis FROM kategori ORDER BY jenis, nama'
        );
        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(
            'SELECT id, nama, jenis FROM kategori WHERE id = ?',
            [id]
        );
        return rows[0];
    },
};

export default Kategori;