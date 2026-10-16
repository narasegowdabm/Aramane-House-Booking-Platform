const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true,"first Name is required!"]
    },
    lastName: {
        type: String,
        required: [true,"last Name is required!"]
    },
    email: {
        type: String,
        required: [true,"Email is required!"],
        unique: true
    },
    Password: {
        type: String,
        required: [true,"Password is required!"],
    },
    userType: {
        type: String,
        enum: ['guest','host'],
        default: 'guest'
    },
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Home'
    }]
});

module.exports = mongoose.model('User', userSchema);