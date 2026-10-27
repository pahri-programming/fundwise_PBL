import { formatBulan, formatRupiah, formatTanggal } from '../lib/format.js';

function Kartu({ judul, children }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-600">{judul}</p>
            {children}
        </div>
    );
}

export default function RingkasanKartu({ ringkasan, onAtur }) {
    const { bulan, saldo, total_pemasukan, total_pengeluaran, anggaran_harian: a } = ringkasan;

    return (
        <section aria-label="Ringkasan keuangan" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kartu judul="Saldo saat ini">
                <p className={`mt-3 text-2xl font-bold ${saldo < 0 ? 'text-red-600' : ''}`}>
                    {formatRupiah(saldo)}
                </p>
                <p className="mt-2 text-xs text-slate-500">Semua pemasukan dikurangi pengeluaran</p>
                <p className="mt-2 text-xs text-slate-500">Di luar uang yang sudah ditabung</p>
            </Kartu>

            <Kartu judul="Total pemasukan">
                <p className="mt-3 text-2xl font-bold text-emerald-700">{formatRupiah(total_pemasukan)}</p>
                <p className="mt-2 text-xs text-slate-500">{formatBulan(bulan)}</p>
            </Kartu>

            <Kartu judul="Total pengeluaran">
                <p className="mt-3 text-2xl font-bold text-red-600">{formatRupiah(total_pengeluaran)}</p>
                <p className="mt-2 text-xs text-slate-500">{formatBulan(bulan)}</p>
            </Kartu>

            <Kartu judul="Anggaran harian">
                {a.per_hari === null ? (
                    <p className="mt-3 text-sm text-slate-600">
                        Isi tanggal pemasukan berikutnya agar anggaran harian bisa dihitung.
                    </p>
                ) : (
                    <>
                        <p className="mt-3 text-2xl font-bold">
                            {formatRupiah(a.per_hari)}{' '}
                            <span className="text-base font-semibold">per hari</span>
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                            Dari dana fleksibel {formatRupiah(a.dana_fleksibel)} untuk {a.sisa_hari} hari.
                        </p>
                    </>
                )}

                <p className="mt-2 text-xs text-slate-500">
                    Kewajiban {formatRupiah(a.kewajiban)}, tabungan {formatRupiah(a.sisihkan_tabungan)}
                    {a.pemasukan_berikutnya && `, pemasukan berikutnya ${formatTanggal(a.pemasukan_berikutnya)}`}.
                </p>

                {a.dana_fleksibel < 0 && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                        Dana fleksibel minus: saldo tidak cukup untuk kewajiban dan tabungan.
                    </p>
                )}

                <button
                    type="button"
                    onClick={onAtur}
                    className="mt-3 text-sm font-medium text-emerald-700 hover:underline"
                >
                    Atur anggaran
                </button>
            </Kartu>
        </section>
    );
}