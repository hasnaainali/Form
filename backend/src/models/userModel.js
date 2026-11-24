const pool = require('../config/db');

const findByEmail = async (email) => {
    const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows;
};

const createUser = async (name, email, hashedPassword, role) => {
    const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
    );
    return result;
};

const getAllUsers = async () => {
    const [rows] = await pool.execute(
        'SELECT id, name, email, role FROM users'
    );
    return rows;
};

module.exports = { findByEmail, createUser, getAllUsers };