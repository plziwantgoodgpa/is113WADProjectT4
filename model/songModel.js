const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    song_id: {
        type: Number,
        required: [true, 'A song must have a song_id'],
        unique: true
    },
    songname: {
        type: String,
        required: [true, 'A song must have a name']
    },
    artist: {
        type: String,
        required: [true, 'A song must have an artist']
    },
    category: {
        type: String,
        required: [true, 'A song must have a category']
    },
    description: {
        type: String,
        required: [true, 'A song must have a description']
    }
});

// Fixed: This was previously pointing to 'reviewSchema'
const Song = mongoose.model('Song', songSchema, 'Song'); 

// Methods
exports.retrieveAll = function() {
    return Song.find();
};

exports.findBySongId = function(song_id) {
    return Song.findOne({ song_id: song_id });
};