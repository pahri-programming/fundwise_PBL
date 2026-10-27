const KUNCI = 'fundwise_sesi';

export const ambilSesi = () => {
    try {
        const teks = localStorage.getItem(KUNCI);
        return teks ? JSON.parse(teks) : null;
    } catch {
        return null;
    }
};

export const simpanSesi = (sesi) => {
    localStorage.setItem(KUNCI, JSON.stringify(sesi));
};

export const hapusSesi = () => {
    localStorage.removeItem(KUNCI);
};