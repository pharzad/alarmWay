'use strict';

angular.module('Wayalarm.controllers').controller('mainController', function ($scope, $ionicLoading, $ionicPopup, mapServices, $http, $state, $cordovaVibration, $interval, $cordovaMedia) {

    var media1 = $cordovaMedia.newMedia("http://soundjax.com/reddo/97744%5EALARM.mp3");
    $scope.points = [];
    $scope.shouldShowDelete = false;
    
    if (angular.isUndefined(localStorage.getItem('userEmail')) || localStorage.getItem('userEmail') === '')
        $state.go('login');

    mapServices.userVerify().then(function (res) {

        $scope.userInfo = res;

        if (!angular.isUndefined($scope.userInfo)) {
            $scope.points = angular.copy($scope.userInfo.alarms);
        } else {
            $scope.points = [];
        }
    });

    if (!angular.isUndefined($scope.userInfo)) {
        $scope.points = angular.copy($scope.userInfo.alarms);
    } else {
        $scope.points = [];
    }

    $scope.addToMap = function (item) {
        var latLng = new google.maps.LatLng(item.geometry.location.lat, item.geometry.location.lng);
        addPoint(null, item.address_components[0].short_name, null, latLng)
            // console.log(item);
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
    }

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

    function pushToDb() {
        $scope.userInfo.alarms = mapServices.locationAdaptor($scope.userInfo.alarms);
        $http({
            method: 'PUT',
            url: 'http://52.11.39.202:8080/wayalarm/user/' + $scope.userInfo._id,
            data: $scope.userInfo
        }).then(function (res) {

            if (res.data[0]) {
                $scope.userInfo = res.data[0];
                if (!angular.isUndefined($scope.userInfo.alarms)) {
                    $scope.points = angular.copy(res.data[0].alarms);
                } else {
                    $scope.points = [];
                }
            }

        });
    }

    $scope.deletePoint = function (index) {
        $http({
            method: 'DELETE',
            url: 'http://52.11.39.202:8080/wayalarm/user/' + $scope.userInfo._id + '/alarm/' + $scope.userInfo.alarms[index]._id
        }).then(function (res) {

            if (res.data) {
                $scope.userInfo = res.data;
                if (!angular.isUndefined($scope.userInfo.alarms)) {
                    $scope.points = angular.copy(res.data.alarms);
                } else {
                    $scope.points = [];
                }
            }

        });
    }

    function addPoint(index, res, e, itemFromSearch) {

        if (point) {
            point.setMap(null);
        }

        if (index !== null) {
            var latLng = new google.maps.LatLng(parseFloat($scope.points[index].position.k), parseFloat($scope.points[index].position.D));
            point = new google.maps.Marker({
                position: latLng,
                map: $scope.map,
                title: "Destination",
                icon: destinationImage
            });
            $scope.map.setCenter(latLng);
        } else if (itemFromSearch !== null) {
            point = new google.maps.Marker({
                position: itemFromSearch,
                map: $scope.map,
                title: "Destination",
                icon: destinationImage
            });
            $scope.map.setCenter(itemFromSearch);
            point.name = res;

            // console.log(point);
            $scope.points.push(point);
            $scope.userInfo.alarms.push({
                name: point.name,
                position: point.position
            });
            pushToDb();

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
            $scope.userInfo.alarms.push({
                name: point.name,
                position: point.position
            });
            pushToDb();

        }
    }

    function rad(x) {
        return x * Math.PI / 180;
    };

    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    function getDistance(p1, p2) {
        console.log(JSON.stringify(p1));
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.lat() - p1.lat());
        var dLong = rad(p2.lng() - p1.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        // returns the distance in meter
        if (d < 100) {
            point.setMap(null);
            point = null;
            media1.play();
            var alarmVib = $interval(function () {
                $cordovaVibration.vibrate(800);
            }, 1000);
            var alarmPop = $ionicPopup.show({
                template: '<h3>You are Arrived at your destination</h3>',
                title: 'Alarm',
                subTitle: 'You are there',
                scope: $scope,
                buttons: [
                    {
                        text: 'OK'
          }
    ]
            });

            alarmPop.then(function () {
                media1.stop();
                $interval.cancel(alarmVib);
            });
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
    $interval(function () {

        navigator.geolocation.getCurrentPosition(function (pos) {
            if (JSON.stringify(pos) !== JSON.stringify(mapServices.getLocation())) {

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
            }
            mapServices.setLocation(pos);
            if (!$scope.map) {
                return;
            }

        }, function (error) {
            console.log('Unable to get location: ' + error.message);
        });

    }, 1000);

    $scope.centerOnMe = function () {
        var pos = mapServices.getLocation();
        var latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        $scope.map.setCenter(latLng);
    };

    $scope.clearPoint = function () {

        if (point) {
            point.setMap(null);
        }
    };

    $scope.logOut = function () {

        localStorage.setItem('userEmail', '');
        $state.go('login');
    };

    //    $ionicLoading.show({
    //      content: 'Getting current location...',
    //      showBackdrop: false
    //  $ionicLoading.hide();
    //    });

});