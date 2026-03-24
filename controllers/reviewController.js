const reviewModel = require('../model/reviewModel');
const songModel = require('../model/songModel');

exports.addReview = async function(req, res) {
    const song_id = parseInt(req.body.song_id);
    const rawReviewMessage = req.body.reviewMessage;
    const rating = parseInt(req.body.rating);

    let reviewMessage = "";
    let errors = [];

    if (rawReviewMessage !== undefined) {
        reviewMessage = rawReviewMessage.trim();
    }

    if (!req.session.user_id) {
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
            userReview: null,
            averageRating: calculateAverageRating(reviews),
            error: errors.join("<br>"),
            formData: {
                rating: req.body.rating,
                reviewMessage: reviewMessage
            },
            user_id: req.session.user_id || null
        });
    }

    const existingReview = await reviewModel.findOneReview(song_id, req.session.user_id);

    if (existingReview) {
        return res.redirect('/song/songDetail?songID=' + song_id);
    }

    await reviewModel.addReview({
        user_id: req.session.user_id,
        song_id: song_id,
        rating: rating,
        reviewMessage: reviewMessage
    });

    res.redirect('/song/songDetail?songID=' + song_id);
};

exports.editReview = async function(req, res) {
    const song_id = parseInt(req.body.song_id);
    const rawReviewMessage = req.body.reviewMessage;
    const rating = parseInt(req.body.rating);

    let reviewMessage = "";
    let errors = [];

    if (rawReviewMessage !== undefined) {
        reviewMessage = rawReviewMessage.trim();
    }

    if (!req.session.user_id) {
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
    const userReview = await reviewModel.findOneReview(song_id, req.session.user_id);

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
            user_id: req.session.user_id || null
        });
    }

    await reviewModel.editReview(song_id, req.session.user_id, {
        rating: rating,
        reviewMessage: reviewMessage,
        review_date_time: new Date()
    });

    res.redirect('/song/songDetail?songID=' + song_id);
};

exports.deleteReview = async function(req, res) {
    const song_id = parseInt(req.body.song_id);

    if (!req.session.user_id) {
        return res.redirect('/song/songDetail?songID=' + song_id);
    }

    await reviewModel.deleteReview(song_id, req.session.user_id);

    res.redirect('/song/songDetail?songID=' + song_id);
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