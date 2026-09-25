import express from "express";
const router = express.Router();
import {
  getRegisterForm,
  postRegister,
  getLoginForm,
  postLogin,
  logout,
} from "../controllers/authC.js";

router.get("/register", getRegisterForm);
router.post("/register", postRegister);
router.get("/login", getLoginForm);
router.post("/login", postLogin);
router.get("/logout", logout)

export default router;
