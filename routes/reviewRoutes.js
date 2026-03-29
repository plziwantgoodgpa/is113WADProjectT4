
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/add-review", reviewController.addReview);
router.get("/editReview", reviewController.editReview);
router.post("/editReview", reviewController.editReview);


module.exports = router;

