const express = require('express');
const placesControllers = require('../controllers/places-controllers');
const HttpError = require('../models/http-error');
const router = express.Router();
const { check } = require('express-validator');
//this is a dummy places, later on we will fetch this data from backend
//but for now, we have this dummy place, and now we will GET this place using its id

//this route will only run, when the route set in the app.js runs
//it works like this
//'/api/places/'/'' 
//the last slash gives the route defined below
router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPLacesByUserId);

router.post('/', [check('title')
        .not()
        .isEmpty(),
        check('description')
        .isLength({ min: 5 }),
        check('address')
        .not()
        .isEmpty()
    ],
    placesControllers.createPlace);
//the aboev and below routes are where i need to use express validators
//express validators act as a middleware before calling the controller function
router.patch('/:pid', [check('title')
    .not()
    .isEmpty(),
    check('description')
    .isLength({ min: 5 }),
], placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;