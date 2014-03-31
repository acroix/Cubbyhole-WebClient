var FileManager = function(baseUrl, http) {
	this.http = http;
    this.baseUrl = baseUrl;
}

FileManager.prototype.list = function() {
    return this.http({
    	url: this.baseUrl + '/files',
    	method: 'GET'
    });
}

FileManager.prototype.add = function (isFolder, fileName) {
	return this.http({
        url: this.baseUrl + '/files',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            name: fileName,
            parent: 0,
            isFolder: isFolder
        }
    });
}

FileManager.prototype.getFileById = function(id) {
    return this.http({
        url: this.baseUrl + '/files/' + id,
        method: 'GET',
    });
}

FileManager.prototype.delete = function(id) {
    return this.http({
        url: this.baseUrl + '/files/' + id,
        method: 'DELETE'
    });
}
