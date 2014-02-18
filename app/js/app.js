define([
	'angular',
	'services',
	'factories',
	'directives',
	'controllers'
	], function (angular, services, factories, directives, controllers) {
		'use strict';

		return angular.module('myApp', [
			'myApp.controllers',
			'myApp.services',
			'myApp.factories',
			'myApp.directives'
		]);
});
