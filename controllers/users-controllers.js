//const uuid = require('uuid');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator')
const DUMMY_USERS = [{
    id: 'u1',
    name: 'Aryan Sharma',
    email: 'test@test.com',
    password: 'test',
    image: 'https://prodigits.co.uk/thumbs/wallpapers/p2ls/nature/26/9cde356812490450.jpg',
    places: '3'
}]


const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
}

const signupUser = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        throw new HttpError('the inputs are not desired, pls check your inputs', 422);
    }
    const { name, email, password } = req.body;
    const User = DUMMY_USERS.find((user) => {
        return user.email === email;
    })
    if (User) {
        throw new HttpError('there is already a user with this email', 422);
    } else {
        const newUser = {
            name: name,
            email: email,
            password: password
        }
        DUMMY_USERS.push(newUser);
        res.status(201).json({ user: User })
    }
}
const loginUser = (req, res, next) => {
    const { email, password } = req.body;
    const identifiedUser = DUMMY_USERS.find((user) => {
        return user.email === email
    })
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('could not identify user, credentials seems to be wrong', 401);
    }
    res.json({ message: 'LoggedIN' });

}

exports.getUsers = getUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;