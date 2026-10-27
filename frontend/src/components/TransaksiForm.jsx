import { useState } from 'react';
import { tanggalHariIni } from '../lib/format.js';
import { kelasChip, kelasInput, kelasKartu, kelasLabel, kelasTombolTepi, kelasTombolUtama } from '../lib/gaya.js';

export default function TransaksiForm({ kategori, sedangEdit, onSimpan, onBatal }) {
    const [jenis, setJenis] = useState(sedangEdit?.jenis ?? 'keluar');
    const [nominal, setNominal] = useState(sedangEdit ? String(sedangEdit.nominal) : '');
    const [kategoriId, setKategoriId] = useState(sedangEdit ? String(sedangEdit.kategori_id) : '');
    const [tanggal, setTanggal] = useState(sedangEdit?.tanggal ?? tanggalHariIni());
    const [catatan, setCatatan] = useState(sedangEdit?.catatan ?? '');
    const [pesan, setPesan] = useState('');
    const [menyimpan, setMenyimpan] = useState(false);

    const pilihanKategori = kategori.filter((k) => k.jenis === jenis);

    const gantiJenis = (jenisBaru) => {
        setJenis(jenisBaru);
        setKategoriId('');
    };

    const kirim = async (e) => {
        e.preventDefault();
        setPesan('');

        if (!(Number(nominal) > 0)) {
            setPesan('Jumlah harus lebih dari 0.');
            return;
        }
        if (!kategoriId) {
            setPesan('Pilih kategori terlebih dahulu.');
            return;
        }

        setMenyimpan(true);
        try {
            await onSimpan({
                jenis,
                nominal: Number(nominal),
                kategori_id: Number(kategoriId),
                tanggal,
                catatan,
            });
        } catch (error) {
            setPesan(error.message);
        } finally {
            setMenyimpan(false);
        }
    };

    return (
        <section className={kelasKartu}>
            <h2 className="font-bold">{sedangEdit ? 'Ubah transaksi' : 'Tambah transaksi'}</h2>

            <form onSubmit={kirim} className="mt-4 space-y-4">
                <div className="flex gap-2">
                    <button
                        type="button"
                        aria-pressed={jenis === 'keluar'}
                        onClick={() => gantiJenis('keluar')}
                        className={`${kelasChip(jenis === 'keluar')} flex-1`}
                    >
                        Pengeluaran
                    </button>
                    <button
                        type="button"
                        aria-pressed={jenis === 'masuk'}
                        onClick={() => gantiJenis('masuk')}
                        className={`${kelasChip(jenis === 'masuk')} flex-1`}
                    >
                        Pemasukan
                    </button>
                </div>

                <div>
                    <label htmlFor="jumlah" className={kelasLabel}>Jumlah (Rp)</label>
                    <input
                        id="jumlah"
                        type="number"
                        min="1"
                        value={nominal}
                        onChange={(e) => setNominal(e.target.value)}
                        className={kelasInput}
                    />
                </div>

                <div>
                    <label htmlFor="kategori" className={kelasLabel}>Kategori</label>
                    <select
                        id="kategori"
                        value={kategoriId}
                        onChange={(e) => setKategoriId(e.target.value)}
                        className={kelasInput}
                    >
                        <option value="">Pilih kategori</option>
                        {pilihanKategori.map((k) => (
                            <option key={k.id} value={k.id}>
                                {k.nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="tanggal" className={kelasLabel}>Tanggal</label>
                    <input
                        id="tanggal"
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                        className={kelasInput}
                    />
                </div>

                <div>
                    <label htmlFor="catatan" className={kelasLabel}>Catatan (boleh kosong)</label>
                    <input
                        id="catatan"
                        type="text"
                        maxLength={255}
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        className={kelasInput}
                    />
                </div>

                {pesan && (
                    <p
                        role="alert"
                        className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                    >
                        {pesan}
                    </p>
                )}

                <div className="flex gap-2">
                    <button type="submit" disabled={menyimpan} className={kelasTombolUtama}>
                        {menyimpan ? 'Menyimpan...' : sedangEdit ? 'Simpan perubahan' : 'Tambah transaksi'}
                    </button>
                    {sedangEdit && (
                        <button type="button" onClick={onBatal} className={kelasTombolTepi}>
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}