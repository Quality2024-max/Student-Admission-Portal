import { ApplicationModel } from "../models/applicatiomModel.js";
import { AdmissionModel } from "../models/admissionModel.js";
import { StudentModule } from "../models/studentModel.js";
import { FeeModel } from "../models/feeModel.js";

const ReportController = {
  async index(req, res) {
    try {
      const [applications, admissions, students, totalCollected, totalDue] =
        await Promise.all([
          ApplicationModel.getAll(),
          AdmissionModel.getAll(),
          StudentModule.getAll(),
          FeeModel.totalCollected(),
          FeeModel.totalDue(),
        ]);

      res.render("admin/report", {
        title: "Reports",
        user: req.session.user,
        counts: {
          applications: applications.length,
          admissions: admissions.length,
          students: students.length,
          totalCollected,
          totalDue,
        },
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Could not load reports.");
      res.render("admin/report", {
        title: "Reports",
        user: req.session.user,
        counts: {},
      });
    }
  },
};

export default ReportController;
