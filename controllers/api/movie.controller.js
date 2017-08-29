var config = require('config.json');
var express = require('express');
var router = express.Router();
var movieService = require('services/movie.service');
var userService = require('services/user.service');

// routes
router.get('/all', getAllMovies);
router.post('/create', createMovie);
router.post('/rate', rateMovie);
router.delete('/:data', deleteMovie);

module.exports = router;

function createMovie(req, res) {
    movieService.create(req.body.movie)
        .then(function () {
            res.io.emit('movie:created', {
                username: req.body.username,
                title: req.body.movie.title,
                timestamp: new Date()
            });
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllMovies(req, res) {
    var userId = req.user.sub;

    movieService.getAll(userId)
        .then(function (data) {
            if(data) {
                res.send(data);
            } else {
                res.sendStatus(404);
            }
            
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteMovie(req, res) {
    var data = JSON.parse(req.params.data);
    movieService.delete(data.id)
        .then(function () {
            res.io.emit("movie:deleted", {
                username: data.username,
                title: data.title,
                timestamp: new Date()
            });
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function rateMovie(req, res) {
    var userParam = req.body;
    movieService.rateMovie(userParam.movieId, userParam.userId, userParam.rating)

        // Im sure following could be done better but does not know yet how 
        // Trying to get movie and user object with help of their id's.
        .then(function () {
            movieService.getById(userParam.movieId)
            .then(function(movie) {
                userService.getById(userParam.userId)
                .then(function(user) {
                    res.io.emit("movie:rated", {
                        title: movie.title,
                        username: user.username,
                        rating: userParam.rating,
                        timestamp: new Date()
                    });
                    res.sendStatus(200);
                })
                .catch(function(err){
                    res.status(400).send(err);
                });
            })
            .catch(function(err) {
                res.status(400).send(err);
            });
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}