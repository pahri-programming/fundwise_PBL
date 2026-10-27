import { useCallback, useEffect, useState } from 'react';

const KUNCI = 'fundwise_tema';

// Tema awal: pilihan yang tersimpan, kalau belum ada ikuti pengaturan perangkat
const temaAwal = () => {
    try {
        const simpan = localStorage.getItem(KUNCI);
        if (simpan === 'dark' || simpan === 'light') return simpan;
    } catch {
        // localStorage tidak tersedia: abaikan
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Mengembalikan [tema, gantiTema]. Tema 'dark' memasang kelas "dark" di <html>.
export function useTema() {
    const [tema, setTema] = useState(temaAwal);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', tema === 'dark');
    }, [tema]);

    const gantiTema = useCallback(() => {
        const baru = tema === 'dark' ? 'light' : 'dark';
        setTema(baru);
        try {
            localStorage.setItem(KUNCI, baru);
        } catch {
            // abaikan
        }
    }, [tema]);

    return [tema, gantiTema];
}
