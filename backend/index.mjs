import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import db from './config/db.mjs';
import authRoutes from './routes/authRoutes.mjs';
import apiRoutes from './routes/apiRoutes.mjs';
import { wajibLogin } from './middleware/authMiddleware.mjs';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error('JWT_SECRET di file .env belum diisi atau terlalu pendek (minimal 32 karakter).');
    process.exit(1);
}

const app = express();

// Di belakang Nginx (produksi) agar rate limit membaca IP pengunjung yang asli
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

app.use(helmet());
app.use(
    cors({
        origin: (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(',').map((o) => o.trim()),
    })
);
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT COUNT(*) AS jumlah FROM kategori');
        res.json({ status: 'ok', jumlah_kategori: rows[0].jumlah });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal terhubung ke database' });
    }
});

const pesanBatas = { error: 'Terlalu banyak percobaan, coba lagi 15 menit lagi' };
const batasLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    skipSuccessfulRequests: true, // hanya percobaan gagal yang dihitung
    standardHeaders: true,
    legacyHeaders: false,
    message: pesanBatas,
});
const batasDaftar = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: pesanBatas,
});
app.use('/api/auth/login', batasLogin);
app.use('/api/auth/register', batasDaftar);

app.use('/api/auth', authRoutes);
app.use('/api', wajibLogin, apiRoutes);

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Format JSON tidak valid' });
    }
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));

// Jaga koneksi database tetap stabil
setInterval(() => {
    db.query('SELECT 1').catch(() => {});
}, 60000).unref();