const Calculation = require("../models/Calculation");

const postCalculation = async (req, res, next) => {
  try {
    const operation = req.body.operation; // "12+4+6-5*25/5"

    // split the operation into individual numbers and operators separately
    const parts = operation.match(/(\d+|\+|\-|\*|\/)/g);

    // start with the first number
    let result = Number(parts.shift());

    // loop through the remaining parts and perform the operations in order
    for (let i = 0; i < parts.length; i += 2) {
      const operator = parts[i];
      const operand = Number(parts[i + 1]);

      switch (operator) {
        case "+":
          result += operand;
          break;
        case "-":
          result -= operand;
          break;
        case "*":
          result *= operand;
          break;
        case "/":
          result /= operand;
          break;
        default:
          throw new Error(`Invalid operator ${operator}`);
      }
    }
    const savedOperation = new Calculation({
      nameOfCalc: req.body.nameOfCalc,
      calculationLine: req.body.operation,
      calculatedResult: result.toString(),
      userId: req.body.userId,
    });
    await savedOperation.save();
    res.status(201).json({ result: savedOperation });
  } catch (err) {
    next(err);
  }
};

const re_calculate = async (req, res, next) => {
  let lastResult = null;
  try {
    const operation = req.body.operation; // "12+4+6-5*25/5"
    const recursive = req.body.recursive === "true";

    // split the operation into individual numbers and operators
    const parts = operation.match(/(\d+|\+|\-|\*|\/)/g);

    // start with the first number, or the previous result if recursive is enabled
    let result =
      recursive && lastResult !== null ? lastResult : Number(parts.shift());

    // loop through the remaining parts and perform the operations in order
    for (let i = 0; i < parts.length; i += 2) {
      const operator = parts[i];
      const operand = Number(parts[i + 1]);

      switch (operator) {
        case "+":
          result += operand;
          break;
        case "-":
          result -= operand;
          break;
        case "*":
          result *= operand;
          break;
        case "/":
          result /= operand;
          break;
        default:
          throw new Error(`Invalid operator ${operator}`);
      }
    }

    // save the result if recursive is enabled
    if (recursive) {
      lastResult = result;
    }
    const updatedCalculation = await Calculation.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          nameOfCalc: req.body.nameOfCalc,
          calculationLine: req.body.operation,
          calculatedResult: result.toString(),
          userId: req.body.userId,
        },
      },
      { new: true }
    );
    res.status(200).json({
      message: "successfully recalculated the operation",
      calculation: updatedCalculation,
    });
  } catch (err) {
    next(err);
  }
};

const getCalculationHistory = async (req, res, next) => {
  try {
    const userCalculations = await Calculation.find({
      userId: req.params.userId,
    });
    res.status(200).json({
      message: "History retrieved successfully",
      calculations: userCalculations,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCalculation = async (req, res, next) => {
  try {
    await Calculation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Calculation deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postCalculation,
  getCalculationHistory,
  re_calculate,
  deleteCalculation,
};
