import Transaksi from '../models/transaksiModel.mjs';
import Kategori from '../models/kategoriModel.mjs';
import { tanggalValid,hariIni, selisihHari } from '../utils/tanggal.mjs';

const jenis_valid = ['masuk', 'keluar'];
const nominal_maks = 9999999999999; // batas decimal(15,2)

//validasi input untuk tambah dan ubah transaksi
const periksaInput = async (body) => {
    const { kategori_id, jenis, nominal, tanggal, catatan } = body;

    if (!jenis_valid.includes(jenis)) {
        return { error: "Jenis harus 'masuk' atau 'keluar'" };
    }

    const angka = Number(nominal);
    if (!Number.isInteger(angka) || angka <= 0) {
        return { error: 'Nominal harus bilangan bulat lebih dari 0' };
    }
    if (angka > nominal_maks) {
        return { error: 'Nominal terlalu besar' };
    }
    if (!tanggalValid(tanggal)) {
        return { error: 'Tanggal harus berformat YYYY-MM-DD dan valid' };
    }
    const selisih = selisihHari(hariIni(), tanggal);
    if (selisih > 365 || selisih < -3650) {
        return { error: 'Tanggal di luar rentang yang diizinkan' };
    }

    const idKategori = Number(kategori_id);
    if (!Number.isInteger(idKategori) || idKategori <= 0) {
        return { error: 'Kategori wajib dipilih' };
    }
    const kategori = await Kategori.getById(idKategori);
    if (!kategori) {
        return { error: 'Kategori tidak ditemukan' };
    }
    if (kategori.jenis !== jenis) {
        return { error: `Kategori "${kategori.nama}" bukan kategori ${jenis}` };
    }

    const catatanBersih = typeof catatan === 'string' ? catatan.trim() : '';
    if (catatanBersih.length > 255) {
        return { error: 'Catatan maksimal 255 karakter' };
    }

    return {
        data: {
            kategori_id: idKategori,
            jenis,
            nominal: angka,
            tanggal,
            catatan: catatanBersih || null,
        },
    };
};

const ambilId = (req) => {
    const id = Number(req.params.id);
    return Number.isInteger(id) && id > 0 ? id : null;
};

const galatServer = (res, error) => {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
};

export const getSemuaTransaksi = async (req, res) => {
    try {
        const { jenis, bulan } = req.query;

        if (jenis && !jenis_valid.includes(jenis)) {
            return res.status(400).json({ error: "Jenis harus 'masuk' atau 'keluar'" });
        }
        if (bulan && !/^\d{4}-(0[1-9]|1[0-2])$/.test(bulan)) {
            return res.status(400).json({ error: 'Bulan harus berformat YYYY-MM' });
        }

        const transaksi = await Transaksi.getAll(req.user.id, { jenis, bulan });
        res.status(200).json(transaksi);
    } catch (error) {
        galatServer(res, error);
    }
};

export const getTransaksiById = async (req, res) => {
    try {
        const id = ambilId(req);
        if (!id) return res.status(400).json({ error: 'ID tidak valid' });

        const transaksi = await Transaksi.getById(req.user.id, id);
        if (!transaksi) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });

        res.status(200).json(transaksi);
    } catch (error) {
        galatServer(res, error);
    }
};

export const tambahTransaksi = async (req, res) => {
    try {
        const { error, data } = await periksaInput(req.body ?? {});
        if (error) return res.status(400).json({ error });

        const idBaru = await Transaksi.create(req.user.id, data);
        const transaksi = await Transaksi.getById(req.user.id, idBaru);
        res.status(201).json(transaksi);
    } catch (error) {
        galatServer(res, error);
    }
};

export const updateTransaksi = async (req, res) => {
    try {
        const id = ambilId(req);
        if (!id) return res.status(400).json({ error: 'ID tidak valid' });

        const ada = await Transaksi.getById(req.user.id, id);
        if (!ada) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });

        const { error, data } = await periksaInput(req.body ?? {});
        if (error) return res.status(400).json({ error });

        await Transaksi.update(req.user.id, id, data);
        const transaksi = await Transaksi.getById(req.user.id, id);
        res.status(200).json(transaksi);
    } catch (error) {
        galatServer(res, error);
    }
};

export const hapusTransaksi = async (req, res) => {
    try {
        const id = ambilId(req);
        if (!id) return res.status(400).json({ error: 'ID tidak valid' });

        const terhapus = await Transaksi.remove(req.user.id, id);
        if (!terhapus) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });

        res.status(200).json({ pesan: 'Transaksi berhasil dihapus' });
    } catch (error) {
        galatServer(res, error);
    }
};