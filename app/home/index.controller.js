(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService, MovieService, FlashService) {
        var vm = this;
        
        vm.user = null;
        vm.movie = null;
        vm.createMovie = createMovie;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
            
            vm.movie = {};
        }

        function createMovie() {
            MovieService.Create(vm.movie).then(function() {
                FlashService.Success('movie added successfully');
            })
            .catch(function (error) {
                FlashService.Error(error);
            });
        }
    }

})();