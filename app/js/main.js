require.config({
	paths: {
		'angular': '../bower_components/angular/angular',
		'domReady': '../bower_components/requirejs-domready/domReady'
	},
	shim: {
		'angular' : {'exports' : 'angular'}
	},
	priority: [
		"angular"
	],
	deps: ['./app']
});
