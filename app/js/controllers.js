define(['angular', 'fileManager'], function (angular, FileManager) {
    return angular.module('myApp.controllers', [])
        .controller("AppCtrl", function($scope, FileManager) {
            var fileManager = new FileManager;
            console.log(fileManager)
            // fileManager
            //     .list()
            //     .then(function(files) {
            //         $scope.files = files.data;
            //     });

            // $scope.addFile = function() {
            //     console.log("ok")
            //     fileManager
            //         .add()
            // }
        });
});
