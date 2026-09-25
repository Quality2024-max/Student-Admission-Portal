import { ApplicationModel } from "../models/applicatiomModel.js";
import { AdmissionModel } from "../models/admissionModel.js";
import { StudentModule } from "../models/studentModel.js";
import { FeeModel } from "../models/feeModel.js";

const getDashboard = async (req, res) => {
  try {
    console.log("============== Dashboard Start ==============");
    const [
      totalApplications,
      pendingApplications,
      approvedApplications,
      totalAdmissions,
      totalStudents,
      activeStudents,
      totalCollected,
      totalDue,
      recentApplications,
    ] = await Promise.all([
      ApplicationModel.count(),
      ApplicationModel.countByStatus("Pending"),
      ApplicationModel.countByStatus("Approved"),
      AdmissionModel.count(),
      StudentModule.count(),
      StudentModule.countByStatus("Active"),
      FeeModel.totalCollected(),
      FeeModel.totalDue(),
      ApplicationModel.getAll(),
    ]);

    res.render("admin/dashboard", {
      title: "Dashboard",
      user: req.session.user,
      stats: {
        totalApplications,
        pendingApplications,
        approvedApplications,
        totalAdmissions,
        totalStudents,
        activeStudents,
        totalCollected,
        totalDue,
      },
      recentApplications: recentApplications.slice(0, 5),
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
  }
};

// const getReport = (req, res) => {
//   res.render("admin/report", { title: "Report", user: req.session.user });
// };

const getSetting = (req, res) => {
  res.render("admin/setting", { title: "Setting", user: req.session.user });
};

export { getDashboard, getSetting };
