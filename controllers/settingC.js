const SettingController = {
  index(req, res) {
    res.render("admin/setting", {
      title: "Settings",
      user: req.session.user,
    });
  },
};

export { SettingController };
