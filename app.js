const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
//this is basically a middleware now, which we can call in the app.use method

const app = express();
//app.use('/api/places/user', usersRoutes);
app.use('/api/places', placesRoutes); // /api/places/..

//error handling middleware function
app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'an unknown error occured'})
});

app.listen(5000, ()=> {
    console.log("Listening to the server 5000");
})