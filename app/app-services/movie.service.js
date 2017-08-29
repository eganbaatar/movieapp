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
        service.Rate = Rate;

        return service;

        function Create(data) {
            return $http.post('/api/movies/create', data).then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/movies/all').then(handleSuccess, handleError);
        }

        function Delete(data) {
            return $http.delete('/api/movies/' + JSON.stringify(data)).then(handleSuccess, handleError);
        }

        function Rate(data) {
            return $http.post('/api/movies/rate', data).then(handleSuccess, handleError);
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
