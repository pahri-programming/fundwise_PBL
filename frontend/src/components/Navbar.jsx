import Ikon from './Ikon.jsx';
import Logo from './Logo.jsx';
import TombolTema from './TombolTema.jsx';
import { kelasTombolTepi } from '../lib/gaya.js';

// Bilah atas yang menempel di atas layar saat halaman digulir
export default function Navbar({ pengguna, tema, onGantiTema, onKeluar }) {
    const inisial = pengguna.nama.trim().charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/75">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <Logo />

                <div className="flex items-center gap-2 sm:gap-3">
                    <TombolTema tema={tema} onGanti={onGantiTema} />

                    <div className="flex items-center gap-2.5">
            <span
                title={pengguna.nama}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
            >
              {inisial}
            </span>
                        <span className="hidden max-w-40 truncate text-sm font-semibold sm:inline">{pengguna.nama}</span>
                    </div>

                    <button type="button" onClick={() => onKeluar()} className={kelasTombolTepi}>
                        <Ikon nama="keluar" className="h-4 w-4" />
                        <span className="hidden sm:inline">Keluar</span>
                        <span className="sr-only sm:hidden">Keluar</span>
                    </button>
                </div>
            </div>
        </header>
    );
}