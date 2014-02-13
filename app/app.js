var app = angular.module("app", []);

app.value('baseUrl', 'http://localhost:3000');
// TODO User can connect
app.value('authBase64', 'Basic dXNlcjpwYXNz');


//todo remove url from httpauth and put it into FileManager
app.factory("httpAuth", function($http, authBase64) {
    return function(config) {
        if (typeof config !== 'object')
            config = {}

        config.headers = config.headers || {};
        config.headers.Authorization = authBase64;

        return $http(config);
    }
});

// TODO requirejs
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

app.factory('fileManager', function(baseUrl, httpAuth) {
    var fileManager = new FileManager(baseUrl, httpAuth);
    return fileManager;
});

app.controller("AppCtrl", function($scope, fileManager) {
    fileManager
        .list()
        .then(function(files) {
            $scope.files = files.data;
        });
    
});

// app.directive("dragable", function () {
//     function drag (scope, element, attrs) {
//         var event = element.on('dragstart', handleDragStart);
//         console.log(event);

//         function handleDragStart(e) {
//             console.log('handleDragStart');
//         }
//         //event.dataTransfer.setData("Text", scope.$id);
//     }

//     return {
//         link: drag
//     }
// });
