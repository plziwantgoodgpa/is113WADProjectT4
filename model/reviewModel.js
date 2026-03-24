const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: [true, 'A review must have a user_id']
    },
    song_id: {
        type: Number,
        required: [true, 'A review must have a song_id']
    },
    rating: {
        type: Number,
        required: [true, 'A review must have a rating'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    reviewMessage: {
        type: String,
        required: [true, 'A review must have a message']
    },
    review_date_time: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema, 'Review');

exports.retrieveAll = function() {
    return Review.find();
};

exports.findBySongId = function(song_id) {
    return Review.find({ song_id: song_id });
};

exports.findOneReview = function(song_id, user_id) {
    return Review.findOne({ song_id: song_id, user_id: user_id });
};

exports.addReview = function(reviewData) {
    return Review.create(reviewData);
};

exports.editReview = function(song_id, user_id, updatedData) {
    return Review.updateOne(
        { song_id: song_id, user_id: user_id },
        updatedData
    );
};

exports.deleteReview = function(song_id, user_id) {
    return Review.deleteOne({ song_id: song_id, user_id: user_id });
};