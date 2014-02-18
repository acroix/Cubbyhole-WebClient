define(['angular'], function (angular) {

    var fileElement = {
        dragging: false,
        element: ''
    };

    angular.module('myApp.directives', [])
        .directive('draggable', function ($document) {
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
        })
        .directive('droppable', function($document) {
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
});

