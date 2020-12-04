const pool = require('../database/DB_config');
const bcrypt = require('bcrypt');

async function createUser(user) {
    const { name, email } = user;
    const password = bcrypt.hashSync(user.password, 10);

    const insertUser = await pool.query('INSERT INTO users ( name, email, password ) VALUES ($1,$2,$3) RETURNING *',[ name, email, password ]);

    return insertUser.rows[0];
}

async function findUserByEmail(email) {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [ email ]);
    return user.rows[0];
}

async function findUserById(id) {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [ id ]);
    return user.rows[0];
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
}