'use strict';

angular.module('Wayalarm.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, $interval ) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };
 $interval(function(){
    if (!$scope.map) {
      return;
    }
      navigator.geolocation.getCurrentPosition(function (pos) {
     // console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $ionicLoading.hide();
    }, function (error) {
      console.log('Unable to get location: ' + error.message);
    });
  },200);
//    $ionicLoading.show({
//      content: 'Getting current location...',
//      showBackdrop: false
//    });

});
