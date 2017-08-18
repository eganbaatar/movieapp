var config = require('config.json');
var express = require('express');
var router = express.Router();
var movieService = require('services/movie.service');

// routes
router.get('/all', getAllMovies);
router.post('/create', createMovie);
router.delete('/:_id', deleteMovie);

module.exports = router;

function createMovie(req, res) {
    movieService.create(req.body)
        .then(function () {
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
    movieService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}