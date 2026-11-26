import {useCallback, useEffect, useState} from 'react';
import {
    ambilKategori, ambilPengaturan, ambilRingkasan, ambilTarget, ambilTransaksi, hapusTarget, hapusTransaksi,
    setorKeTarget,
    simpanPengaturan,
    tambahTarget,
    tambahTransaksi,
    ubahTransaksi,
} from '../lib/api.js';
import {formatRupiah} from '../lib/format.js';
import PengaturanForm from '../components/PengaturanForm.jsx';
import RingkasanKartu from '../components/RingkasanKartu.jsx';
import AnalisisPengeluaran from '../components/AnalisisPengeluaran.jsx';
import TransaksiForm from '../components/TransaksiForm.jsx';
import TransaksiList from '../components/TransaksiList.jsx';

import Navbar from '../components/Navbar.jsx';
import SaldoHero from '../components/SaldoHero.jsx';
import AnggaranHarian from '../components/AnggaranHarian.jsx';
import {useTema} from '../lib/tema.js';

import TargetPanel from '../components/TargetPanel.jsx';

export default function DashboardPage({pengguna, onKeluar}) {
    const [ringkasan, setRingkasan] = useState(null);
    const [pengaturan, setPengaturan] = useState(null);
    const [kategori, setKategori] = useState([]);
    const [transaksi, setTransaksi] = useState([]);
    const [target, setTarget] = useState([]);
    const [memuat, setMemuat] = useState(true);
    const [galat, setGalat] = useState('');
    const [sedangEdit, setSedangEdit] = useState(null);
    const [formKey, setFormKey] = useState(0);
    const [tema, gantiTema] = useTema();
    const [tampilPengaturan, setTampilPengaturan] = useState(false);

    const tanganiGalat = useCallback(
        (error) => {
            if (error.status === 401) {
                onKeluar('Sesi kamu sudah berakhir, silakan login lagi.');
                return;
            }
            setGalat(error.message);
        },
        [onKeluar]
    );

    const muatData = useCallback(async () => {
        try {
            const [dataRingkasan, dataTransaksi, dataPengaturan, dataTarget] = await Promise.all([
                ambilRingkasan(),
                ambilTransaksi(),
                ambilPengaturan(),
                ambilTarget(),
            ]);
            setRingkasan(dataRingkasan);
            setTransaksi(dataTransaksi);
            setPengaturan(dataPengaturan);
            setTarget(dataTarget);
            setGalat('');
        } catch (error) {
            tanganiGalat(error);
        }
    }, [tanganiGalat]);

    useEffect(() => {
        const mulai = async () => {
            try {
                setKategori(await ambilKategori());
            } catch (error) {
                tanganiGalat(error);
            }
            await muatData();
            setMemuat(false);
        };
        mulai();
    }, [muatData, tanganiGalat]);

    const resetForm = () => {
        setSedangEdit(null);
        setFormKey((k) => k + 1);
    };

    const simpanTransaksi = async (data) => {
        try {
            if (sedangEdit) {
                await ubahTransaksi(sedangEdit.id, data);
            } else {
                await tambahTransaksi(data);
            }
        } catch (error) {
            if (error.status === 401) {
                tanganiGalat(error);
                return;
            }
            throw error;
        }
        resetForm();
        await muatData();
    };

    const mulaiEdit = (item) => {
        setSedangEdit(item);
        setFormKey((k) => k + 1);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const hapus = async (item) => {
        const yakin = window.confirm(
            `Hapus transaksi ${item.kategori} sebesar ${formatRupiah(item.nominal)}?`
        );
        if (!yakin) return;

        try {
            await hapusTransaksi(item.id);
            if (sedangEdit?.id === item.id) resetForm();
            await muatData();
        } catch (error) {
            tanganiGalat(error);
        }
    };

    const simpanAturan = async (data) => {
        try {
            await simpanPengaturan(data);
        } catch (error) {
            if (error.status === 401) {
                tanganiGalat(error);
                return;
            }
            throw error;
        }
        setTampilPengaturan(false);
        await muatData();
    };

    const jalankan = async (aksi) => {
        try {
            await aksi();
        } catch (error) {
            if (error.status === 401) {
                tanganiGalat(error);
                return false;
            }
            throw error;
        }
        return true;
    };

    const tambahTargetBaru = async (data) => {
        const berhasil = await jalankan(() => tambahTarget(data));
        if (berhasil) await muatData();
    };

    const setor = async (id, nominal) => {
        const berhasil = await jalankan(() => setorKeTarget(id, nominal));
        if (berhasil) await muatData();
    };

    const hapusTargetItem = async (item) => {
        const yakin = window.confirm(
            `Hapus target "${item.nama}"? Dana yang sudah ditabung (${formatRupiah(item.terkumpul)}) akan kembali ke saldo.`
        );
        if (!yakin) return;

        try {
            await hapusTarget(item.id);
            await muatData();
        } catch (error) {
            tanganiGalat(error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <Navbar pengguna={pengguna} tema={tema} onGantiTema={gantiTema} onKeluar={onKeluar}/>

            <div className="mx-auto max-w-6xl px-4 py-8">
                {galat && (
                    <div
                        role="alert"
                        className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        <span>{galat}</span>
                        <button type="button" onClick={muatData} className="font-medium underline">
                            Coba lagi
                        </button>
                    </div>
                )}

                {memuat && <p className="text-sm text-slate-600 dark:text-slate-400">Memuat data...</p>}

                {!memuat && ringkasan && (
                    <>
                        <p className="mb-4 text-sm text-slate-600 sm:hidden dark:text-slate-400">
                            Halo, <strong className="text-slate-900 dark:text-slate-100">{pengguna.nama}</strong>
                        </p>
                        <div className="grid items-stretch gap-6 lg:grid-cols-[1.4fr_1fr]">
                            <SaldoHero ringkasan={ringkasan}/>
                            <AnggaranHarian ringkasan={ringkasan} onAtur={() => setTampilPengaturan(true)}/>
                        </div>

                        {tampilPengaturan && pengaturan && (
                            <PengaturanForm
                                pengaturan={pengaturan}
                                onSimpan={simpanAturan}
                                onTutup={() => setTampilPengaturan(false)}
                            />
                        )}

                        <div className="mt-6">
                            <AnalisisPengeluaran transaksi={transaksi} />
                        </div>
                        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[320px_1fr]">
                            <TransaksiForm
                                key={`${sedangEdit?.id ?? 'baru'}-${formKey}`}
                                kategori={kategori}
                                sedangEdit={sedangEdit}
                                onSimpan={simpanTransaksi}
                                onBatal={resetForm}
                            />
                            <TransaksiList
                                transaksi={transaksi}
                                sedangEditId={sedangEdit?.id}
                                onEdit={mulaiEdit}
                                onHapus={hapus}
                            />
                        </div>

                        <div className="mt-6">
                            <TargetPanel
                                target={target}
                                totalTabungan={ringkasan.total_tabungan}
                                onTambah={tambahTargetBaru}
                                onSetor={setor}
                                onHapus={hapusTargetItem}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}