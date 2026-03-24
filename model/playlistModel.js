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

exports.retrieveByUserId = function(user_id) {
    return Playlist.find({ user_id: user_id });
};

exports.removeSongFromPlaylist = async (playList_id, user_id, song_id) => {
    try {
        return await Playlist.findOneAndUpdate(
            {
                playList_id: playList_id,
                user_id: user_id
            },
            {
                $pull: { songs: { song_id: song_id } }
            },
            { new: true }
        );
    } catch (error) {
        return null;
    }
};

exports.findByPlaylistId = function(playList_id) {
    return Playlist.findOne({ playList_id: playList_id });
};

exports.addPlaylist = async (user_id, playlistData) => {
    try {
        return await Playlist.create({
            ...playlistData,        // spread the rest of the playlist data
            user_id: user_id        // always force the user_id to the logged-in user
        });
    } catch (error) {
        return null;
    }
}

exports.deletePlaylist = async (playList_id, user_id) => {
    try {
        return await Playlist.findOneAndDelete({
            playList_id: playList_id,
            user_id: user_id         // ensures users can only delete their own playlists
        });
    } catch (error) {
        return null;
    }
}
