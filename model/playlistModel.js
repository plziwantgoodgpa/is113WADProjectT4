const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    user_id: {
        type: String, // Changed to String to match User schema
        required: [true, 'A playlist must have a user']
    },
    playList_id: {
        type: Number,
        required: [true, 'A playlist must have an id'],
        unique: true
    },
    PlayListName: {
        type: String,
        required: [true, 'A playlist must have a name'],
    },
    date_created: {
        type: Date,
        required: [true, 'A playlist must have a date_created'],
        default: Date.now // Automatically sets to the current date/time
    },
    songs: [
        {                  
            song_id: {
                type: Number,
                required: true
            }
        }
    ]
});

const Playlist = mongoose.model('Playlist', playlistSchema, 'PlayList');

// Methods
exports.retrieveAll = function() {
    return Playlist.find();
};

exports.findByPlaylistId = function(playList_id) {
    return Playlist.findOne({ playList_id: playList_id });
};