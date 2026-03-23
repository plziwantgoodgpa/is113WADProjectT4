const express = require('express');
const router = express();

// Import the controller we just made
const songController = require('../controllers/songController');

// When a GET request hits '/api/songs', run the getAllSongs function
router.get('/', songController.getAllSongs);

module.exports = router;