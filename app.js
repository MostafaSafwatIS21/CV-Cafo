const express = require("express");
const app = express();
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controller/errorController");
//routers
const userRouter = require("./router/userRouter");
const viewRouter = require("./router/viewRouter");
const templateRouter = require("./router/templateRouter");
const dashboardRouter = require("./router/dashboardRouter");
const couponRouter = require("./router/couponRouter");
const payment = require("./router/payment");
const pricePlanRouter = require("./router/pricePlanRouter");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// view engine
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// For parsing application/json

// Session setup
app.use(
  session({
    secret: process.env.SECRET_KEY_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);
//test payment
// paypal
// app.use("/", paymentRouter);
app.use("/api/pay", payment);
//google OAuth
app.use(passport.initialize());
app.use(passport.session());

// view route
app.use("/", viewRouter);
// user route
app.use("/api/user", userRouter);
app.use("/api/template", templateRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/price-plan", pricePlanRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find this route ${req.originalUrl} `, 400));
});
app.use(globalErrorHandler);
module.exports = app;
