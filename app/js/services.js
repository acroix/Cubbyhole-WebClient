define(['angular'], function (angular) {

    angular.module('myApp.services', [])
        .value('baseUrl', 'http://localhost:3000')
        .value('authBase64', 'Basic dXNlcjpwYXNz');

});

