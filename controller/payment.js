// controllers/paymentController.js
const paypal = require("@paypal/checkout-server-sdk");
const Subscription = require("../models/subscriptionModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const paymobAPI = require("../utils/paymobConfig");

// PayPal configuration
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Helper function to create PayPal order
const createPayPalOrder = async (price, duration, req) => {
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
        )}/success?duration=${duration}&paymentMethod=paypal`,
        cancel_url: `${req.protocol}://${req.get("host")}/cancel`,
        shipping_preference: "NO_SHIPPING",
      },
    });

    const order = await client.execute(request);
    return order.result.links.find((link) => link.rel === "approve").href;
    console.log("PayPal order created:", order);
  } catch (error) {
    log.error("PayPal error:", error);
  }
};

// Helper function to create PayMob order
const createPayMobOrder = async (price, duration, req) => {
  try {
    const response = await paymobAPI.post("/auth/tokens", {
      api_key: process.env.PAYMOB_API_KEY,
    });

    const authToken = response.data.token;
    console.log("PayMob auth token:", authToken);

    // Order Registration API
    const orderResponse = await paymobAPI.post("/ecommerce/orders", {
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: price * 100, // PayMob requires amount in cents
      currency: "EGP",
      items: [],
    });

    const orderId = orderResponse.data.id;
    console.log("Order ID:", orderId);

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
  const { duration, paymentMethod } = req.body;

  let price;
  if (duration === "1-month") {
    price = 11.0;
  } else if (duration === "1-year") {
    price = 79.0;
  } else {
    return next(new AppError("Invalid subscription duration.", 400));
  }

  let paymentUrl;
  if (paymentMethod === "paypal") {
    paymentUrl = await createPayPalOrder(price, duration, req);
  } else if (paymentMethod === "paymob") {
    paymentUrl = await createPayMobOrder(price, duration, req);
  } else {
    return next(new AppError("Invalid payment method.", 400));
  }
  res.redirect(paymentUrl);
});

exports.paymentSuccess = catchAsync(async (req, res, next) => {
  const { duration, paymentMethod, token, PayerID } = req.query;
  const userId = req.user.id;

  let subscriptionAmount;
  let endDate;
  if (duration === "1-month") {
    subscriptionAmount = 11.0;
    endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  } else if (duration === "1-year") {
    subscriptionAmount = 79.0;
    endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 365 days from now
  } else {
    return next(new AppError("Invalid subscription duration.", 400));
  }

  if (paymentMethod === "paypal") {
    const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
    captureRequest.requestBody({});

    try {
      const capture = await client.execute(captureRequest);
      await Subscription.create({
        userId: userId,
        paypalPaymentId: capture.result.id,
        amount: subscriptionAmount,
        duration: duration,
        status: "active",
        endDate: endDate,
      });

      res.render("test/success");
    } catch (error) {
      console.error("Error capturing PayPal payment:", error);
      return next(
        new AppError("An error occurred processing your PayPal payment.", 500)
      );
    }
  } else if (paymentMethod === "paymob") {
    // Handle PayMob payment success logic here
    await Subscription.create({
      userId: userId,
      paypalPaymentId: "PayMob Transaction ID", // Replace with actual PayMob transaction ID
      amount: subscriptionAmount,
      duration: duration,
      status: "active",
      endDate: endDate,
    });

    res.render("test/success");
  } else {
    return next(new AppError("Invalid payment method.", 400));
  }
});
