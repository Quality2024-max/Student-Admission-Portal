import express from "express";
const router = express.Router();
import { getDashboard } from "../controllers/adminC.js";
import {
  getApplication,
  postNewApplication,
  update,
  remove,
  updateStatus,
} from "../controllers/applicationC.js";
import {
  getAdmission,
  postAdmission,
  updateAdmission,
  deleteAdmission,
} from "../controllers/admissionC.js";

import { getStudents, StudentController } from "../controllers/studentC.js";
import { FeeController } from "../controllers/feesC.js";
import ReportController from "../controllers/reportC.js";
import { SettingController } from "../controllers/settingC.js";
import { isAuthenticated, isAdmin, isGuest } from "../middlewares/authM.js";

//Dashboard
router.get("/dashboard", isAuthenticated, getDashboard);

// Application
router.get("/application", isAuthenticated, getApplication);
router.post("/application", isAuthenticated, postNewApplication);
router.put("/application/:id", isAuthenticated, update);
router.delete("/application/:id", isAuthenticated, remove);
router.patch("/application/:id/status", isAuthenticated, updateStatus);

// Admissions
router.get("/admission", isAuthenticated, getAdmission);
router.post("/admission", isAuthenticated, postAdmission);
router.put("/admission/:id", isAuthenticated, updateAdmission);
router.patch("/admission/:id", isAuthenticated, updateAdmission);
router.delete("/admission/:id", isAuthenticated, deleteAdmission);

// Students
router.get("/student", isAuthenticated, getStudents);
router.post("/student", isAuthenticated, StudentController);
router.put("/student/:id", isAuthenticated, StudentController);
router.delete("/student/:id", isAuthenticated, StudentController);

//Fees
router.get("/fees", isAuthenticated, FeeController.list);
router.post("/fees", isAuthenticated, FeeController.create);
router.delete("/fees/:id", isAuthenticated, FeeController.remove);

//Report
router.get("/report", isAuthenticated, ReportController.index);

//Setting
router.get("/setting", isAuthenticated, SettingController.index);

export default router;
