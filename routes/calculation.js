const {
  postCalculation,
  getCalculationHistory,
  re_calculate,
  deleteCalculation,
} = require("../controllers/calculation");

const router = require("express").Router();

router.route("/post-evaluation").post(postCalculation);
router.route("/get-evaluations/:userId").get(getCalculationHistory);
router.route("/re_calculate/:id").patch(re_calculate);
router.route("/delete-evaluation/:id").delete(deleteCalculation);

module.exports = router;
