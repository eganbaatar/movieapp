(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService, MovieService, FlashService, NgTableParams) {
        var vm = this;
        var self = this;
        var socket = io.connect();         
        
        vm.user = null;
        vm.movie = null;
        vm.movies = [];
        vm.notifications = [];

        vm.createMovie = createMovie;
        vm.deleteMovie = deleteMovie;

        vm.tableParams = null;
        initController();

        function initController() {
            vm.movie = {};

            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
            
            vm.tableParams = new NgTableParams({}, {
                dataset: vm.movies
            });

            fetchAllMovies();
            vm.notifications.push({
                username: 'user1',
                msg: 'deleted movie'
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

        socket.on('movie:created', function(obj) {
            vm.notifications.push({
                username: obj.username,
                msg: 'has created movie with title ' + obj.title 
            });
            fetchAllMovies();
        });

        socket.on('movie:deleted', function(obj) {
            vm.notifications.push({
                username: obj.username,
                msg: 'has deleted movie with title ' + obj.title
            });
            fetchAllMovies();
        });
    }

})();