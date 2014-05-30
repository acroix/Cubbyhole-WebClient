
var app = angular.module('app', ['angularFileUpload', 'ui.router']);

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
        element.on('mouseenter', function () {
            console.log(element)
            if (fileElement.dragging) {
                element.on('mouseup', function() {
                    scope.deleteFile(fileElement.id);
                    fileElement.element.remove();
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
                    templateUrl: 'app/templates/content.tpl.html'
                },
                'sidebar': {
                    templateUrl: 'app/templates/sidebar.tpl.html'
                },
                'browseHeader': {
                    templateUrl: 'app/templates/browseheader.tpl.html'
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
    var currentFile = {};

    fileManager
        .list()
        .then(function(files) {
            $scope.files = files.data;
        });

    $scope.addFile = function(isFolder) {
        var isFolder = isFolder || false;
        var fileName = $('#browserTooltips .fileName').val();
        
        if (!fileName.length)   fileName = 'no title'

        fileManager
            .add(isFolder, fileName)
            .then(function(file) {
                $scope.files.push(file.data);
            });
    }

    $scope.deleteFile = function(fileId) {
        for (var i = 0; i < $scope.files.length; i++) {
            if ($scope.files[i].id == fileId)
                $scope.files.splice(i, 1);
        }
        fileManager.delete(fileId);
    }

    $scope.fileSelected = function($index, file) {
        $scope.selectedIndex = $index;
        if (currentFile.id !== file.id) {
            currentFile = file;
        }
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
