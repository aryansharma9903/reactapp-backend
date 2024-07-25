const HttpError = require('../models/http-error');
const uuid = require('uuid');
const { validationResult } = require('express-validator')
const getCoord = require('../utils/location')
//but the router logic is written seperately in controllers
//so we will cut the logic written there and paste it here for each route.\
let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'empire state building',
        description: 'fausv',
        location: {
            lat:40.7484992, 
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
            lat:40.7484992, 
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
            lat:40.7484992, 
            lng: -73.9856387
        },
        address: 'nibvwejnbcvowenvo',
        creator: 'u1'
    }
]

const getPlaceById = ( (req, res, next) => {
    //so now, our goal is to get the pid from the url using params,
    //and then search the dummy places array for thatg particular pid we want,
        const placeId = req.params.pid;
        const place = DUMMY_PLACES.find((p) => {
            return p.id === placeId;
        })
        if(!place){
           throw new HttpError('could not find a place for the provided id', 404);
        }
        else{
        res.json({place}); //{place: place}
        }
    })


const getPLacesByUserId =  (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(place => {
        return place.creator === userId;
    })
    if(!places || places.length === 0){
     return next (new HttpError('could not find a places for the provided user id', 404));
    }
    else{
        res.json({places}); //{place: place}
    }
    
}

//for a get request, we were extracting data from the url using params
//but for post request, we will extract data from body;
//and to get data out of body we use body-parser
const createPlace = async (req, res, next) => {
//here we have not implemented the input validators, whether the field exist or not
//like we getting input with empty fields in title
//so prevent this we can write our own logic to handle such cases and pass errors for rmpty fields
//like if(title.trim().length === 0) -> if title does not exist
//but this becomes cumbersome to execute for each value
//instead we use a third party library
//express-validators
const errors = validationResult(req);
if(!errors.isEmpty()){
    console.log(errors);
    //while working with async code nbtter to use next rather than throw
    return next (new HttpError('Invalid inputs passed, pls check ur data', 422));
}
    const { title, description, address, creator } = req.body;
    let coordinates;
    try{
    coordinates = await getCoord(address);
    } catch(error) {
        return next(error);
    }
    const createdPlace = {
        //importing uuid package for giving unique id's
        //id: uuid(),
        title,
        description,
        //here we dont want to input the coordinates from the user
        //but we need to convert the address input by user to coordinates
        //using a REST API provided by google.
        location: coordinates,
        address,
        creator
    };

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({createdPlace});
}

const updatePlace = (req, res, next) => {
const errors = validationResult(req);
if(!errors.isEmpty()){
    console.log(errors);
    throw new HttpError('Invalid inputs passed, pls check ur data', 422);
}
    const placeId = req.params.pid;
    const updatedPlace = DUMMY_PLACES.find((place) => {
        return place.id === placeId;
    })
    if(!updatePlace){
        throw new HttpError('could not find a place for the provided id', 404);
    }
    else{
        const { title, description } = req.body;
        updatedPlace.title = title;
        updatedPlace.description = description;
        res.status(200).json({place: updatedPlace});
    }
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if(!DUMMY_PLACES.find(p => p.id === placeId)){
        throw new HttpError('Could not find a place for that id', 404);
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
    res.status(200).json({message: 'Deleted Place'});
}
 
exports.getPlaceById = getPlaceById;
exports.getPLacesByUserId = getPLacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;