const express = require('express');
const router = express();

// Import the controller we just made
const songController = require('../controllers/songController');

// When a GET request hits '/api/songs', run the getAllSongs function
router.get('/allSong', songController.getAllSongs);
router.get('/songDetail', songController.getSongBySongID);
// ADD SONG
router.get('/addSong', songController.showAddSongForm); // Shows the blank form
router.post('/addSong', songController.insertSong);       // Processes the form submission

// EDIT SONG
router.get('/editSong', songController.showEditSongForm); // Shows form with existing data
router.post('/editSong', songController.updateSong);        // Processes the update

// DELETE SONG
router.get('/deleteSong', songController.deleteSong);       // Deletes the song and redirects
module.exports = router;