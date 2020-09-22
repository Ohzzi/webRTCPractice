const mariaDB = require('mariadb');

const pool = mariaDB.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'dhwlgns97@',
    database: 'webrtc'
});

module.exports = pool;