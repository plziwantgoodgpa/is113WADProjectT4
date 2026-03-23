// const songs = {
//     song_id : 1,
//     songName: "Song1",
//     artist: "me",
//     category: "test",
//     description: "for test only"
// }

// 1. Import the Song model
const Song = require('../model/SongModel');

// 2. Create and export the "Retrieve All" function
exports.getAllSongs = async (req, res) => {
    try {
        // THE FORMULA: .find() with no arguments returns everything in the collection
        const songs = await Song.retrieveAll(); 
        console.log(songs)
        // Send a successful response back to the client
        res.render("AllSong",{songs})

    } catch (error) {
        // If something goes wrong (e.g., database is down), catch the error
        console.error(error);
        res.send("Error reading database show songs")
    }
};