'use strict';

angular.module('Wayalarm.controllers', [])

.controller('MapCtrl', function ($scope, $ionicLoading, $ionicPopup, mapServices, $http) {

    $scope.addToMap = function (item) {
        var latLng = new google.maps.LatLng(item.geometry.location.lat, item.geometry.location.lng);
        addPoint(null, item.address_components[0].short_name, null, latLng)
        console.log(item);
    }

    $scope.getLocation = function (val) {
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: val,
                sensor: false
            }
        }).then(function (response) {
            return response.data.results.map(function (item) {
                return item;
            });
        });
    };

    var oldLng = 0;
    var oldLat = 0;
    var point;
    var me;
    var destinationImage = new google.maps.MarkerImage(
        'img/destination.png',
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(30, 30)
    );

    var walkingImage = new google.maps.MarkerImage(
        'img/walking.png',
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(40, 50)
    );
    $scope.addPoint = addPoint;

    function addPoint(index, res, e, itemFromSearch) {

        if (point) {
            point.setMap(null);
        }

        if (index !== null) {
            point = new google.maps.Marker({
                position: $scope.points[index].position,
                map: $scope.map,
                title: "Destination",
                icon: destinationImage
            });
            $scope.map.setCenter($scope.points[index].position);
        } else if (itemFromSearch !== null) {
            point = new google.maps.Marker({
                position: itemFromSearch,
                map: $scope.map,
                title: "Destination",
                icon: destinationImage
            });
            $scope.map.setCenter(itemFromSearch);
            point.name = res;
            $scope.points.push(point);
        } else {
            point = new google.maps.Marker({
                position: e.latLng,
                map: $scope.map,
                title: "Destination",
                icon: destinationImage
            });
            $scope.map.setCenter(e.latLng);
            point.name = res;
            $scope.points.push(point);
        }
            

        
    }

    $scope.points = [];

    function rad(x) {
        return x * Math.PI / 180;
    };

    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    function getDistance(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.lat() - p1.lat());
        var dLong = rad(p2.lng() - p1.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        console.log(d); // returns the distance in meter
        if (d < 100) {
            alert('You are there');
            point.setMap(null);
            point = null;
        }
    };


    $scope.mapCreated = function (map) {
        $scope.map = map;
        var request = {
            query: 'restaurant'
        };

        google.maps.event.addListener(map, 'dblclick', function (e) {
            $scope.alarm = {};
            $scope.alarm.name = "";
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="alarm.name">',
                title: 'Enter your Alarm Name',
                subTitle: 'Please use a meaningfull Name',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel'
          },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.alarm.name) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.alarm.name;
                            }
                        }
      }
    ]
            });

            myPopup.then(function (res) {

                addPoint(null, res, e, null);

            });
        });
    };

    navigator.geolocation.watchPosition(function (pos) {


        mapServices.setLocation(pos);
        if (!$scope.map) {
            return;
        }


        if (me)
            me.setMap(null);
        me = new google.maps.Marker({
            position: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            },
            map: $scope.map,
            title: "I'm here",
            icon: walkingImage
        });
        if (me && point) {
            getDistance(me.position, point.position);
        }

    }, function (error) {
        console.log('Unable to get location: ' + error.message);
    });

    $scope.centerOnMe = function () {
        var pos = mapServices.getLocation();
        var latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        $scope.map.setCenter(latLng);
    };

    //    $ionicLoading.show({
    //      content: 'Getting current location...',
    //      showBackdrop: false
    //  $ionicLoading.hide();
    //    });

});