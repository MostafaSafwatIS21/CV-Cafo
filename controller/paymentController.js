const paypal = require("@paypal/checkout-server-sdk");
const PricePlan = require("../models/pricePlanModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const paymobAPI = require("../utils/paymobConfig");
const User = require("../models/userModel");
const Coupon = require("../models/couponModel");

// PayPal configuration
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Helper function to create PayPal order
const createPayPalOrder = async (price, duration, name, req) => {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: price.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: "Subscription Service",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${req.protocol}://${req.get(
          "host"
        )}/success?duration=${duration}&paymentMethod=paypal&name=${name}`,
        cancel_url: `${req.protocol}://${req.get("host")}/cancel`,
        shipping_preference: "NO_SHIPPING",
      },
    });

    const order = await client.execute(request);
    return order.result.links.find((link) => link.rel === "approve").href;
  } catch (error) {
    console.error("PayPal error:", error);
  }
};

// Helper function to create PayMob order
const createPayMobOrder = async (price, duration, name, req) => {
  try {
    const response = await paymobAPI.post("/auth/tokens", {
      api_key: process.env.PAYMOB_API_KEY,
    });

    const authToken = response.data.token;
    // Order Registration API
    const orderResponse = await paymobAPI.post("/ecommerce/orders", {
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: price * 100, // PayMob requires amount in cents
      currency: "EGP",
      items: [],
    });

    const orderId = orderResponse.data.id;
    // Payment Key Request
    const paymentKeyResponse = await paymobAPI.post(
      "/acceptance/payment_keys",
      {
        auth_token: authToken,
        amount_cents: price * 100,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: "NA",
          email: "NA",
          floor: "NA",
          first_name: "NA",
          street: "NA",
          building: "NA",
          phone_number: "NA",
          shipping_method: "NA",
          postal_code: "NA",
          city: "NA",
          country: "NA",
          last_name: "NA",
          state: "NA",
        },
        currency: "EGP",
        integration_id: process.env.PAYMOB_INTEGRATION_ID,
      }
    );

    const paymentKey = paymentKeyResponse.data.token;

    const iframeURL = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAM_ID}?payment_token=${paymentKey}`;
    return iframeURL;
  } catch (error) {
    console.error(
      "PayMob error:",
      error.response ? error.response.data : error.message
    );

    // Log detailed error response
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    }

    throw new Error("An error occurred processing your payment.");
  }
};

exports.createPayment = catchAsync(async (req, res, next) => {
  const { duration, name, paymentMethod, code, codeCheck } = req.body;
  let discount = 0;
  if (codeCheck) {
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return next(new AppError("Invalid coupon code.", 400));
    }
    discount = coupon.value;
  }

  if (!duration || !name || !paymentMethod) {
    return next(new AppError("Please provide all fields", 400));
  }

  const pricePlan = await PricePlan.findOne({ name, duration });
  if (!pricePlan) {
    return next(new AppError("Invalid Price Plan.", 400));
  }

  let paymentUrl;

  const finalPrice = pricePlan.price - (discount / 100) * pricePlan.price; //price - discount / 100 * price;

  if (paymentMethod === "paypal") {
    paymentUrl = await createPayPalOrder(finalPrice, duration, name, req);
  } else if (paymentMethod === "paymob") {
    paymentUrl = await createPayMobOrder(finalPrice, duration, name, req);
  } else {
    return next(new AppError("Invalid payment method.", 400));
  }

  // Redirect to payment URL or provide it for iframe
  res.json({ paymentUrl });
});

exports.paymentSuccess = catchAsync(async (req, res, next) => {
  const { duration, paymentMethod, token, name } = req.query;

  const user = await User.findById(req.user.id);
  const pricePlan = await PricePlan.findOne({ name, duration });
  if (!pricePlan) {
    return next(new AppError("Invalid Price Plan.", 400));
  }

  let endDate;
  if (duration === "month") {
    endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  } else if (duration === "year") {
    endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 365 days from now
  } else {
    return next(new AppError("Invalid subscription duration.", 400));
  }

  if (paymentMethod === "paypal") {
    const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
    captureRequest.requestBody({});

    try {
      const capture = await client.execute(captureRequest);
      user.pricingPlan = pricePlan._id;
      user.subscriptionStartDate = new Date(Date.now());
      user.subscriptionEndDate = endDate;
      await user.save({ validateBeforeSave: false });

      res.render("test/success");
    } catch (error) {
      console.error("Error capturing PayPal payment:", error);
      return next(
        new AppError("An error occurred processing your PayPal payment.", 500)
      );
    }
  } else if (paymentMethod === "paymob") {
    user.pricingPlan = pricePlan._id;
    user.subscriptionStartDate = new Date(Date.now());
    user.subscriptionEndDate = endDate;
    await user.save({ validateBeforeSave: false });

    res.render("test/success");
  } else {
    return next(new AppError("Invalid payment method.", 400));
  }
});
