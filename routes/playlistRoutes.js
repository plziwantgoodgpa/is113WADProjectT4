const express = require("express");

const router = express.Router();
const playlistController = require('../controllers/playlistController');

router.get("/", (req, res) => {
    res.send("Playlist home");
});

router.get('/create', playlistController.showCreatePlaylist);
router.post('/create', playlistController.createPlaylist);

router.get('/remove/:id', playlistController.showRemoveSongPage);
router.get('/remove/:playlistId/:songId', playlistController.removeSong);

router.get("/display",playlistController.getAllPlaylist)
module.exports = router;