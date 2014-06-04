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

FileManager.prototype.copy = function(file) {
    return this.http({
        url: this.baseUrl + '/files/' + file.id + '/copy',
        method: 'POST',
        data: {
            name: file.name + '-copy'
        }
    });
}

