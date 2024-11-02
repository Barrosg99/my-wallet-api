require("dotenv").config();

const { Pool } = require("pg");

const dbConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
    };

class Database {
  constructor() {
    if (!Database.instance) {
      Database.instance = this;
      this.connection = new Pool(dbConfig);
    }

    return Database.instance;
  }

  getConnection() {
    return this.connection;
  }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance.getConnection();
