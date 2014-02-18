define(['angular'], function(angular) {

    angular.module('myApp.factories', ['myApp.services'])
        .factory('httpAuth', function($http, authBase64) {
            return function(config) {
                if (typeof config !== 'object')
                    config = {}

                config.headers = config.headers || {};
                config.headers.Authorization = authBase64;

                return $http(config);
            }
        })
});
