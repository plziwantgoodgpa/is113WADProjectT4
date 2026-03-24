const fs = require('fs/promises');

// Get Service model
const Playlist = require('./../model/playlistModel');
const e = require('express');

async function renamePlaylist(new_name, user_id1, playList_id1){
    await Playlist.findOneAndUpdate(
    { playList_id: playList_id1, user_id: user_id1 },
    { $set: { PlayListName: new_name } }
);
}

async function addSong(song_id1,user_id1,playList_id1){
    await Playlist.findOneAndUpdate(
    { playList_id: playList_id1, user_id: user_id1 },
    { $push: { songs: { song_id: song_id1 } } }
); 
}

async function removeSong(song_id1,user_id1,playList_id1) {
    await Playlist.findOneAndUpdate(
    { playList_id: playList_id1, user_id: user_id1 },
    { $pull: { songs: { song_id: song_id1 } } }
);
}
exports.showCreatePlaylist = (req, res) => {
    res.render('playlist/createPlaylist');
};

exports.createPlaylist = async (req, res) => {
    try {
        const { playList_id, PlayListName } = req.body;
        const user_id = "testuser1";

        await Playlist.addPlaylist(user_id, {
            playList_id: parseInt(playList_id),
            PlayListName: PlayListName,
            songs: []
        });

        res.redirect('/playlist');
    } catch (error) {
        res.send('Error creating playlist');
    }
};

exports.showRemoveSongPage = async (req, res) => {
    try {
        const playList_id = parseInt(req.params.id);
        const playlist = await Playlist.findByPlaylistId(playList_id);

        if (!playlist) {
            return res.send('Playlist not found');
        }

        res.render('playlist/removeSong', { playlist });
    } catch (error) {
        res.send('Error loading playlist');
    }
};

exports.removeSong = async (req, res) => {
    try {
        const playList_id = parseInt(req.params.playlistId);
        const song_id = parseInt(req.params.songId);

        await Playlist.removeSongFromPlaylist(playList_id, req.body.user_id, song_id);

        res.redirect(`/playlist/remove/${playList_id}`);
    } catch (error) {
        res.send('Error removing song');
    }
};