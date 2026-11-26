import Analisis from '../models/analisisModel.mjs';
import { tanggalValid, hariIni, bulanIni } from '../utils/tanggal.mjs';

const BATAS_DOMINAN = 30; // persen; asumsi sendiri, bukan standar baku

export const getAnalisis = async (req, res) => {
    try {
        const bulan = req.query.bulan ?? bulanIni();
        if (!/^\d{4}-\d{2}$/.test(bulan) || !tanggalValid(`${bulan}-01`)) {
            return res.status(400).json({ error: 'Bulan harus berformat YYYY-MM' });
        }

        const baris = await Analisis.pengeluaranPerKategori(req.user.id, bulan, hariIni());
        const total = baris.reduce((jumlah, b) => jumlah + Number(b.total), 0);

        const kategori = baris.map((b) => {
            const nilai = Number(b.total);
            const persen = total > 0 ? Math.round((nilai / total) * 1000) / 10 : 0;
            return {
                nama: b.kategori,
                total: nilai,
                jumlah: Number(b.jumlah),
                persen,
                dominan: persen >= BATAS_DOMINAN,
            };
        });

        res.status(200).json({
            bulan,
            total_pengeluaran: total,
            batas_dominan: BATAS_DOMINAN,
            terbesar: kategori[0] ?? null,
            kategori,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
};