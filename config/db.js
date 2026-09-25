import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

    ssl: {
    ca: process.env.DB_CA_CERT,
    rejectUnauthorized: true,
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  connectTimeout: 30000,
});

// ================= DATABASE CONNECTION CHECK =================

try {
  const connection = await pool.getConnection();

  console.log("✅ Database connected successfully!");

  connection.release();
} catch (error) {
  console.error("❌ Database connection failed!");
  console.error("Error Code:", error.code);
  console.error("Error Message:", error.message);
}

// ================= EXPORT =================

export default pool;
