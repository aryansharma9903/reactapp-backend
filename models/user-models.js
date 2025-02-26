const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        //we need to ensure the email id is not present already
        //it cannot be set by using unique, instead we require a third party package
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    image: {
        type: String,
        required: true
    },
    //here a user can have multiple places with multiple place id's 
    //so we create an array of all the places
    places: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Place'
    }]
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);