const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
// importing the necessary dependencies

const calculationRoute = require("./routes/calculation");
const authRoute = require("./routes/auth");

dotenv.config();
// starting the dotenv service

const app = express();
// starting the express

app.use(express.json());
// using the json middleware in express package
app.use(cors());
// starting cors so that no problem comes while frontend integration
app.use(bodyParser.urlencoded({ extended: false }));
// this body parser is used to access the items in body while HTTP request
app.use(bodyParser.json());
// parsers the application in json format

async function connectDB() {
  try {
    // connecting to database
    await mongoose.connect(
      "mongodb+srv://srinivas:thisisasecret@cluster0.pll6b.mongodb.net/calculator"
    );
    console.log("Successfully Connected to MongoDB datebase");
  } catch (err) {
    // if error comes while connecting to database throw err
    console.log(err);
    throw err;
  }
}
// when the database gets disconnected
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB database Disconnected");
});
// when the database is being connected
mongoose.connection.on("connected", () => {
  console.log("MongoDB database connecting...");
});

// implementation of routes
app.use("/api/calculator/", calculationRoute);
app.use("/api/auth/", authRoute);

// error middleware
app.use((err, req, res, next) => {
  const errStatus = err.status || 400;
  const errMessage = err.message || "Something went wrong";
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack,
  });
});

const port = process.env.PORT || 4001;

app.listen(port, () => {
  connectDB();
  console.log(`App is now running on port ${port}`);
});
