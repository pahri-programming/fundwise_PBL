import mysql from 'mysql2/promise';
import 'dotenv/config';

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    maxIdle: 5,
    idleTimeout: 300000,
    dateStrings: true,
    decimalNumbers: true, // kolom desimal jadi angka
});

export default db;