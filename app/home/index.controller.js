(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService, MovieService, FlashService, NgTableParams) {
        var vm = this;
        var self = this;

        vm.user = null;
        vm.movie = null;
        vm.movies = [];

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
        }

        function createMovie() {
            MovieService.Create(vm.movie).then(function() {
                FlashService.Success('Movie' + vm.movie.title + ' added successfully');
            })
            .catch(function (error) {
                FlashService.Error(error);
            });
        }

        function deleteMovie(movie) {
            MovieService.Delete(movie._id).then(function() {
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
    }

})();