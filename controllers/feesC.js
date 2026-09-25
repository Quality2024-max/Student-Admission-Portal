// =====================================================
// FEE CONTROLLER  ->  tables: fees, fee_payments
// =====================================================

import { FeeModel } from "../models/feeModel.js";
import { StudentModule } from "../models/studentModel.js";

// const getFees = (req, res) => {
//   res.render("admin/fees", { title: "Fees", user: req.session.user });
// };

const FeeController = {
  // -----------------------------------------------------
  // LIST ALL FEE DATA
  // Payments, students, pending dues aur no-fee students
  // ko database se lekar fees page par show karta hai.
  // -----------------------------------------------------
  list: async (req, res) => {
    try {
      // Multiple database queries ko ek saath run karta hai
      const [payments, students, pendingDues, noRecordStudents] =
        await Promise.all([
          FeeModel.getAllPayments(),
          StudentModule.getAll(),
          FeeModel.getPendingDues(),
          FeeModel.getStudentsWithNoFeeRecord(),
        ]);

      // Fees page ko required data ke saath render karta hai

      res.render("admin/fees", {
        title: "Fees",
        user: req.session.user,
        payments,
        students,
        pendingDues,
        noRecordStudents,
      });
    } catch (error) {
      // Agar database/page loading me error aaye
      console.error(error);

      // Error message show karta hai
      req.flash("error", "Could not load fee records.");

      // Empty data ke saath page render karta hai
      res.render("admin/fees", {
        title: "Fees",
        user: req.session.user,
        payments: [],
        students: [],
        pendingDues: [],
        noRecordStudents: [],
      });
    }
  },

  // -----------------------------------------------------
  // CREATE / RECORD PAYMENT
  // Student ki fee create/update karta hai aur
  // payment record ko fee_payments table me save karta hai.
  // -----------------------------------------------------
  create: async (req, res) => {
    try {
      // Form se payment details receive karta hai
      const { student_id, total, amount, mode, transaction_on } = req.body;

      // Student ki existing fee record check karta hai
      let fee = await FeeModel.getFeeByStudentId(student_id);

      // Agar student ki fee record nahi hai
      if (!fee) {
        // First payment ke liye fee record create karta hai
        const feeId = await FeeModel.createFee({
          student_id,
          total: total || amount,
          paid: 0,
        });
        // Newly created fee record ko dobara fetch karta hai
        fee = await FeeModel.getFeeById(feeId);
      }

      // Old paid amount + current payment amount
      const newPaid = Number(fee.paid) + Number(amount);

      // Fee table me updated paid amount save karta hai
      await FeeModel.updateFeePaidTotal(
        fee.id,
        newPaid,
        Number(total || fee.total),
      );

      // Individual payment ka record save karta hai
      await FeeModel.recordPayment({
        fee_id: fee.id,
        amount,
        mode,
        transaction_on,
      });

      // Success message show karta hai
      req.flash("success", "Payment recorded successfully");

      // Fees page par redirect karta hai
      res.redirect("/admin/fees");
    } catch (error) {
      // Error console me show karta hai
      console.error(error);

      // User ko error message show karta hai
      req.flash("error", "Could not record payment.");

      // Fees page par wapas bhejta hai
      res.redirect("/admin/fees");
    }
  },

  // -----------------------------------------------------
  // REMOVE PAYMENT
  // Payment ID ke basis par payment record delete karta hai.
  // -----------------------------------------------------
  remove: async (req, res) => {
    try {
      // URL se payment ID leta hai
      const { id } = req.params;

      // Payment record delete karta hai
      await FeeModel.removePayment(id);

      // Success message show karta hai
      req.flash("success", "Payment record deleted");

      // Fees page par redirect karta hai
      res.redirect("/admin/fees");
    } catch (error) {
      // Error console me show karta hai
      console.error(error);

      // Error message show karta hai
      req.flash("error", "Could not delete payment record.");

      // Fees page par redirect karta hai
      res.redirect("/admin/fees");
    }
  },
};

export { FeeController };
