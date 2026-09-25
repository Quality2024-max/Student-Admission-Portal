import { ApplicationModel } from "../models/applicatiomModel.js";

const getApplication = async (req, res) => {
  try {
    console.log("============== Application List Start ==============");

    const applications = await ApplicationModel.getAll();

    res.render("admin/application", {
      title: "Applications",
      user: req.session.user,
      applications: applications,
    });
  } catch (error) {
    console.error("Application Error:", error);

    req.flash("error", "❌ Could not load applications.");

    res.render("admin/application", {
      title: "Applications",
      user: req.session.user,
      applications: [],
    });
  }
};

const postNewApplication = async (req, res) => {
  // =====================================================
  // CREATE APPLICATION
  // =====================================================

  try {
    console.log("============== Create Application Start ==============");

    const {
      name,
      dob,
      email,
      phone,
      course,
      semester,
      qualification,
      score,
      status,
    } = req.body;

    console.log(req.body);

    // Generate application number
    const application_no = await ApplicationModel.nextApplicationNo();

    // Create application
    await ApplicationModel.create({
      application_no,
      name,
      dob,
      email,
      phone,
      course,
      semester,
      qualification,
      score,
      status,
    });

    req.flash("success", "🎉 Application added successfully.");

    res.redirect("/admin/application");
  } catch (error) {
    console.log(error);

    req.flash("error", "❌ Could not save application.");

    res.redirect("/admin/application");
  }
};

// =====================================================
// UPDATE APPLICATION
// =====================================================

const update = async (req, res) => {
  try {
    console.log("============== Update Application Start ==============");

    const { id } = req.params;

    const {
      name,
      dob,
      email,
      phone,
      course,
      semester,
      qualification,
      score,
      status,
    } = req.body;

    await ApplicationModel.update(id, {
      name,
      dob,
      email,
      phone,
      course,
      semester,
      qualification,
      score,
      status,
    });

    req.flash("success", "✅ Application updated successfully.");

    res.redirect("/admin/application");
  } catch (error) {
    console.log(error);

    req.flash("error", "❌ Could not update application.");

    res.redirect("/admin/application");
  }
};

// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================

const updateStatus = async (req, res) => {
  try {
    console.log("============== Update Status Start ==============");

    const { id } = req.params;
    const { status } = req.body;

    await ApplicationModel.updateStatus(id, status);

    req.flash("success", `✅ Application marked as ${status}.`);

    res.redirect("/admin/application");
  } catch (error) {
    console.log(error);

    req.flash("error", "❌ Could not update application status.");

    res.redirect("/admin/application");
  }
};

// =====================================================
// DELETE APPLICATION
// =====================================================

const remove = async (req, res) => {
  try {
    console.log("============== Delete Application Start ==============");

    const { id } = req.params;

    await ApplicationModel.remove(id);

    req.flash("success", "🗑️ Application deleted successfully.");

    res.redirect("/admin/application");
  } catch (error) {
    console.log(error);

    req.flash(
      "error",
      "❌ Could not delete application. It may already be linked to an admission.",
    );

    res.redirect("/admin/application");
  }
};

export { getApplication, postNewApplication, update, remove, updateStatus };
