// ===================== IMPORTS =====================
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override";
import dotenv from "dotenv";

import authR from "./routes/authR.js";
import adminR from "./routes/adminR.js";

// ===================== ENV CONFIG =====================
dotenv.config();

// ===================== APP INITIALIZE =====================
const app = express();

// ===================== __filename & __dirname =====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(methodOverride("_method"));

// ===================== VIEW ENGINE =====================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===================== STATIC FILES =====================
app.use(express.static(path.join(__dirname, "public")));

// ===================== BODY PARSING =====================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---------- SESSION ----------
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 ghante
      httpOnly: true,
    },
  }),
);

// ===================== FLASH MESSAGES =====================
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use(
  methodOverride((req) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  }),
);

// ===================== HOME ROUTE =====================
app.get("/", (req, res) => {
  res.redirect("/login");
});

// ===================== AUTH ROUTES =====================
app.use("/", authR);
app.use("/admin", adminR);

// ===================== 404 HANDLER =====================
app.use((req, res) => {
  res.status(404).render("errors/404");
});

// ===================== SERVER START =====================
const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
