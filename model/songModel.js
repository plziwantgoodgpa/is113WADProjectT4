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
    category_id: {
        type: Number,
        required: [true, 'A song must have a category_id'],
    },
    category: {
        type: String,
        required: [true, 'A song must have a category']
    },
    description: {
        type: String,
        required: [true, 'A song must have a description']
    },
    view_count: {
        type: Number
    },
    views: {
        type: Number,
        required: [true, 'A song msut have a view'],
        default: 0
    }
});

// Fixed: This was previously pointing to 'reviewSchema'
const Song = mongoose.models.Song || mongoose.model('Song', songSchema, 'Song');
const Category = mongoose.models.Category
// Methods
exports.retrieveAll = function () {
    return Song.find();
};

exports.findBySongId = function (song_id) {
    return Song.findOne({ song_id: song_id });
};

// ADD NEW SONG
exports.addSong = async function (songData) {
    // 1. Find the song with the highest song_id in the database
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
exports.editSong = function (song_id, updatedData) {
    // Finds by song_id and updates with the new data from the form
    return Song.findOneAndUpdate(
        { song_id: song_id },
        updatedData,
        { runValidators: true } // Ensures the user didn't leave required fields blank!
    );
};

// DELETE SONG
exports.deleteSong = function (song_id) {
    return Song.findOneAndDelete({ song_id: song_id });
};

//search song
exports.searchSongs = function (searchTerm) {
    return Song.find({
        $or: [
            // Checks if the search word is in the song name
            { songname: { $regex: searchTerm, $options: 'i' } },

            // Checks if the search word is in the category name
            { category: { $regex: searchTerm, $options: 'i' } }
        ]
    });
};

exports.findSongsByCat = async (categoryID) => {
    try {
        const filteredSongs = await Song.find({ category_id: categoryID });

        return filteredSongs;

    } catch (error) {
        console.error("MongoDB Error in findSongsByCategory:", error);
        throw error; 
    }
};


exports.incrementViewCount = function (song_id) {
    return Song.updateOne(
        { song_id: song_id },
        { $inc: { view_count: 1 } }
    );
};

exports.getPopularSongs = function () {
    return Song.find().sort({ view_count: -1, songname: 1 });
};
exports.incrementViews = async (req, res) => {

} 
