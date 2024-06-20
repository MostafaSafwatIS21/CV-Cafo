const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = require("./app");
const port = process.env.PORT || 200;
// connect to database
const DB_URL = process.env.BADABASE_LOCAL;
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("connect to database successfully");
  })
  .catch((err) => {
    console.log(`Something went wrong ${err}`);
  });
// conncet to server
const server = app.listen(port, () => {
  console.log(`conncet to server successfully at port ${port}`);
});
