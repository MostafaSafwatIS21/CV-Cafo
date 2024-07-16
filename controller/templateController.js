const Template = require("../models/templateModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");

const multerStrorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStrorage,
  fileFilter: multerFilter,
});

exports.uploadCover = upload.single("cover");
/**
 * @abstract resize the image to a specific size
 *
 */
exports.resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    req.file.filename = `template-cover-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(960, 1358)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/covers/${req.file.filename}`);

    next();
  } catch (err) {
    return next(new AppError("Error resizing image", 500));
  }
};

exports.createTemplate = async (req, res, next) => {
  try {
    if (!req.file || !req.file.filename) {
      return next(new AppError("Please upload a cover image", 400));
    }

    const { type, price, name } = req.body;
    const cover = req.file.filename;
    const userId = req.user._id;

    const newTemplate = await Template.create({
      type,
      cover,
      userId,
      price: `$${price}`,
      name,
    });

    res.status(201).json({
      status: "success",
      data: {
        template: newTemplate,
      },
    });
  } catch (err) {
    next(new AppError(err, 400)); // Pass error to global error handler
  }
};

exports.getAllTemplates = catchAsync(async (req, res, next) => {
  const templates = await Template.find({ type: "resume" });

  res.status(200).json({
    status: "success",
    results: templates.length,
    data: {
      templates,
    },
  });
});

exports.deleteTemplate = catchAsync(async (req, res, next) => {
  const template = await Template.deleteMany();
  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.getAllResume = catchAsync(async (req, res, next) => {
  const resumes = await Template.find({ type: "resume" });

  res.status(200).json({
    status: "success",
    results: resumes.length,
    data: {
      resumes,
    },
  });
});

exports.getAllCoverLetter = catchAsync(async (req, res, next) => {
  const resumes = await Template.find({ type: "cover letter" });

  res.status(200).json({
    status: "success",
    results: resumes.length,
    data: {
      resumes,
    },
  });
});

exports.getAllEmailSignature = catchAsync(async (req, res, next) => {
  const resumes = await Template.find({ type: "email signature" });

  res.status(200).json({
    status: "success",
    results: resumes.length,
    data: {
      resumes,
    },
  });
});

exports.getAllJobTracker = catchAsync(async (req, res, next) => {
  const resumes = await Template.find({ type: "job tracker" });

  res.status(200).json({
    status: "success",
    results: resumes.length,
    data: {
      resumes,
    },
  });
});

exports.getAllPortofilio = catchAsync(async (req, res, next) => {
  const resumes = await Template.find({ type: "personal website" });

  res.status(200).json({
    status: "success",
    results: resumes.length,
    data: {
      resumes,
    },
  });
});

/**
 * @abstract sort the templates by classifying them into different categories
 * @param query - the query to be sorted
 *@public
 */
exports.classifyTemplates = catchAsync(async (req, res, next) => {});
