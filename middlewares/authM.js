


// AUTHENTICATION: check karo login hai ya nahi
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash("info", "🔐 Please login to access this page.");
  res.redirect("/login");
}
// AUTHORIZATION: check karo role admin hai ya nahi
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }
  req.flash('warning','🚫 Only administrators are allowed to view this page.');
  res.status(403).redirect('/student/dashboard');
}

// GUEST: agar already login hai to login/register page dobara mat dikhao
function isGuest(req, res, next){
    if(req.session && req.session.user){
const redirectTo = req.session.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
return res.redirect(redirectTo);
    }
    next();
}

export { isAuthenticated,  isAdmin, isGuest};