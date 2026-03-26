const express = require('express');
const router = express.Router();

// Import the controller we just made
const songController = require('../controllers/songController');

// When a GET request hits '/api/songs', run the getAllSongs function
router.get('/allSong', songController.getAllSongs);
router.get('/songDetail', songController.songDetail);
// ADD SONG
router.get('/addSong', songController.showAddSongForm); // Shows the blank form
router.post('/addSong', songController.insertSong);       // Processes the form submission

// EDIT SONG
router.get('/editSong', songController.showEditSongForm); // Shows form with existing data
router.post('/editSong', songController.updateSong);        // Processes the update

// DELETE SONG
router.get('/deleteSong', songController.deleteSong);       // Deletes the song and redirects

//Search song
router.get('/search', songController.searchSongs);




//// REVIEW TRIALL THIS IS FOR THE REVIEW SECTION BUT NEED TO MERGE. 



// router.get("/allSongs", songController.retrieveAllSongs);
// router.get("/songDetail", songController.songDetail);


//

module.exports = router;