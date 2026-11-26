import { useEffect, useState } from 'react';
import { ambilAnalisis } from '../lib/api.js';
import { formatRupiah, formatBulan, tanggalHariIni } from '../lib/format.js';
import { kelasKartu, kelasInput } from '../lib/gaya.js';

export default function AnalisisPengeluaran({ transaksi }) {
    const [bulan, setBulan] = useState(tanggalHariIni().slice(0, 7));
    const [data, setData] = useState(null);
    const [galat, setGalat] = useState('');

    // Muat ulang saat bulan diganti atau daftar transaksi berubah (tambah/edit/hapus)
    useEffect(() => {
        if (!bulan) return undefined;
        let batal = false;
        ambilAnalisis(bulan)
            .then((hasil) => {
                if (!batal) {
                    setData(hasil);
                    setGalat('');
                }
            })
            .catch((error) => {
                if (!batal) setGalat(error.message);
            });
        return () => {
            batal = true;
        };
    }, [bulan, transaksi]);

    return (
        <section aria-label="Analisis pengeluaran" className={kelasKartu}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="font-bold">Analisis pengeluaran</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Ke mana uangmu paling banyak keluar{bulan && ` di ${formatBulan(bulan)}`}.
                    </p>
                </div>
                <div className="w-44">
                    <label htmlFor="bulan-analisis" className="sr-only">
                        Pilih bulan
                    </label>
                    <input
                        id="bulan-analisis"
                        type="month"
                        value={bulan}
                        onChange={(e) => setBulan(e.target.value)}
                        className={kelasInput}
                    />
                </div>
            </div>

            {galat && (
                <p role="alert" className="mt-4 text-sm text-rose-600 dark:text-rose-400">
                    {galat}
                </p>
            )}

            {!galat && data && data.kategori.length === 0 && (
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                    Belum ada pengeluaran di bulan ini.
                </p>
            )}

            {!galat && data && data.kategori.length > 0 && (
                <>
                    <p className="mt-4 text-sm">
                        Pengeluaran terbesar:{' '}
                        <strong>{data.terbesar.nama}</strong> ({formatRupiah(data.terbesar.total)},{' '}
                        {data.terbesar.persen}% dari total {formatRupiah(data.total_pengeluaran)})
                    </p>

                    <ul className="mt-4 space-y-3">
                        {data.kategori.map((k) => (
                            <li key={k.nama}>
                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <span className="font-medium">
                                        {k.nama}
                                        {k.dominan && (
                                            <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                                                dominan
                                            </span>
                                        )}
                                    </span>
                                    <span className="tabular-nums text-slate-600 dark:text-slate-400">
                                        {formatRupiah(k.total)} · {k.persen}%
                                    </span>
                                </div>
                                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                        className={`h-full rounded-full ${k.dominan ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${k.persen}%` }}
                                    />
                                </div>
                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                    {k.jumlah} transaksi
                                </p>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                        Label "dominan" = porsi ≥ {data.batas_dominan}% dari total pengeluaran bulan itu
                        (ambang ini asumsi, bukan standar baku).
                    </p>
                </>
            )}
        </section>
    );
}