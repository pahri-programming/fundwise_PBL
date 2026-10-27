import { useAngkaBergerak } from '../lib/useAngkaBergerak.js';
import { formatRupiah, formatTanggal } from '../lib/format.js';
import { kelasKartu, kelasTombolTepi } from '../lib/gaya.js';
import Ikon from './Ikon.jsx';

// Satu baris rumus: label di kiri, nilai di kanan
function Baris({ tanda, label, nilai, tebal = false, merah = false }) {
    return (
        <div className={`flex items-center justify-between gap-3 ${tebal ? 'font-semibold' : ''}`}>
            <dt className="text-slate-600 dark:text-slate-400">
                {tanda && <span className="mr-1.5 inline-block w-3 text-center text-slate-400">{tanda}</span>}
                {label}
            </dt>
            <dd className={`tabular-nums ${merah ? 'text-rose-600 dark:text-rose-400' : ''}`}>
                {formatRupiah(nilai)}
            </dd>
        </div>
    );
}

// Kartu anggaran harian: angka per hari + rumus langkah demi langkah
export default function AnggaranHarian({ ringkasan, onAtur }) {
    const a = ringkasan.anggaran_harian;
    const perHari = useAngkaBergerak(a.per_hari ?? 0);
    const bisaDihitung = a.per_hari !== null;
    const tanggalLewat = a.pemasukan_berikutnya && a.sisa_hari !== null && a.sisa_hari <= 0;

    return (
        <section aria-label="Anggaran harian" className={`${kelasKartu} flex h-full flex-col`}>
            <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold">Anggaran harian</h2>
                <button type="button" onClick={onAtur} className={`${kelasTombolTepi} px-3 py-1.5`}>
                    <Ikon nama="pengatur" className="h-4 w-4" />
                    Atur
                </button>
            </div>

            {bisaDihitung ? (
                <>
                    <p className="mt-4 text-4xl font-extrabold tracking-tight text-emerald-700 tabular-nums dark:text-emerald-400">
                        {formatRupiah(perHari)}
                        <span className="ml-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">/ hari</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Panduan supaya uangmu cukup sampai pemasukan berikutnya.
                    </p>
                </>
            ) : (
                <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                    {tanggalLewat
                        ? 'Tanggal pemasukan berikutnya sudah lewat. Perbarui lewat tombol Atur.'
                        : 'Isi tanggal pemasukan berikutnya lewat tombol Atur agar anggaran harian bisa dihitung.'}
                </p>
            )}

            <dl className="mt-5 space-y-2 border-t border-dashed border-slate-200 pt-4 text-sm dark:border-slate-800">
                <Baris label="Saldo" nilai={ringkasan.saldo} />
                <Baris tanda="−" label="Kewajiban" nilai={a.kewajiban} />
                <Baris tanda="−" label="Dana cadangan" nilai={a.sisihkan_tabungan} />
                <div className="border-t border-slate-200 pt-2 dark:border-slate-800">
                    <Baris tanda="=" label="Dana fleksibel" nilai={a.dana_fleksibel} tebal merah={a.dana_fleksibel < 0} />
                </div>
                {a.sisa_hari !== null && a.sisa_hari > 0 && (
                    <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-400">
                        <dt>
                            <span className="mr-1.5 inline-block w-3 text-center text-slate-400">÷</span>
                            Sisa hari
                        </dt>
                        <dd className="text-right">
                            {a.sisa_hari} hari
                            {a.pemasukan_berikutnya && (
                                <span className="block text-xs text-slate-400">
                  sampai {formatTanggal(a.pemasukan_berikutnya)}
                </span>
                            )}
                        </dd>
                    </div>
                )}
            </dl>

            {a.dana_fleksibel < 0 && (
                <p
                    role="alert"
                    className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                >
                    Dana fleksibel minus: saldo tidak cukup untuk kewajiban dan dana cadangan.
                </p>
            )}
        </section>
    );
}
