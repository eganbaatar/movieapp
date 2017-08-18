(function () {
    'use strict';

    angular
        .module('app')
        .factory('MovieService', Service);

    function Service($http, $q) {
        var service = {};

        service.Create = Create;
        service.GetAll = GetAll;
        service.Delete = Delete;

        return service;

        function Create(movie) {
            return $http.post('/api/movies/create', movie).then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/movies/all').then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/movies/' + _id).then(handleSuccess, handleError);
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
