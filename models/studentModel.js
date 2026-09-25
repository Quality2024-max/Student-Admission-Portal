import db from "../config/db.js";

export const StudentModule = {
  async getAll() {
    const [rows] = await db.query(
      "SELECT * FROM students ORDER BY created_at DESC",
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query("SELECT * FROM students WHERE id = ?", [id]);
    return rows[0];
  },
  async count() {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM students");
    return rows[0].total;
  },

  async countByStatus(status) {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS total FROM students WHERE status = ?",
      [status],
    );
    return rows[0].total;
  },

  async getAdmissionsWithoutStudent() {
    const [rows] = await db.query(`
    SELECT
      a.id,
      a.admission_no,
      a.admission_date,
      a.course,
      a.semester
    FROM admissions a
    LEFT JOIN students s
      ON s.admission_id = a.id
    WHERE s.id IS NULL
    ORDER BY a.id DESC
  `);

    return rows;
  },

  async create(data) {
    const { admission_id, roll, name, course, semester, status, contact } =
      data;

    const [result] = await db.query(
      `INSERT INTO students
    (admission_id, roll, name, course, semester, status, contact)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [admission_id, roll, name, course, semester, status || "Active", contact],
    );
    return result.insertId;
  },

  async update(id, data) {
    const { name, course, semester, status, contact } = data;

    await db.query(
      `UPDATE students SET
      name = ?, course = ?, semester = ?, status = ?, contact = ?
      WHERE id = ?`,
      [name, course, semester, status, contact, id],
    );
  },

  async remove(id) {
    await db.query("DELETE FROM students WHERE id = ?", [id]);
  },

  async nextRoll() {
    const year = new Date().getFullYear();

    const [rows] = await db.query(
      `SELECT roll
     FROM students
     WHERE roll LIKE ?
     ORDER BY id DESC`,
      [`STU-${year}-%`],
    );

    let nextNumber = 1;

    if (rows.length > 0) {
      const numbers = rows
        .map((row) => {
          const match = row.roll.match(/^STU-\d{4}-(\d+)$/);

          return match ? Number(match[1]) : 0;
        })
        .filter((number) => number > 0);

      if (numbers.length > 0) {
        nextNumber = Math.max(...numbers) + 1;
      }
    }

    const roll = `STU-${year}-${String(nextNumber).padStart(3, "0")}`;

    console.log("Generated Roll:", roll);

    return roll;
  },
};
