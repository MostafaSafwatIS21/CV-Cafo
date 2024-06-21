const express = require("express");
const app = express();
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controller/errorController");
const userRouter = require("./route/userRouter");
const viewRouter = require("./route/viewRouter");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const compression = require("compression");
require("./utils/configPassport");

// cors
app.use(cors());
app.use(compression());
// body parser
app.use(express.json());
app.use(cookieParser());
// view engine
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// For parsing application/json

// Session setup
app.use(
  session({
    secret: process.env.SECRET_KEY_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);
//google OAuth
app.use(passport.initialize());
app.use(passport.session());

// view route
app.use("/", viewRouter);
// user route
app.use("/api/user", userRouter);
// test route
app.get("/test", (req, res) => {
  res.send("Hello World");
});

app.all("*", (req, res, next) => {
  next(new AppError(`can't find this route ${req.originalUrl} `, 400));
});
app.use(globalErrorHandler);
module.exports = app;
