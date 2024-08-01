const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const template = require("../models/templateModel");
const { protect, isLoggedIn } = require("../controller/autheController");
const PlanPrice = require("../models/pricePlanModel");
const AppError = require("../utils/AppError");
const { formatLastActive } = require("../utils/timeUtils");

exports.login = async (req, res, next) => {
  if (req.cookies.accessToken || req.cookies.refreshToken) {
    return res.redirect("/dashboard");
  }
  res.status(200).render("Login");
};
exports.Register = async (req, res, next) => {
  if (req.cookies.accessToken || req.cookies.refreshToken) {
    return res.redirect("/dashboard");
  }
  res.status(200).render("Register");
};
exports.home = async (req, res, next) => {
  res.status(200).render("index");
};
exports.dashboard = async (req, res, next) => {
  const user = res.locals.user;
  const resume = await template.find({ type: "resume" });
  res.status(200).render("dashboard", { user, resume });
};
exports.forgetPassword = async (req, res, next) => {
  res.status(200).render("ForgetPassword");
};

exports.OTP = async (req, res, next) => {
  const { message, token } = req.query;

  res.render("OTP", { message, token });
};

exports.setPassword = async (req, res, next) => {
  res.render("set-password");
};

exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  res.render("reset-password", { token });
};
exports.changePassword = async (req, res, next) => {
  res.render("change-password");
};

exports.error = async (req, res, next) => {
  res.render("error");
};
/**@admin dashboard
 *
 * */
exports.adminDashboard = async (req, res, next) => {
  const user = res.locals.user;
  //count of templates
  const countTemplates = await template.countDocuments();

  // Count users with a pricing plan
  const AllUser = await User.find().populate("pricingPlan");

  let users = AllUser.filter((u) => u._id.toString() !== user._id.toString());

  const totalSales = users.reduce((total, user) => {
    if (user.pricingPlan && user.pricingPlan.price) {
      total += user.pricingPlan.price;
    }
    return total;
  }, 0);
  const countUser = users.length;

  const usersCount = await User.countDocuments();

  // plans
  const calculateTotalPriceAndCounOfUsers = (users, planName, planDuration) => {
    const count = users.filter(
      (user) =>
        user.pricingPlan.name === planName &&
        user.pricingPlan.duration === planDuration
    ).length;
    const plan = users.find(
      (user) =>
        user.pricingPlan.name === planName &&
        user.pricingPlan.duration === planDuration
    );
    const price = plan ? plan.pricingPlan.price : 0;
    const totalPrice = count * price;
    const now = new Date();
    const expiredUsers = users.filter(
      (user) =>
        user.pricingPlan.name === planName &&
        user.pricingPlan.duration === planDuration &&
        user.subscriptionEndDate &&
        user.subscriptionEndDate < now
    ).length;
    return { count, totalPrice, expiredUsers };
  };
  const proMonth = calculateTotalPriceAndCounOfUsers(users, "Pro", "month");
  const proYear = calculateTotalPriceAndCounOfUsers(users, "Pro", "year");
  const basicMonth = calculateTotalPriceAndCounOfUsers(users, "Basic", "month");
  const basicYear = calculateTotalPriceAndCounOfUsers(users, "Basic", "year");
  const premiumMonth = calculateTotalPriceAndCounOfUsers(
    users,
    "Premium",
    "month"
  );
  const premiumYear = calculateTotalPriceAndCounOfUsers(
    users,
    "Premium",
    "year"
  );
  const plans = {
    proMonth,
    proYear,
    basicMonth,
    basicYear,
    premiumMonth,
    premiumYear,
  };
  const year = await PlanPrice.find({ duration: "year" }).sort({ name: 1 });
  const month = await PlanPrice.find({ duration: "month" }).sort({ name: 1 });
  const duration = {
    year,
    month,
  };

  users = users.map((u) => {
    const formattedLastActive = formatLastActive(u.lastActive.toISOString());
    return {
      ...u._doc,
      lastActive: formattedLastActive,
    };
  });

  // count of template types
  const getCountByType = async () => {
    try {
      const result = await template.aggregate([
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ]);
      return result;
    } catch (error) {
      console.error("Error getting count by type:", error);
    }
  };

  const getAllCounts = async () => {
    const result = await getCountByType();

    const types = [
      "resume",
      "cover letter",
      "job tracker",
      "personal website",
      "email signature",
    ];

    const countOfTemplateType = types.reduce((acc, type) => {
      const typeObject = result.find((item) => item._id === type);
      acc[type] = typeObject ? typeObject.count : 0;
      return acc;
    }, {});

    return countOfTemplateType;
  };

  // Example usage
  const allCountsType = await getAllCounts();

  // count of user who use templates type
  const getUserCountByTemplateType = async (templateType) => {
    try {
      const result = await template.aggregate([
        { $match: { type: templateType } },
        { $group: { _id: "$userId" } },
        { $count: "uniqueUserCount" },
      ]);

      if (result.length > 0) {
        return result[0].uniqueUserCount;
      } else if (result.length === 0) {
        return 0;
      }
    } catch (error) {
      console.error("Error getting user count by template type:", error);
    }
  };

  // Example usage to get count of unique users using "resume" templates
  const resumeUserCount = await getUserCountByTemplateType("resume");
  const coverLetterUserCount = await getUserCountByTemplateType("cover letter");
  const jobTrackerUserCount = await getUserCountByTemplateType("job tracker");
  const personalWebsiteUserCount = await getUserCountByTemplateType(
    "personal website"
  );
  const emailSignatureUserCount = await getUserCountByTemplateType(
    "email signature"
  );

  const usersCountByTemplateType = {
    resume: resumeUserCount,
    coverLetter: coverLetterUserCount,
    jobTracker: jobTrackerUserCount,
    personalWebsite: personalWebsiteUserCount,
    emailSignature: emailSignatureUserCount,
  };
  res.render("Admin-Dashboard", {
    user,
    countTemplates,
    countUser,
    usersCount,
    totalSales,
    plans,
    duration,
    users,
    allCountsType,
    usersCountByTemplateType,
  });
};

/**
 * @abstract    Get all the templates
 *
 **/

exports.ourStory = async (req, res, next) => {
  res.render("Pages/our-story");
};

exports.coverBuilder = async (req, res, next) => {
  res.render("Pages/Cover-letter-builder");
};
exports.coverTemplate = async (req, res, next) => {
  res.render("Pages/Cover-letter-templates");
};
exports.emailSignature = async (req, res, next) => {
  res.render("Pages/Email-Signature");
};
exports.emailSignatureTemplate = async (req, res, next) => {
  res.render("Pages/Email-Signature-Templates");
};
exports.jobTracker = async (req, res, next) => {
  res.render("Pages/Job-Tracker");
};
exports.personalWebsite = async (req, res, next) => {
  res.render("Pages/Personal-Website");
};
exports.pricing = async (req, res, next) => {
  const year = await PlanPrice.find({ duration: "year" }).sort({ name: 1 });
  const month = await PlanPrice.find({ duration: "month" }).sort({ name: 1 });
  // console.log(year.features[0].quantity)

  console.log(month[0].features[2].quantity);
  res.render("Pages/pricing", {
    year,
    month,
  });
};

exports.privacyPolicy = async (req, res, next) => {
  res.render("Pages/Privacy_policy");
};
exports.resumeBuilder = async (req, res, next) => {
  res.render("Pages/Resume-builder");
};
exports.resumeTemplates = async (req, res, next) => {
  res.render("Pages/Resume-templates");
};
exports.terms = async (req, res, next) => {
  res.render("Pages/terms");
};
exports.websiteTemplates = async (req, res, next) => {
  res.render("Pages/Website-Templates");
};

exports.write = async (req, res, next) => {
  res.render("write");
};
exports.write_1 = async (req, res, next) => {
  res.render("write1");
};

//test
exports.payment = async (req, res, next) => {
  res.render("test/create");
};
exports.payment__new = async (req, res, next) => {
  res.render("test/payment");
};
exports.pay = async (req, res, next) => {
  const user = res.locals.user;
  res.render("pages/Pay", {
    user,
  });
};
