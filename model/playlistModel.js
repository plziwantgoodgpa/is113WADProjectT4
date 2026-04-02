const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    user_id: {
        type: String, // Changed to String to match User schema
        required: [true, 'A playlist must have a user']
    },
    playList_id: {
        type: String,
        unique: true
    },
    PlayListName: {
        type: String,
        required: [true, 'A playlist must have a name'],
    },
    date_created: {
        type: Date,
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
            { returnDocument: 'after' }

        );
    } catch (error) {
        return null;
    }
};

exports.findByPlaylistId = function(playList_id) {
    return Playlist.findOne({ playList_id: playList_id });
};

exports.addPlaylist = async (user_id, playlistData ) => {
    try {
        const playlist = await Playlist.create({
            ...playlistData, //spreads data
            user_id: user_id
        });

        playlist.playList_id = playlist._id.toString();
        await playlist.save();

        return playlist;
    } catch (error) {
        console.error(error);
        return null;
    }
};


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

exports.addSongToPlaylist = async (playList_id, user_id, song_id) => {
    try {
        return await Playlist.findOneAndUpdate(
            { playList_id: playList_id, user_id: user_id },
            { $push: { songs: { song_id: song_id } } },
            { returnDocument: 'after' }

        );
    } catch (error) {
        console.error(error);
        return null;
    }
};
exports.updatePlaylistName = async (playList_id, user_id, new_name) => {
    try {
        return await Playlist.findOneAndUpdate(
            { playList_id: playList_id, user_id: user_id },
            { $set: { PlayListName: new_name } },
            { returnDocument: 'after' }

        );
    } catch (error) {
        console.error(error);
        return null;
    }
};