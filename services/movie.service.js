var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('movies');

var service = {};

service.getById = getById;
service.create = create;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.movies.findOne(
        { 
            title: userParam.title,
            year: userParam.year
         },
        function (err, movie) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (movie) {
                // movie already exists
                deferred.reject('Movie with title ' + userParam.title + ' in year ' + userParam.year + ' already exists');
            } else {
                createMovie();
            }
        });

    function createMovie() {
        // set movieId to userParam
        var movie = _.omit(userParam);
        movie.id = movieId;
        db.movies.insert(
            movie,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}