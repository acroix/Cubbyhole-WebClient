
var app = angular.module('app', []);

///////////////////////
// FileManager class //
///////////////////////
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


////////////////
// Directives //
////////////////
var fileElement = {
    dragging: false,
    element: ''
};

app.directive('draggable', function ($document) {
    return function (scope, element, attr) {
        var startX  = 0;
        var startY  = 0;
        var x       = 0;
        var y       = 0;

        element.on('mousedown', function (event) {
            event.preventDefault();
            startX = event.screenX - x;
            startY = event.screenY - y;
            $document.on('mousemove', mouseMove);
            $document.on('mouseup', mouseUp);
            fileElement.element = this;
            fileElement.dragging = true;
        });

        function mouseMove ( event ) {
            y = event.screenY - startY;
            x = event.screenX - startX;
            element.css({
                top: y + 'px',
                left:  x + 'px'
            });
        }

        function mouseUp () {
            $document.unbind('mousemove', mouseMove);
            $document.unbind('mouseup', mouseUp);
            fileElement.element = '';
            fileElement.dragging = false;
        }
    }
});

app.directive('droppable', function($document) {
    return function (scope, element, attr) {
        // TODO add class better than .css
        element.on('mouseleave', function() {
            element.css({
                backgroundColor: '#D1E3F7'
            });
        });

        element.on('mouseenter', function () {
            if (fileElement.dragging) {
                element.css({
                    backgroundColor: 'red'
                });

                element.on('mouseup', function() {
                    fileElement.element.remove();

                    element.css({
                        backgroundColor: '#D1E3F7'
                    });
                });
            }
            if (!fileElement.dragging)
                console.log("no element :(")
        });
    }
});

////////////
// Values //
////////////
app.value('baseUrl', 'http://localhost:3000');
app.value('authBase64', 'Basic dXNlcjpwYXNz');

///////////////
// Factories //
///////////////
app.factory('httpAuth', function($http, authBase64) {
    return function(config) {
        if (typeof config !== 'object')
            config = {}

        config.headers = config.headers || {};
        config.headers.Authorization = authBase64;

        return $http(config);
    }
});

app.factory('fileManager', function(baseUrl, httpAuth) {
	var fileManager = new FileManager(baseUrl, httpAuth);
	return fileManager;
 });

app.controller("AppCtrl", function($scope, fileManager) {
    console.log(fileManager)
    fileManager
        .list()
        .then(function(files) {
            $scope.files = files.data;
        });

    // $scope.addFile = function() {
    //     console.log("add file")
    // }
});
