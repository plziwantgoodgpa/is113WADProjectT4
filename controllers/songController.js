const songs = [{
    song_id : 1,
    songName: "Song1",
    artist: "me",
    category: "test",
    description: "for test only"
},
{
    song_id : 2,
    songName: "Song2",
    artist: "me2",
    category: "test2",
    description: "for test2 only"
}
]
const userRole ="admin"
// 1. Import the Song model
const Song = require('../model/songModel');

// 2. Create and export the "Retrieve All" function
exports.getAllSongs = async (req, res) => {
    try {
        // THE FORMULA: .find() with no arguments returns everything in the collection
        // const songs = await Song.retrieveAll(); 
        console.log(songs)
        // Send a successful response back to the client
        res.render("song/allSong",{songs,userRole})

    } catch (error) {
        // If something goes wrong (e.g., database is down), catch the error
        console.error(error);
        res.send("Error reading database show songs")
    }
};

exports.getSongBySongID = async (req, res) => {
    let songID = req.query.songID
    console.log(`This is song_id ${songID}`)

    // 1. If the user didn't provide an ID in the URL, redirect them away safely
    if (!songID || songID === "") {
        // console.log(`This is song_id ${songID}`)
        // return res.redirect("/song/allsong"); 
    }

    try {
        // 2. Fetch the song using the correct model and method
        // Using the findBySongId method we defined earlier
        // let song = await Song.findBySongId(songID); 
        let song = songs[songID-1]
        console.log(song)
        // 3. Handle the case where the ID is valid, but the song doesn't exist
        if (!song) {
            console.log("Did not find a song with ID:", songID);
            // Render the page but pass null so your EJS knows to show a "Not Found" message
            return res.render("song/songDetail", { result: "Not Found" ,userRole:userRole}); 
        }

        // 4. Success!
        console.log("This is the Song I found: " + song.songName);
        res.render("song/songDetail", { result: song ,userRole:userRole}); 

    } catch (error) {
        // 5. Catch real database errors (like network failures)
        console.error(error);
        res.status(500).send("Error reading database"); 
    }
};


// --- ADD SONG ---
exports.showAddSongForm = (req, res) => {
    res.render("song/addSong"); // Renders the blank form
};


// --- ADD SONG CONTROLLER ---
exports.insertSong = async (req, res) => {
    let song = req.body
    console.log(song)
    try {
        // req.body contains all the data typed into your HTML form
        await SongModel.addSong(song); 
        res.redirect("/song/allSong");
    } catch (error) {
        console.error(error);
        res.send("Error saving the new song. Make sure the ID is unique!");
    }
};

// --- EDIT SONG CONTROLLER ---
exports.showEditSongForm = async (req, res) => {
    // 1. Grab the songID from the URL (e.g., /song/editSong?songID=101)
    let songID = req.query.songID;

    // 2. Safety check: If there's no ID in the URL, send them back to the list
    if (!songID) {
        return res.redirect("/song/allSong");
    }

    try {
        // 3. Use your custom model method to find the specific song
        // let song = await SongModel.findBySongId(songID);
        let song = songs[songID-1]
        // 4. If someone typed in a fake ID that isn't in the database
        if (!song) {
            console.log("Could not find song ID to edit:", songID);
            return res.redirect("/song/allSong");
        }
        
        // 5. Success! Render the edit page and pass the 'song' object to EJS
        res.render("song/editSong", { song: song });

    } catch (error) {
        console.error("Error loading the edit form:", error);
        res.status(500).send("Error loading edit page");
    }
};

exports.updateSong = async (req, res) => {
    try {
        // req.body.song_id tells it WHICH song to update
        // req.body contains the newly updated text
        await SongModel.editSong(req.body.song_id, req.body);
        res.redirect("/song/allSong");
    } catch (error) {
        console.error(error);
        res.send("Error updating the song");
    }
};

// --- DELETE SONG CONTROLLER ---
exports.deleteSong = async (req, res) => {
    let songID = req.query.songID; // Gets the ID from the URL (e.g., ?songID=101)
    try {
        await SongModel.deleteSong(songID);
        res.redirect("/song/allSong");
    } catch (error) {
        console.error(error);
        res.send("Error deleting the song");
    }
};