import { ambilSesi } from './auth.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

async function request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const sesi = ambilSesi();
    if (sesi?.token) {
        headers.Authorization = `Bearer ${sesi.token}`;
    }

    let response;
    try {
        response = await fetch(`${API_URL}${path}`, { ...options, headers });
    } catch {
        throw new Error('Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.');
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        const error = new Error(data?.error ?? 'Terjadi kesalahan pada server');
        error.status = response.status;
        throw error;
    }
    return data;
}
//login
export const daftar = (data) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) });

export const masuk = (data) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) });

//crud
export const ambilRingkasan = () => request('/ringkasan');
export const ambilKategori = () => request('/kategori');
export const ambilTransaksi = () => request('/transaksi');
export const ambilPengaturan = () => request('/pengaturan');
export const ambilAnalisis = (bulan) => request(`/analisis?bulan=${bulan}`);

export const tambahTransaksi = (data) =>
    request('/transaksi', { method: 'POST', body: JSON.stringify(data) });

export const ubahTransaksi = (id, data) =>
    request(`/transaksi/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const hapusTransaksi = (id) =>
    request(`/transaksi/${id}`, { method: 'DELETE' });

export const simpanPengaturan = (data) =>
    request('/pengaturan', { method: 'PUT', body: JSON.stringify(data) });

export const ambilTarget = () => request('/target');

export const tambahTarget = (data) =>
    request('/target', { method: 'POST', body: JSON.stringify(data) });

export const setorKeTarget = (id, nominal) =>
    request(`/target/${id}/setoran`, { method: 'POST', body: JSON.stringify({ nominal }) });

export const hapusTarget = (id) =>
    request(`/target/${id}`, { method: 'DELETE' });

