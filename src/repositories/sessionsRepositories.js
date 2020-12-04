const pool = require('../database/DB_config');
const { v4: uuidv4 } = require("uuid");

async function createByUserId(userId) {
    const newSession = await pool.query('INSERT INTO sessions ("userId", token) VALUES ($1,$2) RETURNING *',[ userId, uuidv4()]);
    return newSession.rows[0];    
}

async function findByToken(token) {
    const session = await pool.query('SELECT * FROM sessions WHERE token = $1', [ token ]);
    return session.rows[0];
}

async function destroyByUserId(userId) {
    await pool.query('DELETE FROM sessions WHERE "userId" = $1',[ userId ]);
}

module.exports = {
    createByUserId,
    findByToken,
    destroyByUserId
}
