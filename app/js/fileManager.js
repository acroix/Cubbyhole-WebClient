define(function() {
	var FileManager = function(baseUrl, http) {
    	this.http = http;
	    this.baseUrl = baseUrl;
	}

	FileManager.prototype.list = function() {
	    return this.http({url: this.baseUrl + '/files', method: 'GET'});
	}

	FileManager.prototype.add = function() {
		return this.http({
            url: this.baseUrl + '/files',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                name: 'file2',
                parent: 0
            }
        });
	}

	FileManager.prototype.remove = function(id) {
	    
	}

	FileManager.prototype.findById = function(id) {
	    
	}

	return FileManager;
});
