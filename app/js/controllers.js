define(['angular', 'fileManager'], function (angular, fileManager) {
    return angular.module('myApp.controllers', [])
        .controller("AppCtrl", function($scope, fileManager) {
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