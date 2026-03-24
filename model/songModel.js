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

// ADD NEW SONG
exports.addSong = async function(songData) {
    // 1. Find the song with the highest song_id in the database
    // .sort({ song_id: -1 }) sorts them in descending order (highest to lowest)
    // .findOne() just grabs the very first one on that list
    const lastSong = await Song.findOne().sort({ song_id: -1 });

    // 2. Figure out the next ID
    let nextId = 1; // Default to 1 if the database is completely empty
    if (lastSong && lastSong.song_id) {
        nextId = lastSong.song_id + 1; // Add 1 to the highest existing ID
    }

    // 3. Inject this new ID into the data that came from the HTML form
    songData.song_id = nextId;

    // 4. Create and save the new song!
    const newSong = new Song(songData);
    return newSong.save(); 
};

// EDIT SONG
exports.editSong = function(song_id, updatedData) {
    // Finds by song_id and updates with the new data from the form
    return Song.findOneAndUpdate(
        { song_id: song_id }, 
        updatedData, 
        { runValidators: true } // Ensures the user didn't leave required fields blank!
    );
};

// DELETE SONG
exports.deleteSong = function(song_id) {
    // Finds the specific song and removes it from MongoDB
    return Song.findOneAndDelete({ song_id: song_id });
};