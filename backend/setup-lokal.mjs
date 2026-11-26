// Membuat database + tabel Fundwise di MySQL LOKAL, memakai kredensial yang sama dengan backend (.env).
// Jalankan dari folder backend:  node setup-lokal.mjs
// Aman dijalankan berulang: tidak ada DROP, dan kategori contoh hanya diisi kalau tabelnya kosong.
import 'dotenv/config';
import mysql from 'mysql2/promise';

const host = process.env.DB_HOST;
const namaDb = process.env.DB_NAME;

// Pengaman: skrip ini hanya boleh menyentuh MySQL di laptop sendiri, tidak pernah server produksi
if (!['127.0.0.1', 'localhost', '::1'].includes(host)) {
    console.error(`DB_HOST di .env adalah "${host}", bukan komputer lokal. Skrip dihentikan.`);
    process.exit(1);
}
if (!namaDb || !/^[A-Za-z0-9_]+$/.test(namaDb)) {
    console.error('DB_NAME di .env kosong atau berisi karakter yang tidak diizinkan (hanya huruf, angka, garis bawah).');
    process.exit(1);
}

const sql = `
CREATE DATABASE IF NOT EXISTS \`${namaDb}\` CHARACTER SET utf8mb4;
USE \`${namaDb}\`;

CREATE TABLE IF NOT EXISTS users (
  id int NOT NULL AUTO_INCREMENT,
  nama varchar(100) NOT NULL,
  email varchar(255) NOT NULL,
  password_hash varchar(255) NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS kategori (
  id int NOT NULL AUTO_INCREMENT,
  nama varchar(50) NOT NULL,
  jenis enum('masuk','keluar') NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_kategori (nama, jenis)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS pengaturan (
  user_id int NOT NULL,
  kewajiban decimal(15,2) NOT NULL DEFAULT '0.00',
  sisihkan_tabungan decimal(15,2) NOT NULL DEFAULT '0.00',
  pemasukan_berikutnya date DEFAULT NULL,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_pengaturan_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS target_tabungan (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  nama varchar(100) NOT NULL,
  nominal_target decimal(15,2) NOT NULL,
  tenggat date DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY fk_target_user (user_id),
  CONSTRAINT fk_target_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT chk_target_nominal CHECK (nominal_target > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS setoran_tabungan (
  id int NOT NULL AUTO_INCREMENT,
  target_id int NOT NULL,
  nominal decimal(15,2) NOT NULL,
  tanggal date NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY fk_setoran_target (target_id),
  CONSTRAINT fk_setoran_target FOREIGN KEY (target_id) REFERENCES target_tabungan (id) ON DELETE CASCADE,
  CONSTRAINT chk_setoran_nominal CHECK (nominal > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS transaksi (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  kategori_id int NOT NULL,
  jenis enum('masuk','keluar') NOT NULL,
  nominal decimal(15,2) NOT NULL,
  tanggal date NOT NULL,
  catatan varchar(255) DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY fk_transaksi_kategori (kategori_id),
  KEY idx_transaksi_user_tanggal (user_id, tanggal),
  CONSTRAINT fk_transaksi_kategori FOREIGN KEY (kategori_id) REFERENCES kategori (id),
  CONSTRAINT fk_transaksi_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT chk_transaksi_nominal CHECK (nominal > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO kategori (nama, jenis)
SELECT * FROM (
  SELECT 'Gaji' AS nama, 'masuk' AS jenis UNION ALL
  SELECT 'Uang Saku', 'masuk' UNION ALL
  SELECT 'Bonus', 'masuk' UNION ALL
  SELECT 'Lainnya', 'masuk' UNION ALL
  SELECT 'Makan', 'keluar' UNION ALL
  SELECT 'Transportasi', 'keluar' UNION ALL
  SELECT 'Belanja', 'keluar' UNION ALL
  SELECT 'Tagihan', 'keluar' UNION ALL
  SELECT 'Hiburan', 'keluar' UNION ALL
  SELECT 'Lainnya', 'keluar'
) AS awal
WHERE NOT EXISTS (SELECT 1 FROM kategori);
`;

let koneksi;
try {
    koneksi = await mysql.createConnection({
        host,
        port: Number(process.env.DB_PORT ?? 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true,
    });
    console.log(`Tersambung ke MySQL lokal sebagai "${process.env.DB_USER}".`);

    await koneksi.query(sql);

    const [tabel] = await koneksi.query(`SHOW TABLES FROM \`${namaDb}\``);
    const [[jumlah]] = await koneksi.query(`SELECT COUNT(*) AS n FROM \`${namaDb}\`.kategori`);
    console.log(`\nSelesai. Tabel di "${namaDb}":`);
    for (const baris of tabel) console.log('  -', Object.values(baris)[0]);
    console.log(`Jumlah kategori: ${jumlah.n}`);
} catch (error) {
    console.error(`\nGagal: [${error.code}] ${error.message}`);
    process.exitCode = 1;
} finally {
    if (koneksi) await koneksi.end();
}