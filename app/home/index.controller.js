(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService, MovieService, FlashService, NgTableParams, $localStorage) {
        var vm = this;
        var self = this;
        var socket = io.connect();         
        
        vm.user = null;
        vm.movie = null;
        vm.movies = [];

        vm.createMovie = createMovie;
        vm.deleteMovie = deleteMovie;
        vm.rateMovie = rateMovie;
        vm.clearNotifications = clearNotifications;
        vm.tableParams = null;
        initController();

        function initController() {
            vm.movie = {};

            // save notifications into local storage
            vm.storage = $localStorage.$default({
                notifications: []
            });

            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                fetchAllMovies();
            });
            
            vm.tableParams = new NgTableParams({}, {
                dataset: vm.movies
            });
        }

        function createMovie() {
            MovieService.Create({
                username: vm.user.username,
                movie: vm.movie
            }).then(function() {
                FlashService.Success('Movie' + vm.movie.title + ' added successfully');
            })
            .catch(function (error) {
                FlashService.Error(error);
            });
        }

        function deleteMovie(movie) {
            MovieService.Delete({
                username: vm.user.username,
                id: movie._id,
                title: movie.title
            }).then(function() {
                FlashService.Success('Movie ' + movie.title + ' deleted successfully');
            })
            .catch(function (error) {
                FlashService.Error(error);
            });
        }

        function fetchAllMovies() {
            MovieService.GetAll().then(function(data) {
                vm.movies = data;
            })
            .catch(function (error) {
                FlashService.Error(error);
            });
        }

        function rateMovie(movie, rating) {
            MovieService.Rate({
                movieId: movie._id,
                rating: rating,
                userId: vm.user._id
            }).then(function(data) {
                FlashService.Success('Movie ' + movie.title + ' was rated with ' + rating);
            })
            .catch(function (error) {
                FlashService.Error(error);
            });                 
        }

        function clearNotifications() {
            vm.storage.notifications.length = 0;
        }

        // Socket action listeners
        socket.on('movie:created', function(obj) {
            vm.storage.notifications.unshift({
                username: obj.username,
                msg: 'has created movie with title ' + obj.title,
                timestamp: obj.timestamp
            });
            fetchAllMovies();
        });

        socket.on('movie:deleted', function(obj) {
            vm.storage.notifications.unshift({
                username: obj.username,
                msg: 'has deleted movie with title ' + obj.title,
                timestamp: obj.timestamp
            });
            fetchAllMovies();
        });

        socket.on('movie:rated', function(obj) {
            vm.storage.notifications.unshift({
                username: obj.username,
                msg: 'has rated movie "' + obj.title + '" with ' + obj.rating + ' star',
                timestamp: obj.timestamp
            });
            fetchAllMovies();
        });
    }
})();