
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/add-review", reviewController.addReview);
router.post("/edit-review", reviewController.editReview);
router.post("/delete-review", reviewController.deleteReview);

module.exports = router;







