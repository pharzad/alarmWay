'use strict';

angular.module('Wayalarm.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, $interval ) {
   var oldLng=0;
   var oldLat=0;
   var point;
   var me;
   function rad(x) {
  return x * Math.PI / 180;
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
  console.log (d); // returns the distance in meter
          if (d<100)
          {
            alert('You are there');
            point.setMap(null);
            point=null;
          }
};
  $scope.mapCreated = function(map) {
    $scope.map = map;
    google.maps.event.addListener(map, 'click', function(e){

  if (point)
  {
   point.setMap(null);
  }
point = new google.maps.Marker({
    position: e.latLng,
    map: map,
    title:"Destination"
});
});
  };
  
 $interval(function(){
    if (!$scope.map) {
      return;
    }
      navigator.geolocation.getCurrentPosition(function (pos) {
        
        if (pos.coords.latitude!==oldLng || pos.coords.longitude!==oldLat)
        {
          oldLng = pos.coords.latitude;
          oldLat = pos.coords.longitude;
        if (me)
          me.setMap(null);
//      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
         me = new google.maps.Marker({
    position:{lat:pos.coords.latitude , lng:pos.coords.longitude},
    map: $scope.map,
    title:"I'm here"
});
          if (me && point)
          {
            getDistance(me.position , point.position);
          }
          
        }
    }, function (error) {
      console.log('Unable to get location: ' + error.message);
    });
  },200);
  
//    $ionicLoading.show({
//      content: 'Getting current location...',
//      showBackdrop: false
//  $ionicLoading.hide();
//    });

});
