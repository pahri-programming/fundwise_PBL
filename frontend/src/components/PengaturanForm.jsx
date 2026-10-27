import { useState } from 'react';
import { kelasInput, kelasKartu, kelasLabel, kelasTombolTepi, kelasTombolUtama } from '../lib/gaya.js';

export default function PengaturanForm({ pengaturan, onSimpan, onTutup }) {
    const [kewajiban, setKewajiban] = useState(String(pengaturan.kewajiban));
    const [cadangan, setCadangan] = useState(String(pengaturan.sisihkan_tabungan));
    const [tanggal, setTanggal] = useState(pengaturan.pemasukan_berikutnya ?? '');
    const [pesan, setPesan] = useState('');
    const [menyimpan, setMenyimpan] = useState(false);

    const kirim = async (e) => {
        e.preventDefault();
        setPesan('');
        setMenyimpan(true);
        try {
            await onSimpan({
                kewajiban: Number(kewajiban || 0),
                sisihkan_tabungan: Number(cadangan || 0),
                pemasukan_berikutnya: tanggal || null,
            });
        } catch (error) {
            setPesan(error.message);
        } finally {
            setMenyimpan(false);
        }
    };

    const kelasBantu = 'mt-1.5 text-xs text-slate-500 dark:text-slate-400';

    return (
        <section className={`${kelasKartu} mt-6`}>
            <h2 className="font-bold">Atur anggaran harian</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Anggaran harian = (saldo - kewajiban - dana cadangan) dibagi jumlah hari sampai pemasukan berikutnya.
            </p>

            <form onSubmit={kirim} className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                    <label htmlFor="kewajiban" className={kelasLabel}>Kewajiban (Rp)</label>
                    <input
                        id="kewajiban"
                        type="number"
                        min="0"
                        value={kewajiban}
                        onChange={(e) => setKewajiban(e.target.value)}
                        className={kelasInput}
                    />
                    <p className={kelasBantu}>Tagihan yang harus dibayar, misalnya kos atau listrik.</p>
                </div>

                <div>
                    <label htmlFor="cadangan" className={kelasLabel}>Dana cadangan (Rp)</label>
                    <input
                        id="cadangan"
                        type="number"
                        min="0"
                        value={cadangan}
                        onChange={(e) => setCadangan(e.target.value)}
                        className={kelasInput}
                    />
                    <p className={kelasBantu}>
                        Uang yang sengaja ditahan untuk keadaan darurat, misalnya sakit atau kecelakaan. Tidak
                        berkurang saat kamu setor ke target.
                    </p>
                </div>

                <div>
                    <label htmlFor="pemasukan-berikutnya" className={kelasLabel}>Pemasukan berikutnya</label>
                    <input
                        id="pemasukan-berikutnya"
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
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
                        {menyimpan ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button type="button" onClick={onTutup} className={kelasTombolTepi}>
                        Batal
                    </button>
                </div>
            </form>
        </section>
    );
}