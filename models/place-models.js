const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    creator: {
        // we want this creator to have a mongodb id
        //and also we want a connection b/w creator and place
        //so we use ref
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = mongoose.model('Place', placeSchema);