(function () {
    'use strict';

    angular
        .module('app')
        .factory('MovieService', Service);

    function Service($http, $q) {
        var service = {};

        service.Create = Create;

        return service;

        function Create(movie) {
            return $http.post('/api/movies/create', movie).then(handleSuccess, handleError);
        }

        // private functions
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
