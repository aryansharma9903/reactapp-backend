//const uuid = require('uuid');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user-models');
const mongoose = require('mongoose');
const DUMMY_USERS = [{
    id: 'u1',
    name: 'Aryan Sharma',
    email: 'test@test.com',
    password: 'test',
    image: 'https://prodigits.co.uk/thumbs/wallpapers/p2ls/nature/26/9cde356812490450.jpg',
    places: '3'
}]


const getUsers = async(req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError('something went wrong while fetching users', 500);
        return next(error);
    }
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
}

const signupUser = async(req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new HttpError('the inputs are not desired, pls check your inputs', 422));
    }
    const { name, email, password } = req.body;
    let user;
    try {
        user = await User.findOne({ email: email });
        if (user) {
            const error = new HttpError('User already exists, try logging in instead', 422);
            return next(error);
        }
    } catch (err) {
        const error = new HttpError('something went wrong, couldnt signup', 500);
        return next(error);
    }
    const createdUser = new User({
        name,
        email,
        //we will encrypt the password later
        password,
        image: 'https://imgs.search.brave.com/cGNYtp-d8x2TiS8-xwcE9IGRawywkHPDRRbpP7faKFg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA3LzUyLzEzLzM3/LzM2MF9GXzc1MjEz/MzcyOV9kejRHWURr/YUtaNnZSQ05hZFQ1/UHoyRUJlNDNTaFJv/cy5qcGc',
        places: []
    })
    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('creating a user failed, try again later', 500);
        return next(error);
    }
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
}

const loginUser = async(req, res, next) => {
    const { email, password } = req.body;
    let identifiedUser;
    try {
        identifiedUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('something went wrong, pls try again later', 500);
        return next(error);
    }
    if (!identifiedUser || identifiedUser.password !== password) {
        const error = new HttpError('invalid login credentials or user does not exist', 401);
        return next(error);
    }

    res.json({ message: 'LoggedIN' });

}

exports.getUsers = getUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;