import Target from '../models/targetModel.mjs';
import { tanggalValid, hariIni, selisihHari } from '../utils/tanggal.mjs';

const nominal_maks = 9999999999999;

const galatServer = (res, error) => {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
};

const ambilId = (req) => {
    const id = Number(req.params.id);
    return Number.isInteger(id) && id > 0 ? id : null;
};

const nominalBulat = (nilai) => {
    if (typeof nilai !== 'number' && typeof nilai !== 'string') return null;
    const angka = Number(nilai);
    return Number.isInteger(angka) && angka > 0 && angka <= nominal_maks ? angka : null;
};

export const getSemuaTarget = async (req, res) => {
    try {
        const target = await Target.getAll(req.user.id);
        res.status(200).json(target);
    } catch (error) {
        galatServer(res, error);
    }
};

export const tambahTarget = async (req, res) => {
    try {
        const { nama, nominal_target, tenggat } = req.body ?? {};

        const namaBersih = typeof nama === 'string' ? nama.trim() : '';
        if (namaBersih.length < 2 || namaBersih.length > 100) {
            return res.status(400).json({ error: 'Nama target harus 2 sampai 100 karakter' });
        }

        const nominal = nominalBulat(nominal_target);
        if (!nominal) {
            return res.status(400).json({ error: 'Nominal target harus bilangan bulat lebih dari 0' });
        }

        let tanggal = null;
        if (tenggat) {
            if (!tanggalValid(tenggat)) {
                return res.status(400).json({ error: 'Tenggat harus berformat YYYY-MM-DD dan valid' });
            }
            if (selisihHari(hariIni(), tenggat) < 0) {
                return res.status(400).json({ error: 'Tenggat tidak boleh sebelum hari ini' });
            }
            tanggal = tenggat;
        }

        const idBaru = await Target.create(req.user.id, {
            nama: namaBersih,
            nominal_target: nominal,
            tenggat: tanggal,
        });
        const target = await Target.getById(req.user.id, idBaru);
        res.status(201).json(target);
    } catch (error) {
        galatServer(res, error);
    }
};

export const setorKeTarget = async (req, res) => {
    try {
        const id = ambilId(req);
        if (!id) return res.status(400).json({ error: 'ID tidak valid' });

        const nominal = nominalBulat((req.body ?? {}).nominal);
        if (!nominal) {
            return res.status(400).json({ error: 'Nominal setoran harus bilangan bulat lebih dari 0' });
        }

        const hasil = await Target.setor(req.user.id, id, nominal, hariIni());
        if (hasil.galat) {
            return res.status(hasil.status).json({ error: hasil.galat });
        }

        const target = await Target.getById(req.user.id, id);
        res.status(201).json(target);
    } catch (error) {
        galatServer(res, error);
    }
};

export const hapusTarget = async (req, res) => {
    try {
        const id = ambilId(req);
        if (!id) return res.status(400).json({ error: 'ID tidak valid' });

        const terhapus = await Target.remove(req.user.id, id);
        if (!terhapus) return res.status(404).json({ error: 'Target tidak ditemukan' });

        res.status(200).json({ pesan: 'Target dihapus, dana yang sudah ditabung kembali ke saldo' });
    } catch (error) {
        galatServer(res, error);
    }
};