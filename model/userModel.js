const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    pwd: {
        type: String,
        required: [true, 'A user must have a password']
    },
    username: {
        type: String,
        required: [true, 'A user must have a username'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true
    },
    bio: {
    type: String,
    default: ''
    },
    user_role: {
        type: String,
        required: [true, 'A user must have a role'],
        enum: ['user', 'admin'], 
        default: 'user'
    }
    // bio:{
    //      type: String,
    //      default: 'no bio'
    // }
});

const User = mongoose.model('User', userSchema, 'User');

// Methods
exports.retrieveAll = function() {
    return User.find();
};

exports.findUser = function(username) {
    return User.findOne({ username : username });
};

// add this to userModel.js
exports.addUser = function(userData) {
    return User.create(userData);
};

exports.updateUserProfile = function(username, updatedData) {
    return User.findOneAndUpdate(
        { username: username },
        { $set: { bio: updatedData.bio } },
        { returnDocument: 'after', runValidators: true }
    );
};
