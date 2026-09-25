import db from "../config/db.js";

export const ApplicationModel = {
  // =====================================================
  // 1. GET ALL APPLICATIONS
  // =====================================================
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT * FROM applications ORDER BY created_at DESC",
    );

    return rows;
  },

  // =====================================================
  // 2. GET APPLICATION BY ID
  // =====================================================
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM applications WHERE id = ?", [
      id,
    ]);

    return rows[0];
  },

  // =====================================================
  // 3. COUNT TOTAL APPLICATIONS
  // =====================================================
  count: async () => {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM applications");

    return rows[0].total;
  },

  // =====================================================
  // 4. COUNT APPLICATIONS BY STATUS
  // =====================================================
  countByStatus: async (status) => {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS total FROM applications WHERE status = ?",
      [status],
    );

    return rows[0].total;
  },

  // =====================================================
  // 5. CREATE NEW APPLICATION
  // =====================================================
  create: async (data) => {
    const {
      application_no,
      name,
      dob,
      email,
      phone,
      course,
      semester,
      qualification,
      score,
      status,
    } = data;

    const [result] = await db.query(
      `INSERT INTO applications
      (
        application_no,
        name,
        dob,
        email,
        phone,
        course,
        semester,
        qualification,
        score,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        application_no,
        name,
        dob || null,
        email || null,
        phone || null,
        course,
        semester || null,
        qualification || null,
        score || null,
        status || "Pending",
      ],
    );

    return result.insertId;
  },

  // =====================================================
  // 6. UPDATE COMPLETE APPLICATION
  // =====================================================
  update: async (id, data) => {
    const {
      name,
      dob,
      email,
      phone,
      course,
      semester,
      qualification,
      score,
      status,
    } = data;

    await db.query(
      `UPDATE applications SET
        name = ?,
        dob = ?,
        email = ?,
        phone = ?,
        course = ?,
        semester = ?,
        qualification = ?,
        score = ?,
        status = ?
      WHERE id = ?`,
      [
        name,
        dob || null,
        email || null,
        phone || null,
        course,
        semester || null,
        qualification || null,
        score || null,
        status,
        id,
      ],
    );
  },

  // =====================================================
  // 7. UPDATE ONLY APPLICATION STATUS
  // =====================================================
  updateStatus: async (id, status) => {
    await db.query("UPDATE applications SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  },

  // =====================================================
  // 8. DELETE APPLICATION
  // =====================================================
  remove: async (id) => {
    await db.query("DELETE FROM applications WHERE id = ?", [id]);
  },

  // =====================================================
  // 9. GENERATE NEXT APPLICATION NUMBER
  // =====================================================
  // Example:
  // APP-2026-1
  // APP-2026-2
  // APP-2026-3

  nextApplicationNo: async () => {
    const year = new Date().getFullYear();

    const [rows] = await db.query(
      "SELECT COUNT(*) AS total FROM applications WHERE application_no LIKE ?",
      [`APP-${year}-%`],
    );

    const next = rows[0].total + 1;

    return `APP-${year}-${next}`;
  },
};
