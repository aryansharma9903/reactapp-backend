const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error')
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const mongoose = require('mongoose');
//this is basically a middleware now, which we can call in the app.use method

const app = express();
app.use(bodyParser.json());

//app.use('/api/places/user', usersRoutes);
app.use('/api/places', placesRoutes); // /api/places/..
app.use('/api/users', usersRoutes);

//handling the error when a route doesnt exist
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
});

//error handling middleware function
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'an unknown error occured' })
});

mongoose.connect('mongodb+srv://AryanSharma:Ronaldo7Messi10@clusterrrr.6xqcyr5.mongodb.net/places?retryWrites=true&w=majority&appName=Clusterrrr')
    .then(() => {
        app.listen(3000, () => {
            console.log("Listening to the server 3000");
        })
    })
    .catch(error => {
        console.log(error);
    })