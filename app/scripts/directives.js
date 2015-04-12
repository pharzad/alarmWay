'use strict';

angular.module('Wayalarm.directives', [])

.directive('map', function () {
    return {
        restrict: 'E',
        scope: {
            onCreate: '&'
        },
        link: function ($scope, $element, $attr) {
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            function initialize() {

                navigator.geolocation.getCurrentPosition(function (pos) {

                    var mapOptions = {
                        center: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map($element[0], mapOptions);
                    $scope.onCreate({
                        map: map
                    });
                }, function (err) {
                    alert(err);
                }, options);
            }
            initialize();

        }
    };
});