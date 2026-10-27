import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'motion/react';

export function useAngkaBergerak(nilai, durasi = 0.9) {
    const [tampil, setTampil] = useState(0);
    const terakhir = useRef(0);
    const kurangiGerak = useReducedMotion();

    useEffect(() => {
        const kontrol = animate(terakhir.current, nilai, {
            duration: kurangiGerak ? 0 : durasi,
            ease: 'easeOut',
            onUpdate: (v) => {
                terakhir.current = v;
                setTampil(Math.round(v));
            },
        });
        // Penting: hentikan animasi kalau komponen hilang atau nilainya berubah lagi
        return () => kontrol.stop();
    }, [nilai, durasi, kurangiGerak]);

    return tampil;
}
