const express = require("express");

const router = express.Router();
const playlistController = require('../controllers/playlistController');

router.get("/", playlistController.getAllPlaylist);

router.get('/create', playlistController.showCreatePlaylist);
router.post('/create', playlistController.createPlaylist);

router.get('/remove/:id', playlistController.showRemoveSongPage);
router.get('/remove/:playlistId/:songId', playlistController.removeSong);

router.get("/:id", playlistController.getPlaylist);

router.get('/:playlistId/addsong', playlistController.showAddSongPage);
router.get('/:playlistId/addsong/:songId', playlistController.addSong);


module.exports = router;