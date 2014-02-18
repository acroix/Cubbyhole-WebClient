define(['angular', 'directives', 'factories'],
    function(angular, directives, factories) {

        'use strict';

        return angular.module('myApp', [
            'myApp.services',
            'myApp.factories',
            'myApp.controllers',
            'myApp.directives'
        ]);
    });
