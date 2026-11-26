import { formatRupiah, formatTanggal } from '../lib/format.js';
import { kelasTombolTepi } from '../lib/gaya.js';

export default function CetakRiwayat({ transaksi }) {
    const jumlah = (jenis) =>
        transaksi.filter((t) => t.jenis === jenis).reduce((j, t) => j + Number(t.nominal), 0);
    const totalMasuk = jumlah('masuk');
    const totalKeluar = jumlah('keluar');
    const sel = { border: '1px solid #999', padding: '4px 8px' };

    return (
        <>
            <button
                type="button"
                onClick={() => window.print()}
                disabled={transaksi.length === 0}
                className={`${kelasTombolTepi} mt-3 disabled:opacity-50`}
            >
                Cetak / simpan PDF
            </button>

            <div id="area-cetak">
                <h1 style={{ fontSize: '18pt', fontWeight: 700 }}>Fundwise: Riwayat Transaksi</h1>
                <p style={{ fontSize: '10pt', marginBottom: '8px' }}>
                    Dicetak: {formatTanggal(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }))}
                </p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
                    <thead>
                    <tr>
                        <th style={sel}>Tanggal</th>
                        <th style={sel}>Kategori</th>
                        <th style={sel}>Jenis</th>
                        <th style={sel}>Catatan</th>
                        <th style={{ ...sel, textAlign: 'right' }}>Nominal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transaksi.map((t) => (
                        <tr key={t.id}>
                            <td style={sel}>{formatTanggal(t.tanggal)}</td>
                            <td style={sel}>{t.kategori}</td>
                            <td style={sel}>{t.jenis === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}</td>
                            <td style={sel}>{t.catatan ?? ''}</td>
                            <td style={{ ...sel, textAlign: 'right' }}>
                                {t.jenis === 'masuk' ? '+' : '-'}
                                {formatRupiah(t.nominal)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <p style={{ marginTop: '10px', fontSize: '10pt' }}>
                    Total pemasukan: <strong>{formatRupiah(totalMasuk)}</strong> · Total pengeluaran:{' '}
                    <strong>{formatRupiah(totalKeluar)}</strong>
                </p>
            </div>
        </>
    );
}