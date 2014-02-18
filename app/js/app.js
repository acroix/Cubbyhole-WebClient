require(['directives', 'factories'],
    function(directives, factories) {
        var app = angular.module("app", []);

        app.directive(directives);
        app.value('baseUrl', 'http://localhost:3000');
        app.value('authBase64', 'Basic dXNlcjpwYXNz');
        // TODO app.value('authBase64', 'Basic' + Base64(user:pass));

        // TODO remove url from httpauth and put it into FileManager
        app.factory(factories);

        app.controller("AppCtrl", function($scope, fileManager) {
            fileManager
                .list()
                .then(function(files) {
                    $scope.files = files.data;
                });

            $scope.addFile = function() {
                console.log("ok")
                fileManager
                    .add()
            }
        });

    });
