import { useAngkaBergerak } from '../lib/useAngkaBergerak.js';
import { formatBulan, formatRupiah } from '../lib/format.js';
import Ikon from './Ikon.jsx';

// Satu kotak kecil di dalam kartu saldo (pemasukan / pengeluaran / tabungan)
function Statistik({ ikon, label, nilai }) {
    const angka = useAngkaBergerak(nilai);

    return (
        <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-100">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
          <Ikon nama={ikon} className="h-3.5 w-3.5" />
        </span>
                {label}
            </div>
            <p className="mt-2 text-lg font-bold tabular-nums">{formatRupiah(angka)}</p>
        </div>
    );
}

// Kartu utama: saldo besar + tiga angka ringkas di bawahnya
export default function SaldoHero({ ringkasan }) {
    const saldo = useAngkaBergerak(ringkasan.saldo);

    return (
        <section
            aria-label="Saldo"
            className="relative h-full overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-lg shadow-emerald-900/20 sm:p-8 dark:from-emerald-700 dark:via-emerald-800 dark:to-teal-900"
        >
            {/* Hiasan cahaya (tidak dibaca pembaca layar) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 animate-melayang rounded-full bg-white/10 blur-2xl motion-reduce:animate-none"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 animate-melayang rounded-full bg-teal-300/20 blur-3xl [animation-delay:-4s] motion-reduce:animate-none"
            />

            <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-emerald-100">Saldo saat ini</p>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            {formatBulan(ringkasan.bulan)}
          </span>
                </div>

                <p
                    className={`mt-2 text-4xl font-extrabold tracking-tight tabular-nums sm:text-5xl ${
                        ringkasan.saldo < 0 ? 'text-rose-200' : ''
                    }`}
                >
                    {formatRupiah(saldo)}
                </p>
                <p className="mt-1 text-sm text-emerald-100/90">Di luar uang yang sudah ditabung</p>

                <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-3">
                    <Statistik ikon="panahAtas" label="Pemasukan bulan ini" nilai={ringkasan.total_pemasukan} />
                    <Statistik ikon="panahBawah" label="Pengeluaran bulan ini" nilai={ringkasan.total_pengeluaran} />
                    <Statistik ikon="naik" label="Total ditabung" nilai={ringkasan.total_tabungan} />
                </div>
            </div>
        </section>
    );
}
