const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
    view_id: {
        type: Number,
        required: [true, 'A view must have a view_id'],
        unique
    },
    username: {
        type: String,
        required: [true, 'A view must have a username']
    },
    view_date_time: {
        type: Date,
        default: Date.now,
        required: [true, 'A view must have a view_date_time']
    },
    song_id: {
        type: Number,
        required: [true, 'A view must have a song_id'],
    }
});
// view_id make it auto increment