const HttpError = require('../models/http-error');
const uuid = require('uuid');
const { validationResult } = require('express-validator')
const getCoord = require('../utils/location')
const Place = require('../models/place-models')
    //but the router logic is written seperately in controllers
    //so we will cut the logic written there and paste it here for each route.\
let DUMMY_PLACES = [{
        id: 'p1',
        title: 'empire state building',
        description: 'fausv',
        location: {
            lat: 40.7484992,
            lng: -73.9856387
        },
        address: 'nibvwejnbcvowenvo',
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'empire state building',
        description: 'fausv',
        location: {
            lat: 40.7484992,
            lng: -73.9856387
        },
        address: 'nibvwejnbcvowenvo',
        creator: 'u2'
    },
    {
        id: 'p3',
        title: 'empire state building',
        description: 'fausv',
        location: {
            lat: 40.7484992,
            lng: -73.9856387
        },
        address: 'nibvwejnbcvowenvo',
        creator: 'u1'
    }
]

const getPlaceById = async(req, res, next) => {
    //so now, our goal is to get the pid from the url using params,
    //and then search the dummy places array for thatg particular pid we want,
    const placeId = req.params.pid;
    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('something went wrong, couldnt get place id', 500);
        return next(error);
    }
    if (!place) {
        const error = new HttpError('could not find a place for the provided id', 404);
        return next(error);
    }
    res.json({ place: place.toObject({ getters: true }) }); //{place: place}
}


const getPLacesByUserId = async(req, res, next) => {
    const userId = req.params.uid;
    let places;

    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        const error = new HttpError('something went wrong while getting places, pls try again', 500);
        return next(error);
    }
    if (!places) {
        return next(new HttpError('could not find a places for the provided user id', 404));
    }
    //.find methods returns an array, so we cant use .toObject methods directly
    //we use array.map
    res.json({ places: places.map(place => place.toObject({ getters: true })) }); //{place: place}
}

//for a get request, we were extracting data from the url using params
//but for post request, we will extract data from body;
//and to get data out of body we use body-parser
const createPlace = async(req, res, next) => {
    //here we have not implemented the input validators, whether the field exist or not
    //like we getting input with empty fields in title
    //so prevent this we can write our own logic to handle such cases and pass errors for rmpty fields
    //like if(title.trim().length === 0) -> if title does not exist
    //but this becomes cumbersome to execute for each value
    //instead we use a third party library
    //express-validators
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        //while working with async code nbtter to use next rather than throw
        return next(new HttpError('Invalid inputs passed, pls check ur data', 422));
    }
    const { title, description, address, creator } = req.body;
    let coordinates;
    try {
        coordinates = await getCoord(address);
    } catch (error) {
        return next(error);
    }
    const createdPlace = new Place({
        //importing uuid package for giving unique id's
        //id: uuid(),
        title,
        description,
        address,
        //here we dont want to input the coordinates from the user
        //but we need to convert the address input by user to coordinates
        //using a REST API provided by google.
        location: coordinates,
        image: 'https://media.timeout.com/images/101705309/image.jpg',
        creator
    });

    try {
        await createdPlace.save()
    } catch (err) {
        const error = new HttpError('creating a place failed, pls try again', 500);
        return next(error);
    }

    res.status(201).json({ place: createdPlace });
}



const updatePlace = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs passed, pls check ur data', 422));
    }
    const placeId = req.params.pid;

    let place
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('something went wrong, couldnt get place', 500);
        return next(error);
    }
    if (!place) {
        throw new HttpError('could not find a place for the provided id', 404);
    }
    const { title, description } = req.body;
    place.title = title;
    place.description = description;
    try {
        await place.save()
    } catch (err) {
        const error = new HttpError('something went wrong, couldnt update place', 500)
    }
    res.status(200).json({ place: place.toObject({ getters: true }) });
}

const deletePlace = async(req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
        if (!place) {
            const error = new HttpError('no place found with this id', 400);
            return next(error);
        }
    } catch (err) {
        const error = new HttpError('something went wrong, couldnt get place with this id', 500);
        return next(error);
    }
    try {
        await place.deleteOne({ _id: placeId });
    } catch (err) {
        const error = new HttpError('couldnt delete this place', 500);
        return next(error);
    }
    res.status(200).json({ message: 'Deleted Place' });
}

exports.getPlaceById = getPlaceById;
exports.getPLacesByUserId = getPLacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;