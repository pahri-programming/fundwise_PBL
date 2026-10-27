import { AnimatePresence, motion } from 'motion/react';
import Ikon from './Ikon.jsx';
import { kelasTombolIkon } from '../lib/gaya.js';

// Tombol ganti tema. Mode terang menampilkan bulan (klik untuk gelap), dan sebaliknya.
export default function TombolTema({ tema, onGanti }) {
    const gelap = tema === 'dark';

    return (
        <button
            type="button"
            onClick={onGanti}
            aria-label={gelap ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
            className={`${kelasTombolIkon} h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700`}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={gelap ? 'matahari' : 'bulan'}
                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.18 }}
                    className="block"
                >
                    <Ikon nama={gelap ? 'matahari' : 'bulan'} className="h-5 w-5" />
                </motion.span>
            </AnimatePresence>
        </button>
    );
}
