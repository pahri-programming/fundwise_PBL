// Ikon SVG gaya garis. Pemakaian: <Ikon nama="plus" className="h-4 w-4" />
const jalur = {
    matahari:
        'M12 8a4 4 0 100 8 4 4 0 000-8z M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41',
    bulan: 'M12 3a6 6 0 009 9 9 9 0 11-9-9z',
    plus: 'M5 12h14 M12 5v14',
    hapus: 'M3 6h18 M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6 M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2 M10 11v6 M14 11v6',
    pensil: 'M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5z M15 5l4 4',
    keluar: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
    panahAtas: 'M5 12l7-7 7 7 M12 19V5',
    panahBawah: 'M12 5v14 M19 12l-7 7-7-7',
    target:
        'M12 22a10 10 0 100-20 10 10 0 000 20z M12 18a6 6 0 100-12 6 6 0 000 12z M12 14a2 2 0 100-4 2 2 0 000 4z',
    dompet:
        'M19 7V4a1 1 0 00-1-1H5a2 2 0 000 4h15a1 1 0 011 1v4h-3a2 2 0 000 4h3a1 1 0 001-1v-2a1 1 0 00-1-1 M3 5v14a2 2 0 002 2h15a1 1 0 001-1v-4',
    naik: 'M22 7l-8.5 8.5-5-5L2 17 M16 7h6v6',
    bintang: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    kalender: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
    centang: 'M20 6L9 17l-5-5',
    tutup: 'M18 6L6 18 M6 6l12 12',
    perisai: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    pengatur: 'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6',
};

export default function Ikon({ nama, className = 'h-5 w-5' }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={className}
        >
            <path d={jalur[nama]} />
        </svg>
    );
}
