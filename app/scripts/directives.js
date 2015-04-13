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
                enableHighAccuracy: false,
                timeout: 3000,
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
                    alert('GPS signal is weak try to turn on your wifi or change your position');
                    var mapOptions = {
                        center: new google.maps.LatLng(43.8220017, -3.5214818),
                        zoom: 3,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map($element[0], mapOptions);
                    $scope.onCreate({
                        map: map
                    });
                }, options);
            }
            initialize();

        }
    };
});