import db from "../config/db.js";


// Ek student ke sabhi applications (apna dashboard dekhne ke liye)

async function getApplicationsByUser(userId) {
  const [rows] = await db.query(
    `SELECT applications.*, courses.name AS course_name, courses.duration, courses.fee
     FROM applications
     JOIN courses ON applications.course_id = courses.id
     WHERE applications.user_id = ?
     ORDER BY applications.applied_at DESC`,
    [userId]
  );
  return rows;
}