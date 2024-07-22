const express = require('express');

const router = express.Router();
//this is a dummy places, later on we will fetch this data from backend
//but for now, we have this dummy place, and now we will GET this place using its id
const DUMMY_PLACES = [
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
//this route will only run, when the route set in the app.js runs
//it works like this
//'/api/places/'/'' 
//the last slash gives the route defined below
router.get('/:pid', (req, res, next) => {
//so now, our goal is to get the pid from the url using params,
//and then search the dummy places array for thatg particular pid we want,
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find((p) => {
        return p.id === placeId;
    })
    if(!place){
        const error = new Error('could not find a place for the provided id');
        error.code = 404;
        throw error;
    }
    else{
    res.json({place}); //{place: place}
    }
})



router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;
    const User = DUMMY_PLACES.find(place => {
        return place.creator === userId;
    })
    if(!User){
        const error = new Error('could not find a place for the provided user id');
        error.code = 404;
        return next(error);
    }
    else{
        res.json({User}); //{place: place}
    }
    
})

module.exports = router;