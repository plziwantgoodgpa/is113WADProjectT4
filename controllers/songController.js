// 1. Import the Song model
const SongModel = require('../model/songModel');
const ReviewModel = require('../model/reviewModel');
const CategoryModel = require('../model/categoryModel')

exports.getAllSongs = async (req, res) => {
    let user_role = undefined
    let username = undefined
    let sortOption = req.query.sort || 'songname';
    if (req.session.user != undefined) {
        user_role = req.session.user.role
        username = req.session.user.username
    }
    try {
        let songs = await SongModel.retrieveAll();
        // console.log(songs)
        for (i = 0; i < songs.length; i++) {
            let currentSong = songs[i]
            let reviews = await ReviewModel.findBySongId(currentSong.song_id);
            let averageRating = 0
            if (reviews.length > 0) {
                let total = 0;
                for (let review of reviews) {
                    total += review.rating;
                }
                averageRating = total / reviews.length;
            }
            songs[i].averageRating = averageRating
        }

        if (sortOption === 'rating') {
            // Sort by average rating (Highest to Lowest)
            songs.sort((a, b) => b.averageRating - a.averageRating);

        } else if (sortOption === 'artist') {
            // Sort by Artist Name (A to Z) using localeCompare for strings
            songs.sort((a, b) => a.artist.localeCompare(b.artist));

        } else {
            // Default: Sort by Song Name (A to Z)
            songs.sort((a, b) => a.songname.localeCompare(b.songname));
        }

        for (i = 0; i < songs.length; i++) {
            if (songs[i].averageRating == 0) {
                songs[i].averageRating = "No ratings yet"
            }
        }
        // Send a successful response back to the client
        res.render("song/allSong", { songs, user_role, username, currentSort: sortOption })

    } catch (error) {
        // If something goes wrong (e.g., database is down), catch the error
        console.error(error);
        res.send("Error reading database show songs")
    }
};


exports.songDetail = async function (req, res) {
    const songID = parseInt(req.query.songID);

    await SongModel.incrementViewCount(songID);

    const song = await SongModel.findBySongId(songID);
    const reviews = await ReviewModel.findBySongId(songID);

    let user_role = undefined;
    let username = undefined;

    if (req.session.user != undefined) {
        user_role = req.session.user.role;
        username = req.session.user.username;
    }

    let userReview = null;
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

    res.render("song/songDetail", {
        song: song,
        reviews: reviews,
        username: username,
        userRole: user_role,
        userReview: userReview,
        averageRating: averageRating,
        error: "",
        formData: {
            rating: "",
            reviewMessage: ""
        }
    });
};


// --- ADD SONG ---
exports.showAddSongForm = async (req, res) => {
    let user_role = undefined;
    let username = undefined;

    if (req.session.user != undefined) {
        user_role = req.session.user.role;
        username = req.session.user.username;
    }

    // SECURITY CHECK: Kick out anyone who isn't an admin
    if (user_role !== "admin") {
        // This sends a popup alert to the browser, then redirects them to the library
        return res.send('<script>alert("Access Denied: You do not have permission to view this page."); window.location.href="/song/allSong";</script>');
    }

    // Only admins will get past the code above!
    let categories = await CategoryModel.retrieveAll();

    res.render("song/addSong", {
        user_role: user_role,
        categories: categories,
        username: username
    });
};


// --- ADD SONG CONTROLLER ---
exports.insertSong = async (req, res) => {
    try {
        // 1. Extract all the pieces from the submitted form
        const { songname, artist, categoryData, description } = req.body;

        // 2. Split the "ID|Name" string into two separate variables
        const [category_id, category_name] = categoryData.split('|');

        // 3. Construct a clean song object perfectly formatted for your database
        const newSong = {
            songname: songname,
            artist: artist,
            category_id: category_id, // Storing the ID for database relationships
            category: category_name,  // Storing the Name for easy displaying
            description: description
        };

        console.log("Song to be inserted: ", newSong);

        // 4. Send the clean object to your model to be saved
        await SongModel.addSong(newSong);

        // 5. Redirect the user back to the library so they can see their new song!
        res.redirect("/song/allSong");

    } catch (error) {
        console.error("Error inserting song:", error);
        res.send("Error saving the new song. Please make sure all fields are filled out correctly!");
    }
};

// --- EDIT SONG CONTROLLER ---
exports.showEditSongForm = async (req, res) => {
    let songID = req.query.songID;
    let user_role = undefined;
    let username = undefined;

    if (req.session.user != undefined) {
        user_role = req.session.user.role;
        username = req.session.user.username;
    }

    // SECURITY CHECK: Kick out anyone who isn't an admin
    if (user_role !== "admin") {
        // This sends a popup alert to the browser, then redirects them to the library
        return res.send('<script>alert("Access Denied: You do not have permission to view this page."); window.location.href="/song/allSong";</script>');
    }

    if (!songID) {
        return res.redirect("/song/allSong");
    }

    try {
        let song = await SongModel.findBySongId(songID);

        if (!song) {
            console.log("Could not find song ID to edit:", songID);
            return res.redirect("/song/allSong");
        }

        // NEW: Fetch all categories so we can populate the dropdown menu
        let categories = await CategoryModel.retrieveAll();

        // Pass BOTH the specific song and the list of categories to EJS
        res.render("song/editSong", {
            song: song,
            categories: categories,
            username: username
        });

    } catch (error) {
        console.error("Error loading the edit form:", error);
        res.status(500).send("Error loading edit page");
    }
};

exports.updateSong = async (req, res) => {
    try {
        // 1. Extract all the pieces from the submitted form
        const { song_id, songname, artist, categoryData, description } = req.body;

        // 2. Split the "ID|Name" string from the dropdown
        const [category_id, category_name] = categoryData.split('|');

        // 3. Construct a clean, updated song object
        const updatedSongData = {
            songname: songname,
            artist: artist,
            category_id: category_id,
            category: category_name,
            description: description
        };

        // 4. Send the ID and the new object to your model to execute the update
        await SongModel.editSong(song_id, updatedSongData);

        // 5. Redirect back to the library
        res.redirect(`/song/songDetail?songID=${song_id}`);

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
    let user_role = undefined;
    let username = undefined;

    if (req.session.user != undefined) {
        user_role = req.session.user.role;
        username = req.session.user.username;
    }
    try {
        let songs = [];
        // If the user actually typed something, run the search
        if (searchTerm) {
            songs = await SongModel.searchSongs(searchTerm);
        }

        for (i = 0; i < songs.length; i++) {
            let currentSong = songs[i]
            let reviews = await ReviewModel.findBySongId(currentSong.song_id);
            let averageRating = 0
            if (reviews.length > 0) {
                let total = 0;
                for (let review of reviews) {
                    total += review.rating;
                }
                averageRating = total / reviews.length;
            }
            songs[i].averageRating = averageRating
        }
        for (i = 0; i < songs.length; i++) {
            if (songs[i].averageRating == 0) {
                songs[i].averageRating = "No ratings yet"
            }
        }
        // console.log("search result for "+songs)
        // console.log("This is the searchTerm for song "+searchTerm)
        // Send BOTH the songs array and the search term back to the page
        res.render("song/searchResult", { songs: songs, searchTerm: searchTerm, username: username, });

    } catch (error) {
        console.error("Search error:", error);
        res.status(500).send("Error performing search");
    }
};

// VIEWS 


exports.getPopularSongs = async (req, res) => {
    let user_role = undefined;
    let username = undefined;

    if (req.session.user != undefined) {
        user_role = req.session.user.role;
        username = req.session.user.username;
    }

    try {
        let songs = await SongModel.getPopularSongs();

        for (i = 0; i < songs.length; i++) {
            let currentSong = songs[i];
            let reviews = await ReviewModel.findBySongId(currentSong.song_id);
            let averageRating = 0;

            if (reviews.length > 0) {
                let total = 0;
                for (let review of reviews) {
                    total += review.rating;
                }
                averageRating = total / reviews.length;
            }

            songs[i].averageRating = averageRating;
        }

        for (i = 0; i < songs.length; i++) {
            if (songs[i].averageRating == 0) {
                songs[i].averageRating = "No ratings yet";
            }
        }

        res.render("song/popularSong", { songs, user_role, username });

    } catch (error) {
        console.error(error);
        res.send("Error loading popular songs");
    }
};



