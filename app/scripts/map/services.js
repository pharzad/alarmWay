'use strict';

angular.module('Wayalarm.services', [])
    .factory('mapServices', function ($http, $q, $cordovaFile) {
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

            userVerify: function (email) {
                if (!email)
                    email = localStorage.getItem('userEmail')
                return $http({
                    method: 'POST',
                    url: 'http://portofsolutions.com:8080/wayalarm/verify',
                    data: {
                        email: email
                    }
                }).then(function (res) {
                    return res.data[0];

                });
            },

            createUser: function (data) {
                return $http({
                    method: 'POST',
                    url: 'http://portofsolutions.com:8080/wayalarm/user',
                    data: data
                }).then(function (res) {
                    return res;
                });
            },

            locationAdaptor: function (info) {
                var defered = $q.defer();
                var temp = [];
                angular.forEach(info.alarms, function (v) {
                    if (v.position) {
                        temp.push({
                            name: v.name,
                            position: {
                                k: v.position.lat(),
                                D: v.position.lng()
                            }
                        });
                    }
                });
                info.alarms = temp;
                $http({
                    method: 'PUT',
                    url: 'http://portofsolutions.com:8080/wayalarm/user/' + info._id,
                    data: info
                }).then(function (res) {
                    defered.resolve(res);
                });

                return defered.promise;

            },

            fileOperations: function () {

                $cordovaFile.checkFile(cordova.file.dataDirectory,'user.data')
                    .then(function (success) {
                        console.log(JSON.stringify(success));
                    }, function (error) {
                        // error
                    });

            }


        };

    });