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
        res.render("song/allSong",{songs})

    } catch (error) {
        // If something goes wrong (e.g., database is down), catch the error
        console.error(error);
        res.send("Error reading database show songs")
    }
};

exports.getSongBySongID = async (req, res) => {
    let songID = req.query.songID;

    // 1. If the user didn't provide an ID in the URL, redirect them away safely
    if (!songID || songID === "") {
        // Changed from "/search-book" to a more generic "/search" or "/songs"
        return res.redirect("/song/allsong"); 
    }

    try {
        // 2. Fetch the song using the correct model and method
        // Using the findBySongId method we defined earlier
        let song = await Song.findBySongId(songID); 
        
        // 3. Handle the case where the ID is valid, but the song doesn't exist
        if (!song) {
            console.log("Did not find a song with ID:", songID);
            // Render the page but pass null so your EJS knows to show a "Not Found" message
            return res.render("song/songDetail", { result: "Not Found" }); 
        }

        // 4. Success!
        console.log("This is the Song I found: " + song.songname);
        res.render("song/songDetail", { result: song }); 

    } catch (error) {
        // 5. Catch real database errors (like network failures)
        console.error(error);
        res.status(500).send("Error reading database"); 
    }
};


const Song = require('../models/songModel'); // Adjust path if needed

// --- ADD SONG ---
exports.renderAddSongForm = (req, res) => {
    res.render("song/addSong"); // Renders the blank form
};

exports.insertSong = async (req, res) => {
    try {
        // req.body contains all the name="..." attributes from your HTML form
        const newSong = new Song({
            song_id: req.body.song_id,
            songname: req.body.songname,
            artist: req.body.artist,
            category: req.body.category,
            description: req.body.description
        });
        
        await newSong.save(); // Save to MongoDB
        res.redirect("/song/allSong"); // Send user back to the list
    } catch (error) {
        console.error(error);
        res.send("Error saving the new song. Make sure the ID is unique!");
    }
};

// --- EDIT SONG ---
exports.renderEditSongForm = async (req, res) => {
    let songID = req.query.songID;
    try {
        let song = await Song.findOne({ song_id: songID });
        if (!song) return res.redirect("/song/allSong");
        
        res.render("song/editSong", { song: song });
    } catch (error) {
        console.error(error);
        res.send("Error loading edit form");
    }
};

exports.updateSong = async (req, res) => {
    try {
        // Find the song by its ID and update it with the new form data in req.body
        await Song.findOneAndUpdate(
            { song_id: req.body.song_id }, 
            req.body, 
            { runValidators: true } // Ensures the schema rules (like min/max) are still checked
        );
        res.redirect("/song/allSong");
    } catch (error) {
        console.error(error);
        res.send("Error updating the song");
    }
};

// --- DELETE SONG ---
exports.deleteSong = async (req, res) => {
    let songID = req.query.songID;
    try {
        await Song.findOneAndDelete({ song_id: songID });
        res.redirect("/song/allSong");
    } catch (error) {
        console.error(error);
        res.send("Error deleting the song");
    }
};