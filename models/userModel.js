
import db from "../config/db.js";

// Find user by email
async function findByEmail(email) {
    const [rows] = await db.query(
        "SELECT * FROM user WHERE email = ?",
        [email]
    );

    return rows[0];
}

// Find user by ID
async function findById(id) {
    const [rows] = await db.query(
        "SELECT id, name, email, role FROM user WHERE id = ?",
        [id]
    );

    return rows[0];
}

// Create new user
async function createUser(name, email, password, role) {
    const [result] = await db.query(
        `INSERT INTO user (name, email, password, role)
         VALUES (?, ?, ?, ?)`,
        [name, email, password, role]
    );

    return result;
}

// Create model object
const userModel = {
    findByEmail,
    findById,
    createUser
};

// Default export
export default userModel;

