const express = require('express');
const usersControllers = require('../controllers/users-controllers');
const router = express.Router();
const { check } = require('express-validator');


router.get('/', usersControllers.getUsers);

router.post('/signup', 
    [check('name')
        .not()
        .isEmpty(),
    check('email')
    //ANOTHER FIELD THAT IS NORMALISE EMAIL NEEDS TO BE CALLED, WHICH MAKES CAPS TO SMALL.
        .normalizeEmail()
        .isEmail(),
    check('password')
        .isLength({min: 6})
    ]
    ,
    usersControllers.signupUser);
//here we need to implement express validation
router.post('/login', usersControllers.loginUser);


 module.exports = router;