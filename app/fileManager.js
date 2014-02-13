var FileManager = function(baseUrl, http) {
    this.http = http;
    this.baseUrl = baseUrl;
}

FileManager.prototype.list = function() {
    return this.http({url: this.baseUrl + '/files', method: 'GET'});
}

FileManager.prototype.add = function() {

}

FileManager.prototype.remove = function(id) {
    
}

FileManager.prototype.findById = function(id) {
    
}
