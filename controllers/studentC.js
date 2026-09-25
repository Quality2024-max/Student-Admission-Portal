import { StudentModule } from "../models/studentModel.js";

const getStudents = async (req, res) => {
  try {
    console.log("========== GET STUDENTS ==========");

    const students = await StudentModule.getAll();

    // console.log("Students:", students);

    const availableAdmissions =
      await StudentModule.getAdmissionsWithoutStudent();

    // console.log("Available Admissions:", availableAdmissions);

    return res.render("admin/student", {
      title: "Students",
      user: req.session.user,
      students,
      availableAdmissions,
    });
  } catch (error) {
    console.error("========== GET STUDENTS ERROR ==========");
    console.error(error);
    console.error("========================================");

    req.flash("error", "Unable to load students.");

    return res.redirect("/admin/dashboard");
  }
};

// ============================================================
// Student Controller
// GET, POST, PUT, PATCH, DELETE
// Sabhi student operations ek hi controller se handle honge.
// ============================================================

const StudentController = async (req, res) => {
  try {
    // ========================================================
    // GET - Student List
    // ========================================================
    if (req.method === "GET") {
      const [students, availableAdmissions] = await Promise.all([
        StudentModule.getAll(),
        StudentModule.getAdmissionsWithoutStudent(),
      ]);

      return res.render("admin/student", {
        title: "Students",
        user: req.session.user,
        students,
        availableAdmissions,
      });
    }

    // ========================================================
    // POST - Add New Student
    // ========================================================
    if (req.method === "POST" && !req.params.id) {
      const { admission_id, name, course, semester, status, contact } =
        req.body;

      const roll = await StudentModule.nextRoll();

      await StudentModule.create({
        admission_id,
        roll,
        name,
        course,
        semester,
        status,
        contact,
      });

      req.flash("success", "Student added successfully.");

      return res.redirect("/admin/student");
    }

    // ========================================================
    // PUT / PATCH - Update Student
    // ========================================================
    if ((req.method === "PUT" || req.method === "PATCH") && req.params.id) {
      const { id } = req.params;

      const { name, course, semester, status, contact } = req.body;

      await StudentModule.update(id, {
        name,
        course,
        semester,
        status,
        contact,
      });

      req.flash("success", "Student updated successfully.");

      return res.redirect("/admin/student");
    }

    // ========================================================
    // DELETE - Delete Student
    // ========================================================
    if (req.method === "DELETE" && req.params.id) {
      const { id } = req.params;

      await StudentModule.remove(id);

      req.flash("success", "Student deleted successfully.");

      return res.redirect("/admin/student");
    }

    // ========================================================
    // Unsupported Method
    // ========================================================
    return res.status(405).redirect("/errors/404");
  } catch (error) {
    console.error("StudentController Error:", error);

    req.flash("error", "Could not process student request.");

    return res.redirect("/admin/student");
  }
};

export { getStudents, StudentController };
