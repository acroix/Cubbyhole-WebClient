
var app = angular.module('app', ['angularFileUpload', 'ui.router']);

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
            name: 'title?',
            parent: 0
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
            fileElement.id = element.attr("data-id");
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
                    scope.deleteFile(fileElement.id)
                    fileElement.element.remove()
                        
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


/////////////
// Routing //
/////////////
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: '/',
            views: {
                'content': {
                    templateUrl: 'app/templates/content.html'
                },
                'sidebar': {
                    templateUrl: 'app/templates/sidebar.tpl.html'
                }
            }
        })

    $urlRouterProvider.otherwise('/');
})


/////////////////
// Controllers //
/////////////////
app.controller("AppCtrl", function($scope, fileManager) {
    var app = this;

    fileManager
        .list()
        .then(function(files) {
            $scope.files = files.data;
        });

    $scope.addFile = function() {
        fileManager
            .add()
            .then(function(file) {
                $scope.files.push(file);
            });
    }

    $scope.deleteFile = function(fileId) {
        fileManager.delete(fileId)
    }
});


var UploadCtrl = [ '$scope', '$upload','baseUrl', 'authBase64', 
    function($scope, $upload, baseUrl, authBase64) {
        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];

                $scope.upload = $upload.upload({
                    url: baseUrl + '/files',
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': authBase64
                    },
                    // withCredentials: true,
                    data: {name: $scope.myModelObj || file.name , parent: 0},
                    file: file,
                    // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
                    /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                    //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                    //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
                }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
                    $scope.files.push(data);
                });
                //.error(...)
                //.then(success, error, progress); 
            }
        }
    }];

