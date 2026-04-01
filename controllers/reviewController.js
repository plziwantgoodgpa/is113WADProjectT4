const reviewModel = require('../model/reviewModel');
const songModel = require('../model/songModel');

exports.addReview = async function (req, res) {
    const song_id = parseInt(req.body.song_id);
    const rating = parseInt(req.body.rating);
    const rawReviewMessage = req.body.reviewMessage;

    let reviewMessage = "";
    let errors = [];

    let user_role = undefined
    let username = undefined
    console.log(req.session.user)
    if (req.session.user !== undefined) {
        user_role = req.session.user.role
        username = req.session.user.username
    }

    if (rawReviewMessage !== undefined) {
        reviewMessage = rawReviewMessage.trim();
    }

    if (username === undefined) {
        errors.push("Please log in before adding a review.");
    }

    if (isNaN(rating)) {
        errors.push("Please select a rating.");
    }

    if (reviewMessage === "") {
        errors.push("Please enter a review message.");
    }

    const song = await songModel.findBySongId(song_id);
    const reviews = await reviewModel.findBySongId(song_id);

    if (errors.length > 0) {
        return res.render('song/songDetail', {
            song: song,
            reviews: reviews,
            user_role: user_role,
            userReview: null,
            averageRating: calculateAverageRating(reviews),
            error: errors.join("<br>"),
            formData: {
                rating: req.body.rating,
                reviewMessage: reviewMessage
            },
            username: username
        });
    }

    const existingReview = await reviewModel.findOneReview(song_id, username);

    if (existingReview) {
        return res.redirect('/song/songDetail?songID=' + song_id);
    }

    await reviewModel.addReview({
        username: username,
        song_id: song_id,
        rating: rating,
        reviewMessage: reviewMessage
    });

    res.redirect('/song/songDetail?songID=' + song_id);
};

exports.editReview = async function (req, res) {
    const song_id = parseInt(req.body.song_id);
    const rawReviewMessage = req.body.reviewMessage;
    const rating = parseInt(req.body.rating);

    let reviewMessage = "";
    let errors = [];
    let user_role = undefined;
    let username = undefined;

    if (req.session.user != undefined) {
        user_role = req.session.user.role;
        username = req.session.user.username;
    }

    if (rawReviewMessage !== undefined) {
        reviewMessage = rawReviewMessage.trim();
    }

    if (!username) {
        errors.push("Please log in before editing a review.");
    }

    if (isNaN(rating)) {
        errors.push("Please select a rating.");
    }

    if (reviewMessage === "") {
        errors.push("Please enter a review message.");
    }

    const song = await songModel.findBySongId(song_id);
    const reviews = await reviewModel.findBySongId(song_id);
    const userReview = await reviewModel.findOneReview(song_id, req.session.username);

    if (errors.length > 0) {
        return res.render('song/songDetail', {
            song: song,
            reviews: reviews,
            userReview: userReview,
            averageRating: calculateAverageRating(reviews),
            error: errors.join("<br>"),
            formData: {
                rating: req.body.rating,
                reviewMessage: reviewMessage
            },
            username: username
        });
    }

    await reviewModel.editReview(song_id, username, {
        rating: rating,
        reviewMessage: reviewMessage,
        review_date_time: new Date()
    });

    res.redirect('/song/songDetail?songID=' + song_id);
};

exports.deleteReview = async function (req, res) {
    const song_id = parseInt(req.body.song_id);

    if (req.session.user != undefined) {
        user_role = req.session.user.role;
        username = req.session.user.username;
    }

    if (!username) {
        return res.redirect('/song/songDetail?songID=' + song_id);
    }

    await reviewModel.deleteReview(song_id, username);

    res.redirect('/song/songDetail?songID=' + song_id);
    console.log("review deleted")
};

function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) {
        return 0;
    }

    let total = 0;
    for (let review of reviews) {
        total += review.rating;
    }

    return total / reviews.length;
}

exports.deleteReviewByAdmin = async (req, res) => {
    try {
        const username = req.body.username;
        const song_id = req.body.song_id;
        await reviewModel.deleteReview(song_id, username);
        res.redirect('/song/songDetail?songID=' + song_id);
    } catch (err) {
        console.error("Error deleting review:", err);
        res.send("An error occurred while deleting the review.");
    }
};