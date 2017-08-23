var config = require('config.json');
var express = require('express');
var router = express.Router();
var movieService = require('services/movie.service');

// routes
router.get('/all', getAllMovies);
router.post('/create', createMovie);
router.delete('/:data', deleteMovie);

module.exports = router;

function createMovie(req, res) {
    movieService.create(req.body.movie)
        .then(function () {
            res.io.emit('movie:created', {
                username: req.body.username,
                title: req.body.movie.title
            });
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllMovies(req, res) {
    movieService.getAll()
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
                title: data.title
            });
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}