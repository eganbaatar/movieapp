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
service.getAll = getAll;
service.delete = _delete;
service.rateMovie = rateMovie;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();

    db.movies.findById(_id, function (err, movie) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (movie) {
            // return user (without hashed password)
            deferred.resolve(_.omit(movie));
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
        
        db.movies.insert(
            movie,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function getAll(userId) {
    var deferred = Q.defer();
    db.movies.aggregate([
        {
           $project: {
              title: 1,
              actors: 1,
              duration: 1,
              year: 1, 
              ratings: {
                 $filter: {
                    input: "$ratings",
                    as: "rating",
                    cond: { $eq: ["$$rating.userId", "59935b990832571092681039"] }
                 }
              }
           }
        }
     ],
     function (err, movies) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if(movies) {
            deferred.resolve(_.omit(movies));
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.movies.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function rateMovie(movieId, userId, rating) {
    var deferred = Q.defer();
    
    db.movies.update(
        {
            _id: mongo.helper.toObjectID(movieId)
        }, 
        {
            $push: { 
                ratings: {
                    $each: [{userId: userId, rating: rating}]
                }
            }
        },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}