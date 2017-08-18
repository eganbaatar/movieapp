var config = require('config.json');
var express = require('express');
var router = express.Router();
var movieService = require('services/movie.service');

// routes
router.post('/create', createMovie);

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