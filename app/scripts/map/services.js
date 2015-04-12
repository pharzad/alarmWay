'use strict';

angular.module('Wayalarm.services', [])
    .factory('mapServices', function ($http, $q) {
        var currentLocation = {},
            userInfo = {};
        // jsonRes = JSON.parse('{"data":{"id":"10153132303928954","name":"Pharzad Aziminia","gender":"male","location":{"id":"106104516087360","name":"Dana Point, California"},"picture":{"data":{"is_silhouette":false,"url":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfa1/v/t1.0-1/p50x50/10628171_10152742432883954_5532032450325246170_n.jpg?oh=6abeda5e2552e54f4403ce6bc47d1197&oe=55B9AF07&__gda__=1438471054_7f30cf116df4c950e21c3fbf7f08597e"}},"email":"pharzad.aziminia@gmail.com"},"status":200,"config":{"method":"GET","transformRequest":[null],"transformResponse":[null],"params":{"access_token":"CAAIpMkWV5jgBAIRuBCjgO4ujp5m1N4neyy528D4iWLZAHXvWOrgaPmOSMM5XL6iLu6Jilu6SazoR4iZBWYV7dBZCxBNBHEqrtjYA5Woyb62a7fTy5kHW8UwQ6hc1BlixanP1GLCXdj1N6AH70Hj2PUczFnfuhpHcS1Ozp22Cl5F0D31SzPLsp6GEOk3YlVHgVfLGgEKouArPZBEsrDaU","fields":"id,name,gender,location,website,picture,relationship_status,email","format":"json"},"url":"https://graph.facebook.com/v2.2/me","headers":{"Accept":"application/json, text/plain, */*"}},"statusText":"OK"}');

        return {

            setLocation: function (loc) {
                currentLocation = loc;
            },

            getLocation: function () {
                return currentLocation;
            },
            setUserInfo: function (info) {
                userInfo = info;
            },
            getUserInfo: function () {
                return userInfo;
            },
            setUserEmail: function (email) {
                localStorage.setItem('userEmail', email);
            },

            faceBookCheck: function () {
                return $http.get("https://graph.facebook.com/v2.2/me", {
                    params: {
                        access_token: localStorage.getItem("access_token"),
                        fields: "id,name,gender,location,website,picture,relationship_status,email",
                        format: "json"
                    }
                });
            },

            userVerify: function () {
                return $http({
                    method: 'POST',
                    url: 'http://52.11.39.202:8080/wayalarm/verify',
                    data: {
                        email: localStorage.getItem('userEmail')
                    }
                }).then(function (res) {
                    return res.data[0];

                });
            },

            createUser: function (data) {
                return $http({
                    method: 'POST',
                    url: 'http://52.11.39.202:8080/wayalarm/user',
                    data: data
                }).then(function (res) {
                    return res;
                });
            },
            locationAdaptor: function (info) {
                var defered = $q.defer();
                var temp = [];
                angular.forEach(info.alarms, function (v) {
                    temp.push({
                        name: v.name,
                        position: {
                            D: v.position.D,
                            k: v.position.k
                        }
                    });
                });
                info.alarms = temp;
                console.log(JSON.stringify(temp));
                console.log('**************');
                console.log(JSON.stringify(info));
                console.log('**************');
                console.log(JSON.stringify(info));
                $http({
                    method: 'PUT',
                    url: 'http://52.11.39.202:8080/wayalarm/user/' + info._id,
                    data: info
                }).then(function(res){
                    defered.resolve(res);
                });
                
                return defered.promise;

            }



        };

    });