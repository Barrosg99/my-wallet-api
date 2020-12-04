const { Pool } = require('pg');
require('dotenv').config();

const dbConfig = 
    process.env.DATABASE_URL 
        ? { connectionString: process.env.DATABASE_URL } 
        : {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD
        }

const pool = new Pool(dbConfig)

module.exports = pool;