import { useCallback, useState } from 'react';
import { ambilSesi, hapusSesi, simpanSesi } from './lib/auth.js';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

export default function App() {
  const [sesi, setSesi] = useState(() => ambilSesi());
  const [pesan, setPesan] = useState('');

  const setelahBerhasil = (data) => {
    simpanSesi(data);
    setSesi(data);
    setPesan('');
  };

  const keluar = useCallback((alasan = '') => {
    hapusSesi();
    setSesi(null);
    setPesan(alasan);
  }, []);

  if (!sesi) {
    return <AuthPage onBerhasil={setelahBerhasil} pesan={pesan} />;
  }
  return <DashboardPage pengguna={sesi.user} onKeluar={keluar} />;
}