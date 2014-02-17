define(['fileManager'], function(FileManager) {
	return {
		httpAuth: function($http, authBase64) {
	        return function(config) {
	            if (typeof config !== 'object')
	                config = {}

	            config.headers = config.headers || {};
	            config.headers.Authorization = authBase64;

	            return $http(config);
	        }
	    },
	    fileManager: function(baseUrl, httpAuth) {
	        var fileManager = new FileManager(baseUrl, httpAuth);
	        return fileManager;
	    }
	}
});
