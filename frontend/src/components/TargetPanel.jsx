import { useState } from 'react';
import { formatRupiah, formatTanggal } from '../lib/format.js';
import { kelasInput, kelasKartu, kelasTombolIkon, kelasTombolTepi, kelasTombolUtama } from '../lib/gaya.js';
import Ikon from './Ikon.jsx';
import TargetForm from './TargetForm.jsx';

function TargetItem({ item, onSetor, onHapus }) {
    const [nominal, setNominal] = useState('');
    const [pesan, setPesan] = useState('');
    const [memproses, setMemproses] = useState(false);

    const sisa = item.nominal_target - item.terkumpul;
    const tercapai = sisa <= 0;
    const persen = Math.min(100, Math.floor((item.terkumpul / item.nominal_target) * 100));

    const setor = async (e) => {
        e.preventDefault();
        setPesan('');

        if (!(Number(nominal) > 0)) {
            setPesan('Isi nominal setoran terlebih dahulu.');
            return;
        }

        setMemproses(true);
        try {
            await onSetor(item.id, Number(nominal));
            setNominal('');
        } catch (error) {
            setPesan(error.message);
        } finally {
            setMemproses(false);
        }
    };

    return (
        <li className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-semibold">
                        {item.nama}
                        {tercapai && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                                <Ikon nama="centang" className="h-3 w-3" />
                                Tercapai
                            </span>
                        )}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {formatRupiah(item.terkumpul)} dari {formatRupiah(item.nominal_target)} ({persen}%)
                        {item.tenggat && ` · Tenggat ${formatTanggal(item.tenggat)}`}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => onHapus(item)}
                    aria-label={`Hapus target ${item.nama}`}
                    title="Hapus"
                    className={kelasTombolIkon}
                >
                    <Ikon nama="hapus" className="h-4 w-4" />
                </button>
            </div>

            <div
                role="progressbar"
                aria-label={`Progres ${item.nama}`}
                aria-valuenow={persen}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            >
                <div
                    className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                    style={{ width: `${persen}%` }}
                />
            </div>

            {!tercapai && (
                <form onSubmit={setor} className="mt-3 flex flex-wrap items-center gap-2">
                    <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder={`Sisa ${formatRupiah(sisa)}`}
                        aria-label={`Nominal setoran untuk ${item.nama}`}
                        value={nominal}
                        onChange={(e) => setNominal(e.target.value)}
                        className={`${kelasInput} max-w-52`}
                    />
                    <button type="submit" disabled={memproses} className={kelasTombolUtama}>
                        {memproses ? 'Menyetor...' : 'Setor'}
                    </button>
                </form>
            )}

            {pesan && (
                <p role="alert" className="mt-2 text-sm text-rose-600 dark:text-rose-400">
                    {pesan}
                </p>
            )}
        </li>
    );
}

export default function TargetPanel({ target, totalTabungan, onTambah, onSetor, onHapus }) {
    const [tampilForm, setTampilForm] = useState(false);

    const simpan = async (data) => {
        await onTambah(data);
        setTampilForm(false);
    };

    return (
        <section className={kelasKartu}>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="font-bold">Target tabungan</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Total sudah ditabung <strong className="text-slate-900 dark:text-slate-100">{formatRupiah(totalTabungan)}</strong>
                    </p>
                </div>
                {!tampilForm && (
                    <button type="button" onClick={() => setTampilForm(true)} className={kelasTombolTepi}>
                        <Ikon nama="plus" className="h-4 w-4" />
                        Tambah target
                    </button>
                )}
            </div>

            {tampilForm && <TargetForm onSimpan={simpan} onBatal={() => setTampilForm(false)} />}

            {target.length === 0 ? (
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                    Belum ada target. Buat target pertamamu, misalnya "Laptop baru" atau "Dana darurat".
                </p>
            ) : (
                <ul className="mt-4 space-y-3">
                    {target.map((item) => (
                        <TargetItem key={item.id} item={item} onSetor={onSetor} onHapus={onHapus} />
                    ))}
                </ul>
            )}
        </section>
    );
}