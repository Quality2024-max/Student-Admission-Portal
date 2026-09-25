import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

const getRegisterForm = (req, res) => {
  res.render("auth/register", {
    title: "Create Account",
  });
};

const postRegister = async (req, res) => {
  try {
    console.log("==============start==========");
    const { name, email, password, confirmPassword } = req.body;
    console.log(req.body);
    // Validation
    if (!name || !email || !password) {
      req.flash("warning", "⚠️ Please fill in all fields.");
      return res.redirect("/register");
    }
    // Password match check
    if (password != confirmPassword) {
      req.flash("warning", "⚠️ Password confirmation does not match.");
      return res.redirect("/register");
    }
    // Password length check
    if (password.length < 6) {
      req.flash("warning", "⚠️ Password must be at least 6 characters long.");
      return res.redirect("/register");
    }
    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      req.flash(
        "error",
        "❌ This email is already registered. Please use a different email address.",
      );
      return res.redirect("/register");
    }

    // Naye users hamesha 'student' role ke sath bante hain.
    // Admin sirf manually DB me ya kisi existing admin ke through banaya jata hai
    // (security best practice: registration form se koi seedha admin nahi ban sakta)
    const hashedPassowrd = await bcrypt.hash(password, 10);
    await userModel.createUser(name, email, hashedPassowrd, "student");

    req.flash(
      "success",
      "🎉 Registration successful! Please login to continue.",
    );
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    req.flash("error", "❌ Something went wrong. Please try again.");
    res.redirect("/register");
  }
};

const getLoginForm = (req, res) => {
  res.render("auth/login", { title: "Login" });
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    const user = await userModel.findByEmail(email);
    // Agar user nahi mila to error flash karo aur login page pe redirect karo
    if (!user) {
      req.flash("warning", "⚠️ Invalid email or password.");
      return res.redirect("/login");
    }
    // Password match check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("warning", "⚠️ Invalid email or password.");
      return res.redirect("/login");
    }

    // Agar sab kuch sahi hai to user ko session me store karo
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    req.flash(
      "success",
      `🚀 Welcome back ${user.name.charAt(0).toUpperCase() + user.name.slice(1)}!`,
    );
    // Role ke hisaab se alag dashboard par bhejo
    // if(user.role === 'admin'){
    //  return res.redirect('/admin/dashboard');
    // }else{
    //  return res.redirect('/student/dashboard')
    // }
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    req.flash("error", "❌ Something went wrong. Please try again.");
    return res.redirect("/login");
  }
};

const logout = (req, res) => {
  // Session destroy karne se user logout ho jayega
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

export { getRegisterForm, postRegister, getLoginForm, postLogin, logout };
