const express = require('express');
const placesControllers = require('../controllers/places-controllers');
const HttpError = require('../models/http-error');
const router = express.Router();
//this is a dummy places, later on we will fetch this data from backend
//but for now, we have this dummy place, and now we will GET this place using its id

//this route will only run, when the route set in the app.js runs
//it works like this
//'/api/places/'/'' 
//the last slash gives the route defined below
router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPLacesByUserId);

router.post('/', placesControllers.createPlace);

router.patch('/:pid', placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;