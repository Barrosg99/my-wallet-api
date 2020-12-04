const pool = require("../database/DB_config");
const dayjs = require('dayjs');

async function createRecord(record, userId) {
    const { transaction, type, description } = record;
    const date = dayjs(Date.now()).locale('pt-br').format();
    
    const querryString = 'INSERT INTO records (transaction, type, description, date, "userId") VALUES ($1,$2,$3,$4,$5) RETURNING *'
    const insertRecord = await pool.query(querryString,[ transaction.replace('.',','), type, description, date, userId ]);

    return insertRecord.rows[0];
}

async function findRecordsByUserId(id) {
    const records = await pool.query('SELECT * FROM records WHERE "userId" = $1', [ id ]);
    return records.rows;
}

module.exports = {
    createRecord,
    findRecordsByUserId
}