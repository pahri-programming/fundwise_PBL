import Kategori from '../models/kategoriModel.mjs';

export const getSemuaKategori = async (req, res) => {
    try {
        const {jenis} = req.query;
        if (jenis && !['masuk', 'keluar'].includes(jenis)) {
            return res.status(400).json({ error: "Jenis harus 'masuk' atau 'keluar'"});
        }
        const kategori = await Kategori.getAll(jenis);
        res.status(200).json(kategori);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
};