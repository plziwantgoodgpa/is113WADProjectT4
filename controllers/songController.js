// 1. Import the Song model
const SongModel = require('../model/songModel');
const ReviewModel = require('../model/reviewModel');

// 2. Create and export the "Retrieve All" function
exports.getAllSongs = async (req, res) => {
    let user_role = undefined
    let username = undefined
    if (req.session.user != undefined) {
        user_role = req.session.user.role
        username = req.session.user.username
    }
    try {
        // THE FORMULA: .find() with no arguments returns everything in the collection
        let songs = await SongModel.retrieveAll();
        console.log(songs)
        // Send a successful response back to the client
        res.render("song/allSong", { songs, user_role })

    } catch (error) {
        // If something goes wrong (e.g., database is down), catch the error
        console.error(error);
        res.send("Error reading database show songs")
    }
};

// exports.getSongBySongID = async (req, res) => {
//     let songID = req.query.songID
//     console.log(`This is song_id ${songID}`)

//     // 1. If the user didn't provide an ID in the URL, redirect them away safely
//     if (!songID || songID === "") {
//         // console.log(`This is song_id ${songID}`)
//         // return res.redirect("/song/allsong"); 
//     }

//     try {
//         // 2. Fetch the song using the correct model and method
//         // Using the findBySongId method we defined earlier
//         let song = await SongModel.findBySongId(songID); 
//         console.log(song)
//         // 3. Handle the case where the ID is valid, but the song doesn't exist
//         if (!song) {
//             console.log("Did not find a song with ID:", songID);
//             // Render the page but pass null so your EJS knows to show a "Not Found" message
//             return res.render("song/songDetail", { song: "Not Found" ,userRole:userRole}); 
//         }

//         // 4. Success!
//         console.log("This is the Song I found: " + song.songname);
//         res.render("song/songDetail", { song: song ,userRole:userRole}); 

//     } catch (error) {
//         // 5. Catch real database errors (like network failures)
//         console.error(error);
//         res.status(500).send("Error reading database"); 
//     }
// };


exports.songDetail = async function (req, res) {
    const songID = parseInt(req.query.songID);

    const song = await SongModel.findBySongId(songID);
    const reviews = await ReviewModel.findBySongId(songID);
    let user_role = undefined
    let username = undefined
    if (req.session.user != undefined) {
        user_role = req.session.user.role
        username = req.session.user.username
    }

    let userReview = null;
    console.log(username)
    if (username) {
        userReview = await ReviewModel.findOneReview(songID, username);
    }

    let averageRating = 0;
    if (reviews.length > 0) {
        let total = 0;
        for (let review of reviews) {
            total += review.rating;
        }
        averageRating = total / reviews.length;
    }

    res.render('song/songDetail', {
        song: song,
        reviews: reviews,
        userRole: user_role,
        userReview: userReview,
        averageRating: averageRating,
        error: "",
        formData: {
            rating: "",
            reviewMessage: ""
        },
        username: username
    });
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
        let song = await SongModel.findBySongId(songID);
        // let song = songs[songID-1]
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

//search song
// --- SEARCH SONGS ---
exports.searchSongs = async (req, res) => {
    // We use 'q' for query, which will come from our search form input
    let searchTerm = req.query.searchTerm;

    try {
        let songs = [];

        // If the user actually typed something, run the search
        if (searchTerm) {
            songs = await SongModel.searchSongs(searchTerm);
        }
        console.log(songs)
        console.log(searchTerm)
        // Send BOTH the songs array and the search term back to the page
        res.render("song/searchResult", { songs: songs, searchTerm: searchTerm });

    } catch (error) {
        console.error("Search error:", error);
        res.status(500).send("Error performing search");
    }
};


// -- ADDED THIS SECTION FOR REVIEWS!!! TRIALLL ----//////

// const songModel = require('../model/songModel');

// exports.retrieveAllSongs = async function(req, res) {
//     const songs = await songModel.retrieveAll();

//     res.render('song/allSong', {
//         songs: songs,
//         userRole: req.session.userRole
//     });
// };

