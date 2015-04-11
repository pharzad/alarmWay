'use strict';

angular.module('Wayalarm.directives', [])

.directive('map', function () {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
        console.log('xxx');
      function initialize() {
          console.log('running');
        
          var mapOptions = {
            center: new google.maps.LatLng(33, 44),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          var map = new google.maps.Map($element[0], mapOptions);
          $scope.onCreate({
            map: map
          });
      }
        initialize();
        
    }
  };
});