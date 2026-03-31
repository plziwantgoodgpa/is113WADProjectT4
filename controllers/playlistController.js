const fs = require('fs/promises');

// Get Service model
const Playlist = require('./../model/playlistModel');
const Song = require('../model/songModel');
const e = require('express');

async function renamePlaylist(new_name, user_id1, playList_id1){
    await Playlist.findOneAndUpdate(
    { playList_id: playList_id1, user_id: user_id1 },
    { $set: { PlayListName: new_name } }
);
}

async function removeSong(song_id1,user_id1,playList_id1) {
    await Playlist.findOneAndUpdate(
    { playList_id: playList_id1, user_id: user_id1 },
    { $pull: { songs: { song_id: song_id1 } } }
);
}
exports.showCreatePlaylist = (req, res) => {
    if (!req.session.user) return res.redirect('/user/login');
    res.render('playlist/createPlaylist');
};

exports.createPlaylist = async (req, res) => {
    if (!req.session.user) return res.redirect('/user/login');
    try {
        const PlayListName = req.body.PlayListName;
        const user_id = req.session.user.username;

        await Playlist.addPlaylist(user_id, {
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
        const playList_id = req.params.id;
        const playlist = await Playlist.findByPlaylistId(playList_id);

        if (!playlist) {
            return res.send('Playlist not found');
        }

        //retrieves all the songs from song database
        const songDetails = await Promise.all(
            playlist.songs.map(s => Song.findBySongId(s.song_id))
        );

        res.render('playlist/removeSong', {playlist, songs: songDetails });
    } catch (error) {
        res.send('Error loading playlist');
    }
};

exports.removeSong = async (req, res) => {
    try {
        const playList_id = req.params.playlistId;
        const song_id = parseInt(req.params.songId);

        const user_id = req.session.user.username;
        await Playlist.removeSongFromPlaylist(playList_id, user_id, song_id);
        
await Playlist.removeSongFromPlaylist(playList_id, req.session.user.user_id, song_id);
        res.redirect(`/playlist/remove/${playList_id}`);
    } catch (error) {
        res.send('Error removing song');
    }
};

exports.getAllPlaylist = async (req,res) =>{
    if (!req.session.user) return res.redirect('/user/login');
    const user_id = req.session.user.username;
        const playlists = await Playlist.retrieveByUserId(user_id);
        res.render('playlist/display', { playlists, user_id });
}

// show all songs to add to a playlist
exports.showAddSongPage = async (req, res) => {
    if (!req.session.user) return res.redirect('/user/login');
    try {
        const playList_id = req.params.playlistId;
        const playlist = await Playlist.findByPlaylistId(playList_id);
        if (!playlist) return res.send('Playlist not found');

        const Song = require('../model/songModel');
        const songs = await Song.retrieveAll();

        res.render('playlist/addSong', { playlist, songs });
    } catch (error) {
        console.error(error);
        res.send('Error loading songs');
    }
};

// handle adding song to playlist
exports.addSong = async (req, res) => {
    if (!req.session.user) return res.redirect('/user/login');
    try {
        const playList_id = req.params.playlistId;
        const song_id = parseInt(req.params.songId);
        const user_id = req.session.user.username;

        const result = await Playlist.addSongToPlaylist(playList_id, user_id, song_id);
        if (!result) return res.send('Error adding song or playlist not found');

        res.redirect(`/playlist/${playList_id}`);
    } catch (error) {
        console.error(error);
        res.send('Error adding song');
    }
};

// playlistController.js - update getPlaylist
exports.getPlaylist = async (req, res) => {
    if (!req.session.user) return res.redirect('/user/login');
    try {
        const playList_id = req.params.id;
        const playlist = await Playlist.findByPlaylistId(playList_id);
        if (!playlist) return res.send('Playlist not found');
        //retrieves all the songs from song database
        const songDetails = await Promise.all(
            playlist.songs.map(s => Song.findBySongId(s.song_id))
        );

        res.render('playlist/PlaylistDetails', { playlist, songs: songDetails });
    } catch (error) {
        console.error(error);
        res.send('Error loading playlist');
    }
};
exports.deletePlaylist = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/user/login');

        const playList_id = req.params.id;
        const user_id = req.session.user.username;

        await Playlist.deletePlaylist(playList_id, user_id);

        res.redirect('/playlist');
    } catch (error) {
        console.error(error);
        res.send('Error deleting playlist');
    }
};
exports.showEditPlaylist = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/user/login');

        const playList_id = req.params.id;
        const playlist = await Playlist.findByPlaylistId(playList_id);

        if (!playlist) {
            return res.send('Playlist not found');
        }

        res.render('playlist/editPlaylist', { playlist });
    } catch (error) {
        console.error(error);
        res.send('Error loading edit playlist page');
    }
};
exports.editPlaylist = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/user/login');

        const playList_id = req.params.id;
        const user_id = req.session.user.username;
        const new_name = req.body.PlayListName;

        await Playlist.updatePlaylistName(playList_id, user_id, new_name);

        res.redirect(`/playlist/${playList_id}`);
    } catch (error) {
        console.error(error);
        res.send('Error updating playlist');
    }
};