
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/add-review", reviewController.addReview);
router.get("/song/songDetail", reviewController.editReview);
router.post("/song/songDetail", reviewController.editReview);


module.exports = router;

