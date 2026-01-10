const pool = require("../database/DB_config");
const dayjs = require("dayjs");

async function createRecord(record, userId) {
  const { transaction, type, description } = record;
  const date = dayjs(Date.now()).locale("pt-br").format();

  const querryString = `
        INSERT INTO records (transaction, type, description, date, "userId") 
        VALUES ($1::money, $2, $3, $4, $5) 
        RETURNING 
            id,
            "userId",
            type,
            date,
            description,
            transaction::numeric as transaction_value
    `;
  const insertRecord = await pool.query(querryString, [
    transaction.replace(",", "."), 
    type,
    description,
    date,
    userId,
  ]);

  const result = insertRecord.rows[0];
  if (
    result.transaction_value !== null &&
    result.transaction_value !== undefined
  ) {
    result.transaction = formatCurrency(result.transaction_value);
    delete result.transaction_value;
  }

  return result;
}

async function findRecordsByUserId(id) {
  const records = await pool.query(
    `
        SELECT 
            id,
            "userId",
            type,
            date,
            description,
            transaction::numeric as transaction_value
        FROM records 
        WHERE "userId" = $1
        ORDER BY date DESC, id DESC
    `,
    [id]
  );

  const formattedRecords = records.rows.map((record) => ({
    id: record.id,
    userId: record.userId,
    type: record.type,
    date: record.date,
    description: record.description,
    transaction: formatCurrency(record.transaction_value),
  }));

  return formattedRecords;
}

function formatCurrency(value) {
  if (value === null || value === undefined) return null;

  const numValue = parseFloat(value).toFixed(2);

  const parts = numValue.split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decimalPart = parts[1] || "00";

  return `R$ ${integerPart},${decimalPart}`;
}

module.exports = {
  createRecord,
  findRecordsByUserId,
};
