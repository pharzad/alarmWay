'use strict';

angular.module('Wayalarm.controllers', [])

.controller('MapCtrl', function ($scope, $ionicLoading, $ionicPopup, mapServices) {
  var oldLng = 0;
  var oldLat = 0;
  var point;
  var me;
  $scope.addPoint = addPoint;

  function addPoint(index, res, e) {
    
    if (point) {
      point.setMap(null);
    }

    if (index!==null)
    {
      point = new google.maps.Marker({
      position: $scope.points[index].position,
      map: $scope.map,
      title: "Destination"
    });
    }
  
    else
    {
    point = new google.maps.Marker({
      position: e.latLng,
      map: $scope.map,
      title: "Destination"
    });
    
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
    google.maps.event.addListener(map, 'click', function (e) {
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

        addPoint(null, res, e);

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
        title: "I'm here"
      });
      if (me && point) {
        getDistance(me.position, point.position);
      }

  }, function (error) {
    console.log('Unable to get location: ' + error.message);
  });

  //    $ionicLoading.show({
  //      content: 'Getting current location...',
  //      showBackdrop: false
  //  $ionicLoading.hide();
  //    });

});