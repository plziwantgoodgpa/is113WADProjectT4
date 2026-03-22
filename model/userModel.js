const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: [true, 'A user must have a user_id'],
        unique: true
    },
    pwd: {
        type: String,
        required: [true, 'A user must have a password']
    },
    username: {
        type: String,
        required: [true, 'A user must have a username']
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true
    },
    user_role: {
        type: String,
        required: [true, 'A user must have a role'],
        enum: ['user', 'admin'], 
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema, 'User');

// Methods
exports.retrieveAll = function() {
    return User.find();
};

exports.findByUserId = function(user_id) {
    return User.findOne({ user_id: user_id });
};
