import { useState } from 'react';
import { daftar, masuk } from '../lib/api.js';
import { useTema } from '../lib/tema.js';
import Ikon from '../components/Ikon.jsx';
import Logo from '../components/Logo.jsx';
import TombolTema from '../components/TombolTema.jsx';

const keunggulan = [
    { ikon: 'kalender', teks: 'Anggaran harian otomatis' },
    { ikon: 'target', teks: 'Target tabungan jelas' },
    { ikon: 'perisai', teks: 'Data aman & privat' },
];

const kelasLabel = 'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300';

const kelasInput =
    'w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-emerald-400/20';

const kelasTombol =
    'w-full rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 px-4 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30';

export default function AuthPage({ onBerhasil, pesan = '' }) {
    const [tema, gantiTema] = useTema();
    const [mode, setMode] = useState('masuk');
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [lihatPassword, setLihatPassword] = useState(false);
    const [galat, setGalat] = useState('');
    const [memproses, setMemproses] = useState(false);

    const modeDaftar = mode === 'daftar';

    const pilihMode = (tujuan) => {
        if (tujuan === mode) return;
        setMode(tujuan);
        setPassword('');
        setLihatPassword(false);
        setGalat('');
    };

    const kirim = async (e) => {
        e.preventDefault();
        setGalat('');

        if (modeDaftar && password.length < 8) {
            setGalat('Password minimal 8 karakter.');
            return;
        }

        setMemproses(true);
        try {
            const hasil = modeDaftar
                ? await daftar({ nama, email, password })
                : await masuk({ email, password });
            onBerhasil(hasil);
        } catch (error) {
            setGalat(error.message);
            setMemproses(false);
        }
    };

    const kelasTab = (aktif) =>
        `flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
            aktif
                ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-300'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
        }`;

    return (
        <div className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50 px-4 py-10 font-tampil text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/60 dark:text-slate-100">
            {/* Dekorasi latar */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -left-16 -z-10 h-72 w-72 animate-melayang rounded-full bg-emerald-300/40 blur-3xl motion-reduce:animate-none dark:bg-emerald-500/15"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -bottom-24 -z-10 h-80 w-80 animate-melayang rounded-full bg-lime-200/50 blur-3xl [animation-delay:-5s] motion-reduce:animate-none dark:bg-teal-500/15"
            />

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <TombolTema tema={tema} onGanti={gantiTema} />
            </div>

            <div className="w-full max-w-md animate-muncul">
                <div className="mb-6 flex justify-center">
                    <Logo />
                </div>

                <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-xl shadow-emerald-900/5 backdrop-blur-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-black/20">
                    {/* Toggle masuk / daftar */}
                    <div role="tablist" className="flex gap-1 rounded-2xl bg-slate-100/80 p-1 dark:bg-slate-800/70">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={!modeDaftar}
                            onClick={() => pilihMode('masuk')}
                            className={kelasTab(!modeDaftar)}
                        >
                            Masuk
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={modeDaftar}
                            onClick={() => pilihMode('daftar')}
                            className={kelasTab(modeDaftar)}
                        >
                            Daftar
                        </button>
                    </div>

                    <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
                        {modeDaftar ? 'Mulai dari sini' : 'Halo, selamat datang'}
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                        {modeDaftar
                            ? 'Buat akun dan atur keuanganmu dalam hitungan menit.'
                            : 'Masuk untuk melihat ringkasan keuanganmu.'}
                    </p>

                    {pesan && !galat && (
                        <p
                            role="status"
                            className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300"
                        >
                            {pesan}
                        </p>
                    )}

                    <form onSubmit={kirim} className="mt-6 space-y-4">
                        {modeDaftar && (
                            <div className="animate-muncul">
                                <label htmlFor="nama" className={kelasLabel}>
                                    Nama
                                </label>
                                <input
                                    id="nama"
                                    type="text"
                                    autoComplete="name"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    placeholder="Nama panggilanmu"
                                    className={kelasInput}
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className={kelasLabel}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                inputMode="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@email.com"
                                className={kelasInput}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className={kelasLabel}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={lihatPassword ? 'text' : 'password'}
                                    autoComplete={modeDaftar ? 'new-password' : 'current-password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={modeDaftar ? 'Minimal 8 karakter' : 'Password kamu'}
                                    className={`${kelasInput} pr-20`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setLihatPassword((v) => !v)}
                                    aria-pressed={lihatPassword}
                                    className="absolute inset-y-0 right-2 my-auto h-9 rounded-xl px-3 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                                >
                                    {lihatPassword ? 'Sembunyi' : 'Lihat'}
                                </button>
                            </div>
                        </div>

                        {galat && (
                            <p
                                role="alert"
                                className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                            >
                                {galat}
                            </p>
                        )}

                        <button type="submit" disabled={memproses} className={kelasTombol}>
                            {memproses ? 'Memproses...' : modeDaftar ? 'Buat akun' : 'Masuk'}
                        </button>
                    </form>
                </div>

                {/* Keunggulan singkat */}
                <ul className="mt-6 flex flex-wrap justify-center gap-2">
                    {keunggulan.map((item) => (
                        <li
                            key={item.ikon}
                            className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white/60 px-3 py-1.5 text-xs text-slate-600 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
                        >
                            <Ikon nama={item.ikon} className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            {item.teks}
                        </li>
                    ))}
                </ul>

                <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">© Fundwise</p>
            </div>
        </div>
    );
}