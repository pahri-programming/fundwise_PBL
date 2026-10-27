import Ikon from './Ikon.jsx';

// Logo Fundwise: kotak gradien berisi ikon dompet + nama aplikasi
export default function Logo({ putih = false }) {
    return (
        <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/30">
        <Ikon nama="dompet" className="h-5 w-5" />
      </span>
            <span
                className={`text-xl font-extrabold tracking-tight ${
                    putih ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}
            >
        Fund<span className={putih ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'}>wise</span>
      </span>
        </div>
    );
}
