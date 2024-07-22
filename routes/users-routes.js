const express = require('express');
const usersControllers = require('../controllers/users-controllers');
const router = express.Router();



router.get('/', usersControllers.getUsers);

router.post('/signup',usersControllers.signupUser);

router.post('/login', usersControllers.loginUser);


 module.exports = router;