import db from "../config/db.js";

// =====================================================
// FEE MODEL
// tables: fees, fee_payments
// =====================================================

export const FeeModel = {
  // Get all payments with fee and student details
  async getAllPayments() {
    const [rows] = await db.query(
      `SELECT fee_payments.*,
              fees.student_id, fees.total, fees.paid, fees.due, fees.status AS fee_status,
              students.name AS student_name, students.roll AS student_roll
       FROM fee_payments
       JOIN fees ON fees.id = fee_payments.fee_id
       JOIN students ON students.id = fees.student_id
       ORDER BY fee_payments.paid_on DESC`,
    );

    // Return payment records
    return rows;
  },

  // Get fee details using fee ID
  async getFeeById(id) {
    const [rows] = await db.query("SELECT * FROM fees WHERE id = ?", [id]);

    // Return the matching fee
    return rows[0];
  },

  // Get fee details using student ID
  async getFeeByStudentId(studentId) {
    const [rows] = await db.query("SELECT * FROM fees WHERE student_id = ?", [
      studentId,
    ]);

    // Return the student's fee record
    return rows[0];
  },

  // Create a new fee record for a student
  async createFee({ student_id, total, paid, status }) {
    const [result] = await db.query(
      "INSERT INTO fees (student_id, total, paid, status) VALUES (?, ?, ?, ?)",
      [student_id, total || 0, paid || 0, status || "Unpaid"],
    );

    // Return the new fee ID
    return result.insertId;
  },

  // Update paid amount and fee status
  async updateFeePaidTotal(feeId, paidAmount, total) {
    // Set status according to the paid amount
    let status = "Unpaid";

    if (paidAmount >= total && total > 0) status = "Paid";
    else if (paidAmount > 0) status = "Partial";

    // Save the updated amount and status
    await db.query("UPDATE fees SET paid = ?, status = ? WHERE id = ?", [
      paidAmount,
      status,
      feeId,
    ]);
  },

  // Save a student's payment transaction
  async recordPayment({ fee_id, amount, mode, transaction_no }) {
    const [result] = await db.query(
      `INSERT INTO fee_payments (fee_id, amount, mode, transaction_no)
       VALUES (?, ?, ?, ?)`,
      [fee_id, amount, mode, transaction_no || null],
    );

    // Return the new payment ID
    return result.insertId;
  },

  // Delete a payment record using payment ID
  async removePayment(id) {
    await db.query("DELETE FROM fee_payments WHERE id = ?", [id]);
  },

  // Get students who still have pending dues
  async getPendingDues() {
    const [rows] = await db.query(
      `SELECT fees.id AS fee_id, fees.student_id, fees.total, fees.paid, fees.due,
              fees.status AS fee_status,
              students.name AS student_name, students.roll AS student_roll,
              students.course AS student_course
       FROM fees
       JOIN students ON students.id = fees.student_id
       WHERE fees.status != 'Paid'
       ORDER BY fees.due DESC`,
    );

    // Return students with unpaid fees
    return rows;
  },

  // Get students who do not have a fee record
  async getStudentsWithNoFeeRecord() {
    const [rows] = await db.query(
      `SELECT students.id AS student_id, students.name AS student_name,
              students.roll AS student_roll, students.course AS student_course
       FROM students
       LEFT JOIN fees ON fees.student_id = students.id
       WHERE fees.id IS NULL
       ORDER BY students.name ASC`,
    );

    // Return students without fee records
    return rows;
  },

  // Calculate the total amount collected
  async totalCollected() {
    const [rows] = await db.query(
      "SELECT COALESCE(SUM(paid),0) AS total FROM fees",
    );

    // Return the collected amount
    return rows[0].total;
  },

  // Calculate the total pending amount
  async totalDue() {
    const [rows] = await db.query(
      "SELECT COALESCE(SUM(due),0) AS total FROM fees",
    );

    // Return the pending amount
    return rows[0].total;
  },
};
