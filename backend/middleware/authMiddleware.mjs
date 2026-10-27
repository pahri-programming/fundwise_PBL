import { bacaToken } from '../utils/token.mjs';

export const wajibLogin = (req, res, next) => {
    const header = req.headers.authorization ?? '';
    const [skema, token] = header.split(' ');

    if (skema !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Silakan login terlebih dahulu' });
    }

    try {
        const isi = bacaToken(token);
        req.user = { id: isi.id };
        next();
    } catch {
        res.status(401).json({ error: 'Sesi tidak valid atau sudah berakhir, silakan login ulang' });
    }
};