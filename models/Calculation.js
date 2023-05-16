const mongoose = require("mongoose");

const calculationSchema = new mongoose.Schema(
  {
    nameOfCalc: {
      type: String,
      required: true,
    },
    calculationLine: {
      type: String,
      required: true,
    },
    calculatedResult: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Calculation = mongoose.model("Calculation", calculationSchema);

module.exports = Calculation;
