import db from "../config/db.js";

async function newApplication(
  applicant_name,
  email,
  contact_number,
  course,
  session,
  status,
  remark,
) {
  const [result] = await db.query(
    "INSERT INTO new_application (applicant_name, email, contact_number, course, session, status, remark) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [applicant_name, email, contact_number, course, session, status, remark],
  );
  return result.insertId;
}

async function findByEmailandContact(email, contact_number) {
  const [rows] = await db.query(
    "SELECT * FROM new_application WHERE email = ? AND contact_number = ?",
    [email, contact_number],
  );
  return rows;
}
async function newApplications() {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total FROM new_application",
  );
  return rows[0].total;
}

const totalStudents = async () => {
  const [rows] = await db.query(`
        SELECT COUNT(*) AS total
        FROM new_application
    `);

  return rows[0].total;
};

async function getRecentApplications() {
  const [rows] = await db.query(`
    SELECT
      id,
      applicant_name,
      email,
      contact_number,
      course,
      session,
      status,
      create_at,
      remark
    FROM new_application
    ORDER BY id DESC
    LIMIT 5
  `);
  return rows;
}

// Default export
export default {
  newApplication,
  findByEmailandContact,
  newApplications,
  totalStudents,
  getRecentApplications,
};
