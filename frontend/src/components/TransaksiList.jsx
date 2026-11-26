import { useState } from 'react';
import { formatRupiah, formatTanggal } from '../lib/format.js';
import { kelasKartu, kelasTombolIkon, kelasTombolTepi } from '../lib/gaya.js';
import CetakRiwayat from './CetakRiwayat.jsx';
import Ikon from './Ikon.jsx';

const UKURAN_HALAMAN = 10;

export default function TransaksiList({ transaksi, sedangEditId, onEdit, onHapus }) {
    const [jumlahTampil, setJumlahTampil] = useState(UKURAN_HALAMAN);
    const terlihat = transaksi.slice(0, jumlahTampil);
    const sisa = transaksi.length - terlihat.length;

    return (
        <section className={kelasKartu}>
            <h2 className="font-bold">Riwayat transaksi</h2>
            <CetakRiwayat transaksi={transaksi} />

            {transaksi.length === 0 ? (
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                    Belum ada transaksi. Tambahkan transaksi pertamamu lewat formulir.
                </p>
            ) : (
                <>
                    <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800 lg:max-h-[32rem] lg:overflow-y-auto">
                        {terlihat.map((item) => {
                            const masuk = item.jenis === 'masuk';
                            return (
                                <li
                                    key={item.id}
                                    className={`flex items-center gap-3 rounded-xl px-2 py-3 ${
                                        sedangEditId === item.id ? 'bg-emerald-50 dark:bg-emerald-500/10' : ''
                                    }`}
                                >
                                    <span
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                            masuk
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                                : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                                        }`}
                                    >
                                        <Ikon nama={masuk ? 'panahAtas' : 'panahBawah'} className="h-4 w-4" />
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold">{item.kategori}</p>
                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                            {formatTanggal(item.tanggal)}
                                            {item.catatan && ` · ${item.catatan}`}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 flex-col items-end gap-0.5 sm:flex-row sm:items-center sm:gap-1">
                                        <span
                                            className={`text-sm font-bold tabular-nums sm:mr-2 ${
                                                masuk
                                                    ? 'text-emerald-700 dark:text-emerald-400'
                                                    : 'text-rose-600 dark:text-rose-400'
                                            }`}
                                        >
                                            {masuk ? '+' : '−'}
                                            {formatRupiah(item.nominal)}
                                        </span>
                                        <div className="flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(item)}
                                                aria-label={`Edit transaksi ${item.kategori}`}
                                                title="Edit"
                                                className={kelasTombolIkon}
                                            >
                                                <Ikon nama="pensil" className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onHapus(item)}
                                                aria-label={`Hapus transaksi ${item.kategori}`}
                                                title="Hapus"
                                                className={kelasTombolIkon}
                                            >
                                                <Ikon nama="hapus" className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {transaksi.length > UKURAN_HALAMAN && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span>
                                Menampilkan {terlihat.length} dari {transaksi.length} transaksi
                            </span>
                            <div className="flex gap-2">
                                {sisa > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setJumlahTampil((n) => n + UKURAN_HALAMAN)}
                                        className={kelasTombolTepi}
                                    >
                                        Tampilkan {Math.min(UKURAN_HALAMAN, sisa)} lagi
                                    </button>
                                )}
                                {jumlahTampil > UKURAN_HALAMAN && (
                                    <button
                                        type="button"
                                        onClick={() => setJumlahTampil(UKURAN_HALAMAN)}
                                        className={kelasTombolTepi}
                                    >
                                        Ciutkan
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}