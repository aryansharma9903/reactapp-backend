const axios = require('axios');
const HttpError = require('../models/http-error');
const API_KEY = 'AIzaSyDp6Qh5FXn9aySrDyRgVk19jVdk9f98WiQ';

//we will write a function which takes an address, reaches out to googles api
//and converts this address to coordinates

async function getCoord(address) {
    //we need to get rid of special char and white spaces from the address
    // for that we use encodeURIComponent
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}
        &key=${API_KEY}`);

    const data = response.data;
    if(!data || data.status === 'ZERO_RESULTS'){
        const error = HttpError('could not find location for this address', 422);
        throw error;
    }
    const coordinates = data.results[0].geometry.location;
    return coordinates;
}

module.exports = getCoord;