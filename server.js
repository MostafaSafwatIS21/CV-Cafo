const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");
const port = process.env.PORT || 2000;

// connect to database
const DB_URL = process.env.BADABASE_LOCAL;
mongoose.connect(DB_URL, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log("Connected to database successfully");
})
.catch((err) => {
  console.log(`Something went wrong ${err}`);
});



// Connect to server
const server =app.listen(port, () => {
  console.log(`Connected to server successfully at port ${port}`);
});
