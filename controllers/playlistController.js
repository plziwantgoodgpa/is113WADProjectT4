const fs = require('fs/promises');

// Get Service model
const Playlist = require('./../models/playlistModel');
const e = require('express');

async function renamePlaylist(new_name){
    await Playlist.findOneAndUpdate(
    { playList_id: playList_id, user_id: user_id },
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
    { $pull: { songs: { song_id: sonf_id1 } } }
);
}