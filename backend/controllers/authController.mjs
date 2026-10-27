import bcrypt from 'bcryptjs';
import User from '../models/userModel.mjs';
import { buatToken } from '../utils/token.mjs';

const BIAYA_HASH = 10;
const PASSWORD_MIN = 8;
const PASSWORD_MAKS = 72;

const HASH_PALSU = bcrypt.hashSync('password-palsu', BIAYA_HASH);

const galatServer = (res, error) => {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
};

const emailValid = (email) => {
    if (email.length > 255 || email.includes(' ')) return false;
    const bagian = email.split('@');
    if (bagian.length !== 2) return false;
    const [lokal, domain] = bagian;
    return lokal.length > 0 && domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.');
};

const bersihkan = (nilai) => (typeof nilai === 'string' ? nilai.trim() : '');

export const daftar = async (req, res) => {
    try {
        const { nama, email, password } = req.body ?? {};
        const namaBersih = bersihkan(nama);
        const emailBersih = bersihkan(email).toLowerCase();

        if (namaBersih.length < 2 || namaBersih.length > 100) {
            return res.status(400).json({ error: 'Nama harus 2 sampai 100 karakter' });
        }
        if (!emailValid(emailBersih)) {
            return res.status(400).json({ error: 'Format email tidak valid' });
        }
        if (typeof password !== 'string' || password.length < PASSWORD_MIN) {
            return res.status(400).json({ error: `Password minimal ${PASSWORD_MIN} karakter` });
        }
        if (Buffer.byteLength(password) > PASSWORD_MAKS) {
            return res.status(400).json({ error: `Password terlalu panjang (maksimal ${PASSWORD_MAKS} karakter)` });
        }

        const passwordHash = await bcrypt.hash(password, BIAYA_HASH);
        const id = await User.create({
            nama: namaBersih,
            email: emailBersih,
            password_hash: passwordHash,
        });

        const user = { id, nama: namaBersih, email: emailBersih };
        res.status(201).json({ token: buatToken(user), user });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email sudah terdaftar, gunakan email lain' });
        }
        galatServer(res, error);
    }
};

export const masuk = async (req, res) => {
    try {
        const { email, password } = req.body ?? {};
        const emailBersih = bersihkan(email).toLowerCase();

        if (!emailBersih || typeof password !== 'string' || !password) {
            return res.status(400).json({ error: 'Email dan password wajib diisi' });
        }

        const user = await User.findByEmail(emailBersih);
        const cocok = await bcrypt.compare(password, user ? user.password_hash : HASH_PALSU);

        if (!user || !cocok) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        const dataUser = { id: user.id, nama: user.nama, email: user.email };
        res.status(200).json({ token: buatToken(dataUser), user: dataUser });
    } catch (error) {
        galatServer(res, error);
    }
};

export const profil = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ error: 'Akun tidak ditemukan, silakan login ulang' });
        }
        res.status(200).json(user);
    } catch (error) {
        galatServer(res, error);
    }
};