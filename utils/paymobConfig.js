// services/paymobService.js
const axios = require("axios");

const paymobAPI = axios.create({
  baseURL: "https://accept.paymobsolutions.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = paymobAPI;
