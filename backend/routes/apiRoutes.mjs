import { Router } from 'express';
import { getSemuaKategori } from '../controllers/kategoriController.mjs';
import {
    getSemuaTransaksi,
    getTransaksiById,
    tambahTransaksi,
    updateTransaksi,
    hapusTransaksi,
} from '../controllers/transaksiController.mjs';
import {
    getRingkasan,
    getPengaturan,
    updatePengaturan,
} from '../controllers/ringkasanController.mjs';

import {
    getSemuaTarget,
    tambahTarget,
    setorKeTarget,
    hapusTarget,
} from '../controllers/targetController.mjs';

const router = Router();

router.get('/kategori', getSemuaKategori);

router.get('/transaksi', getSemuaTransaksi);
router.get('/transaksi/:id', getTransaksiById);
router.post('/transaksi', tambahTransaksi);
router.put('/transaksi/:id', updateTransaksi);
router.delete('/transaksi/:id', hapusTransaksi);

router.get('/ringkasan', getRingkasan);
router.get('/pengaturan', getPengaturan);
router.put('/pengaturan', updatePengaturan);

router.get('/target', getSemuaTarget);
router.post('/target', tambahTarget);
router.post('/target/:id/setoran', setorKeTarget);
router.delete('/target/:id', hapusTarget);


export default router;