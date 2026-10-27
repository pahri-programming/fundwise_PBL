import { useState } from 'react';
import { tanggalHariIni } from '../lib/format.js';
import { kelasInput, kelasLabel, kelasTombolTepi, kelasTombolUtama } from '../lib/gaya.js';

export default function TargetForm({ onSimpan, onBatal }) {
    const [nama, setNama] = useState('');
    const [nominal, setNominal] = useState('');
    const [tenggat, setTenggat] = useState('');
    const [pesan, setPesan] = useState('');
    const [menyimpan, setMenyimpan] = useState(false);

    const kirim = async (e) => {
        e.preventDefault();
        setPesan('');

        if (nama.trim().length < 2) {
            setPesan('Nama target minimal 2 huruf.');
            return;
        }
        if (!(Number(nominal) > 0)) {
            setPesan('Nominal target harus lebih dari 0.');
            return;
        }

        setMenyimpan(true);
        try {
            await onSimpan({
                nama,
                nominal_target: Number(nominal),
                tenggat: tenggat || null,
            });
        } catch (error) {
            setPesan(error.message);
        } finally {
            setMenyimpan(false);
        }
    };

    return (
        <form
            onSubmit={kirim}
            className="mt-4 grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3 dark:bg-slate-800/50"
        >
            <div>
                <label htmlFor="nama-target" className={kelasLabel}>Nama target</label>
                <input
                    id="nama-target"
                    type="text"
                    maxLength={100}
                    placeholder="Contoh: Laptop baru"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className={kelasInput}
                />
            </div>

            <div>
                <label htmlFor="nominal-target" className={kelasLabel}>Nominal target (Rp)</label>
                <input
                    id="nominal-target"
                    type="number"
                    min="1"
                    step="1"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    className={kelasInput}
                />
            </div>

            <div>
                <label htmlFor="tenggat-target" className={kelasLabel}>Tenggat (boleh kosong)</label>
                <input
                    id="tenggat-target"
                    type="date"
                    min={tanggalHariIni()}
                    value={tenggat}
                    onChange={(e) => setTenggat(e.target.value)}
                    className={kelasInput}
                />
            </div>

            {pesan && (
                <p
                    role="alert"
                    className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 sm:col-span-3 dark:bg-rose-500/10 dark:text-rose-300"
                >
                    {pesan}
                </p>
            )}

            <div className="flex gap-2 sm:col-span-3">
                <button type="submit" disabled={menyimpan} className={kelasTombolUtama}>
                    {menyimpan ? 'Menyimpan...' : 'Simpan target'}
                </button>
                <button type="button" onClick={onBatal} className={kelasTombolTepi}>
                    Batal
                </button>
            </div>
        </form>
    );
}