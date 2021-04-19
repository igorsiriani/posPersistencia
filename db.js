const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'test',
    database: 'persistencia',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

pool.query(`CREATE TABLE IF NOT EXISTS product (
        id int NOT NULL,
        name varchar(150) DEFAULT NULL,
        price double DEFAULT NULL,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `)


module.exports = pool;


