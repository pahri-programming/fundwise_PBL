const rupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export const formatRupiah = (angka) => rupiah.format(angka);

export const tanggalHariIni = () =>
    new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

export const formatTanggal = (teks) =>
    new Date(`${teks}T00:00:00`).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

export const formatBulan = (teks) =>
    new Date(`${teks}-01T00:00:00`).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
    });