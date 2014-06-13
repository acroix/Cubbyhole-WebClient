var FileManager = function(baseUrl, http) {
	this.http = http;
    this.baseUrl = baseUrl;
}

var createFile = function (hash) {
    hash.cdate = new Date(hash.cdate);
    hash.mdate = new Date(hash.mdate);
    return hash;
}

FileManager.prototype.list = function(fileId) {
    return this.http({
    	url: this.baseUrl + '/files' + '/' + (fileId ? fileId + '/list' : ''),
    	method: 'GET'
    }).then(function (files) {
        return files.map(createFile);
    });
}

FileManager.prototype.add = function (isFolder, fileName, fileParent) {
	return this.http({
        url: this.baseUrl + '/files',
        method: 'PUT',
        data: {
            name: fileName,
            parent: fileParent,
            isFolder: isFolder
        }
    }).then(createFile);
}

FileManager.prototype.getFileById = function(id) {
    return this.http({
        url: this.baseUrl + '/files/' + id,
        method: 'GET',
    }).then(createFile);
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
    }).then(createFile);
}

FileManager.prototype.share = function (fileId, accountId, permission) {
    return this.http({
        url: this.baseUrl + '/files/' + fileId + '/shares/' + permission,
        method: 'PUT',
        data: {
            account: accountId,
            permission: permission
        }
    });
}

FileManager.prototype.getShares = function (fileId) {
    return this.http({
        url: this.baseUrl + '/files/' + fileId + '/shares/',
        method: 'GET'
    });
}

FileManager.prototype.generateShareLink = function(fileId) {
    return this.http({
        url: this.baseUrl + '/files/' + fileId  + '/link',
        method: 'POST'
    });
}

FileManager.prototype.rename = function  (id, name) {
    return this.http({
        url:  this.baseUrl + '/files/' + id,
        method: 'POST',
        data: {
            name: name
        }
    });
}

FileManager.prototype.move = function  (fileId, dropId) {
    return this.http({
        url:  this.baseUrl + '/files/' + fileId,
        method: 'POST',
        data: {
            parent: dropId
        }
    });
}
