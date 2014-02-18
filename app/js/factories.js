define(['angular', 'fileManager'], function(angular, FileManager) {

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
        .factory('fileManager', function(baseUrl, httpAuth) {
            var fileManager = new FileManager(baseUrl, httpAuth);
            return fileManager;
        });
});
