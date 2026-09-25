// ============================================================
// Admission Controller
// ============================================================

import { AdmissionModel } from "../models/admissionModel.js";

// ============================================================
// GET ADMISSION PAGE
// ============================================================
// Kaam:
// Admission page ke liye admissions aur approved applications
// database se fetch karta hai.
//
// Promise.all() dono queries ko parallel mein execute karta hai.
// ============================================================

const getAdmission = async (req, res) => {
  try {
    const admissions = await AdmissionModel.getAll();
    const applications = await AdmissionModel.getApprovedApplications();

    res.render("admin/admission", {
      title: "Admissions",
      admissions: admissions,
      applications: applications,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Get Admission Error:", error);

    res.status(500).send("Server Error");
  }
};

// ============================================================
// POST ADMISSION CONTROLLER
// ============================================================

const postAdmission = async (req, res) => {
  try {
    const { application_id, admission_date, course, semester, status } =
      req.body;
    console.log(req.body);

    const admission_no = await AdmissionModel.nextAdmissionNo();

    await AdmissionModel.create({
      admission_no,
      application_id,
      admission_date,
      course,
      semester,
      status,
    });

    req.flash("success", "Admission created successfully.");

    return res.redirect("/admin/admission");
  } catch (err) {
    console.error("Create Admission Error:", err);

    req.flash(
      "error",
      "Could not save admission. This application may already be admitted.",
    );

    return res.redirect("/admin/admission");
  }
};

// ============================================================
// UPDATE ADMISSION
// ============================================================

const updateAdmission = async (req, res) => {
  try {
    const { id } = req.params;

    const { application_id, admission_date, course, semester, status } =
      req.body;

    await AdmissionModel.update(id, {
      application_id,
      admission_date,
      course,
      semester,
      status,
    });

    req.flash("success", "Admission updated successfully.");

    return res.redirect("/admin/admission");
  } catch (err) {
    console.error("Update Admission Error:", err);

    req.flash("error", "Could not update admission.");

    return res.redirect("/admin/admission");
  }
};

// ============================================================
// DELETE ADMISSION
// ============================================================

const deleteAdmission = async (req, res) => {
  try {
    const { id } = req.params;

    await AdmissionModel.remove(id);

    req.flash("success", "Admission deleted.");

    return res.redirect("/admin/admission");
  } catch (err) {
    console.error("Delete Admission Error:", err);

    req.flash(
      "error",
      "Could not delete admission. It may already be linked to a student.",
    );

    return res.redirect("/admin/admission");
  }
};

// ============================================================
// EXPORT
// ============================================================

export { getAdmission, postAdmission, updateAdmission, deleteAdmission };
