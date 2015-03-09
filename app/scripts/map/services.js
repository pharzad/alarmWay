angular.module('Wayalarm.services', [])
.factory ('mapServices', function () {
  var currentLocation = {};

  return {
    
    setLocation: function (loc) {
      currentLocation = loc;
    },

      getLocation: function () {
      return currentLocation;
    }
  }

});