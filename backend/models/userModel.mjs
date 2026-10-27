import db from '../config/db.mjs';

const user = {
    async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT id, nama, email, password_hash FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    async findById(id) {
        const [rows] = await db.query(
            'SELECT id, nama, email FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async create({nama, email, password_hash}) {
        const koneksi = await db.getConnection();
        try {
            await koneksi.beginTransaction();
            const [hasil] = await koneksi.query(
                'INSERT INTO users (nama, email, password_hash) VALUES (?, ?, ?)',
                    [nama, email, password_hash]
            );
            await koneksi.query('INSERT INTO pengaturan (user_id) VALUES (?)', [hasil.insertId]);
            await koneksi.commit();
            return hasil.insertId;
        } catch (error) {
            try {
                await koneksi.rollback();
            } catch {
                // koneksi sudah mati, abaikan agar error aslinya tetap terlempar
            }
            throw error;
        } finally {
            koneksi.release();
        }
    },
};

export default user;