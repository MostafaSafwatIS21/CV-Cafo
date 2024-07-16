const User = require("../models/userModel")
const multer = require("multer");
const AppError = require("../utils/AppError");
const sharp = require("sharp");
const catchAsync = require("../utils/catchAsync");

/**
 * @abstract upload image
 * @route POST /api/users/uploadImage
 * @access private
 * @function uploadImage
 */
// multer storage
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

exports.uploadImage = upload.single("avatar");

exports.resizeImage = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

/**
 * @abstract get all users
 * @route GET /api/users
 * @access private only admin
 * @function getUsers
 */

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: users,
  });
});

/**
 * @abstract get a single user
 * @route GET /api/users/:id
 * @access private  user and admin
 * @function getUser
 */
exports.getUser = catchAsync(async (req, res, next) => {
  console.log(req.params.id, "id");
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, "name");
  if (req.file) filteredBody.avatar = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
};


/**
 * @last active
 * */
exports.getUserStatus = catchAsync(async (req, res, next) => {
  const users = await User.find().select("name email lastActive");

  res.status(200).json({
    status: "success",
    data: {
      users: users.map(user => ({
        name: user.name,
        email: user.email,
        lastActive: user.lastActive,
        isOnline: user.isOnline
      }))
    }
  });
})