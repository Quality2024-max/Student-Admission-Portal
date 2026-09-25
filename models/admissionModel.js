import db from "../config/db.js";

export const AdmissionModel = {
  // ============================================================
  // 🔴 HIGH IMPORTANCE
  // getAll()
  // ============================================================
  // Kaam:
  // Database se saare admissions fetch karta hai.
  // Saath mein application table se applicant ka name aur email
  // bhi JOIN karke lekar aata hai.
  //
  // Use:
  // Admin Admission List page par saare admissions dikhane ke liye.

  getAll: async () => {
    const [rows] = await db.query(
      `SELECT admissions.*,
                 applications.name AS applicant_name,
                 applications.email AS applicant_email
        FROM admissions
        JOIN applications
         ON applications.id = admissions.application_id
         ORDER BY admissions.created_at DESC`,
    );
    return rows;
  },

  // ============================================================
  // 🔴 HIGH IMPORTANCE
  // getApprovedApplications()
  // ============================================================
  // Kaam:
  // Sirf Approved applications database se fetch karta hai.
  //
  // Use:
  // Admission create karte waqt dropdown mein sirf
  // approved applications show karne ke liye.

  getApprovedApplications: async () => {
    const [rows] = await db.query(
      `SELECT
        id,
        application_no,
        name,
        email,
        course,
        semester
     FROM applications
     WHERE status = 'Approved'
     ORDER BY created_at DESC`,
    );

    return rows;
  },

  // ============================================================
  // 🔴 HIGH IMPORTANCE
  // getById()
  // ============================================================
  // Kaam:
  // Kisi ek admission ko uske ID ke basis par database se fetch karta hai.
  //
  // Use:
  // - Admission detail page
  // - Edit admission
  // - Single admission view
  // - Update se pehle existing data dikhana

  getById: async (id) => {
    const [rows] = await db.query(
      `SELECT admissions.*,
                applications.name AS applicant_name,
                applications.email AS applicant_email
        FROM admissions
        JOIN applications
        ON applications.id = admissions.application_id
        WHERE admissions.id = ?`,
      [id],
    );
    return rows[0];
  },

  // ============================================================
  // 🟠 MEDIUM IMPORTANCE
  // count()
  // ============================================================
  // Kaam:
  // Total admissions ki counting karta hai.
  //
  // Use:
  // Dashboard par:
  // "Total Admissions: 150"
  // jaise statistics show karne ke liye.

  count: async () => {
    const [rows] = await db.query("SELECT COUNT(*) AS totle FROM admissions");

    return rows[0].total;
  },

  // ============================================================
  // 🔴 HIGH IMPORTANCE
  // create()
  // ============================================================
  // Kaam:
  // Naya admission database mein INSERT karta hai.
  //
  // Use:
  // Jab admin kisi approved application ko admission mein convert
  // karta hai ya manually new admission create karta hai.

  create: async (data) => {
    // data object se required values nikal rahe hain
    const {
      admission_no,
      application_id,
      admission_date,
      course,
      semester,
      status,
    } = data;

    // Database mein new admission insert
    const [result] = await db.query(
      `INSERT INTO admissions
  (admission_no, application_id, admission_date, course, semester, status)
  VALUES (?, ?, ?, ?, ?, ?)`,
      [
        admission_no,
        application_id,
        admission_date || null,
        course,
        semester || null,

        // Agar status nahi diya gaya,
        // to default status "Confirmed" hoga.
        status || "Confirmed",
      ],
    );

    // Newly inserted record ki ID return karega
    return result.insertId;
  },

  // ============================================================
  // 🔴 HIGH IMPORTANCE
  // update()
  // ============================================================
  // Kaam:
  // Existing admission ko update karta hai.
  //
  // Use:
  // Admin jab admission ki:
  // - course
  // - semester
  // - date
  // - status
  // etc. change karta hai.

  update: async (id, date) => {
    // Data object se values nikal rahe hain

    const { application_id, admission_date, course, semester, status } = date;

    // Existing admission update
    await db.query(
      `UPDATE admissions SET
        application_id = ?,
        admission_date = ?,
        course = ?,
        semester = ?,
        status = ?
       WHERE id = ?`,
      [
        application_id,
        admission_date || null,
        course,
        semester || null,
        status,
        id,
      ],
    );
  },

  // ============================================================
  // 🔴 HIGH IMPORTANCE
  // remove()
  // ============================================================
  // Kaam:
  // Admission ko database se DELETE karta hai.
  //
  // Use:
  // Admin jab kisi admission ko permanently delete karta hai.
  //
  // ⚠️ Important:
  // DELETE permanent operation hai, isliye controller mein
  // validation/confirmation rakhna achha practice hai.

  remove: async (id) => {
    await db.query("DELETE FROM admissions WHERE id = ?", [id]);
  },
  // ============================================================
  // 🟠 MEDIUM IMPORTANCE
  // nextAdmissionNo()
  // ============================================================
  // Kaam:
  // Automatically next Admission Number generate karta hai.
  //
  // Example:
  // ADM-2026-001
  // ADM-2026-002
  // ADM-2026-003
  //
  // Use:
  // New admission create karte time unique admission number
  // generate karne ke liye.

  nextAdmissionNo: async () => {
    try {
      // Current year nikalna
      const year = new Date().getFullYear();

      // Current year ke ADM records count karna
      const [rows] = await db.query(
        "SELECT COUNT(*) AS total FROM admissions WHERE admission_no LIKE ?",
        [`ADM-${year}-%`],
      );

      console.log("Admission Count Result:", rows[0]);

      // Ensure value number hai
      const total = Number(rows[0].total) || 0;

      // Next admission number
      const next = total + 1;

      console.log("Next Admission Number:", next);

      // Final admission number
      return `ADM-${year}-${String(next).padStart(3, "0")}`;
    } catch (error) {
      console.error("Error generating next admission number:", error);
      throw error;
    }
  },
};
