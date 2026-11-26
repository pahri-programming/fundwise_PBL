import Ringkasan from '../models/ringkasanModel.mjs';
import Pengaturan from '../models/pengaturanModel.mjs';
import { tanggalValid, hariIni, bulanIni, selisihHari } from '../utils/tanggal.mjs';

const NOMINAL_MAKS = 9999999999999; // batas DECIMAL(15,2)

const galatServer = (res, error) => {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
};

// Berisi data untuk 4 kartu di dashboard.
export const getRingkasan = async (req, res) => {
    try {
        const bulan = req.query.bulan ?? bulanIni();
        if (!tanggalValid(`${bulan}-01`)) {
            return res.status(400).json({ error: 'Bulan harus berformat YYYY-MM' });
        }

        const [saldoDb, total, pengaturan, totalTabungan] = await Promise.all([
            Ringkasan.saldo(req.user.id, hariIni()),
            Ringkasan.totalBulan(req.user.id, bulan),
            Pengaturan.get(req.user.id),
            Ringkasan.totalTabungan(req.user.id),
        ]);

        const saldo = Number(saldoDb);
        const kewajiban = Number(pengaturan.kewajiban);
        const sisihkanTabungan = Number(pengaturan.sisihkan_tabungan);
        const pemasukanBerikutnya = pengaturan.pemasukan_berikutnya; // 'YYYY-MM-DD' atau null

        // dana fleksibel = saldo - kewajiban - tabungan
        const danaFleksibel = saldo - kewajiban - sisihkanTabungan;

        // anggaran harian
        const sisaHari = pemasukanBerikutnya
            ? selisihHari(hariIni(), pemasukanBerikutnya)
            : null;

        let perHari = null; // null = belum bisa dihitung (tanggal belum diisi / sudah lewat)
        if (sisaHari !== null && sisaHari > 0) {
            perHari = Math.max(0, Math.floor(danaFleksibel / sisaHari));
        }

        res.status(200).json({
            bulan,
            saldo,
            total_pemasukan: Number(total.pemasukan),
            total_pengeluaran: Number(total.pengeluaran),
            total_tabungan: Number(totalTabungan),
            anggaran_harian: {
                per_hari: perHari,
                dana_fleksibel: danaFleksibel,
                sisa_hari: sisaHari,
                kewajiban,
                sisihkan_tabungan: sisihkanTabungan,
                pemasukan_berikutnya: pemasukanBerikutnya,
            },
        });
    } catch (error) {
        galatServer(res, error);
    }
};

const formatPengaturan = (p) => ({
    kewajiban: Number(p.kewajiban),
    sisihkan_tabungan: Number(p.sisihkan_tabungan),
    pemasukan_berikutnya: p.pemasukan_berikutnya,
});

export const getPengaturan = async (req, res) => {
    try {
        const pengaturan = await Pengaturan.get(req.user.id);
        res.status(200).json(formatPengaturan(pengaturan));
    } catch (error) {
        galatServer(res, error);
    }
};

const angkaNolAtauLebih = (nilai) => {
    const angka = Number(nilai);
    return Number.isFinite(angka) && angka >= 0 && angka <= NOMINAL_MAKS ? angka : null;
};

export const updatePengaturan = async (req, res) => {
    try {
        const { kewajiban, sisihkan_tabungan, pemasukan_berikutnya } = req.body ?? {};

        const kewajibanAngka = angkaNolAtauLebih(kewajiban ?? 0);
        if (kewajibanAngka === null) {
            return res.status(400).json({ error: 'Kewajiban harus berupa angka 0 atau lebih' });
        }

        const tabunganAngka = angkaNolAtauLebih(sisihkan_tabungan ?? 0);
        if (tabunganAngka === null) {
            return res.status(400).json({ error: 'Tabungan harus berupa angka 0 atau lebih' });
        }

        // Tanggal pemasukan berikutnya boleh dikosongkan
        let tanggal = null;
        if (pemasukan_berikutnya) {
            if (!tanggalValid(pemasukan_berikutnya)) {
                return res.status(400).json({ error: 'Tanggal harus berformat YYYY-MM-DD dan valid' });
            }
            tanggal = pemasukan_berikutnya;
        }

        await Pengaturan.update(req.user.id, {
            kewajiban: kewajibanAngka,
            sisihkan_tabungan: tabunganAngka,
            pemasukan_berikutnya: tanggal,
        });

        const baru = await Pengaturan.get(req.user.id);
        res.status(200).json(formatPengaturan(baru));
    } catch (error) {
        galatServer(res, error);
    }
};