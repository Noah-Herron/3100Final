const mariadb = require('mariadb');
require("dotenv").config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10,
    connectionTimeout: 5000,
    acquireTimeout: 5000
});

module.exports = pool;