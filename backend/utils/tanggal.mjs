const ZONA_WAKTU = 'Asia/Jakarta';

// Cek format YYYY-MM-DD
export const tanggalValid = (teks) => {
    if (typeof teks !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(teks)) return false;
    const d = new Date(`${teks}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === teks;
};

// Tanggal hari ini, format YYYY-MM-DD
export const hariIni = () =>
    new Date().toLocaleDateString('en-CA', { timeZone: ZONA_WAKTU });

// Bulan berjalan, format YYYY-MM
export const bulanIni = () => hariIni().slice(0, 7);

// Selisih hari antara dua tanggal
export const selisihHari = (dari, sampai) => {
    const ms = new Date(`${sampai}T00:00:00Z`) - new Date(`${dari}T00:00:00Z`);
    return Math.round(ms / 86400000);
};