const express = require('express');
const router = express();

// Import the review controller
const reviewController = require('../controllers/reviewController');

// Import the songs controller to show all the songs
// const songController = require('../controllers/songController');

// show all songs for them to pick the song that they want to review
// router.get("/reviewShowAllSongs", songController.getAllSongs)

// once they select the song, they can leave a review
router.get("/reviewShowAllSongs", reviewController.getReviewsPage)
module.exports = router;