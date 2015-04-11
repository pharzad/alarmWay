'use strict';

angular.module('Wayalarm.controllers', [])

.controller('loginController', function ($scope, $cordovaOauth, $state, $http, mapServices) {

    $scope.user = {};
    $scope.fLogin = function () {
        $cordovaOauth.facebook("608245845976632", ["email", "user_location"]).then(function (result) {

            localStorage.setItem("access_token", result.access_token);
            mapServices.faceBookCheck().then(function (result) {
                localStorage.setItem('userEmail', result.data.email);
                mapServices.userVerify().then(function (res) {
                    if (res.email) {
                        $state.go('main');
                    } else {
                        mapServices.createUser(result.data).then(function () {
                            $state.go('main');
                        });
                    }

                });
            }, function (error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });

        }, function (error) {
            $state.go('main');
            alert('There is a problem, try another login')
        });
    };

    $scope.gLogin = function () {

    };

    $scope.login = function () {

        $http({
            method: 'POST',
            url: 'http://52.11.39.202:8080/wayalarm/login',
            data: {
                email: $scope.user.email,
                password: $scope.user.password
            }
        }).then(function (res) {

            if (res.data.length === 0)
                $scope.result = 'Invalid Username or password';

            else {
                mapServices.setUserInfo(res.data);
                mapServices.setUserEmail($scope.user.email);
                $state.go('main');
            }

            console.log(res);
        });
    };

    $scope.register = function () {

        $http({
            method: 'POST',
            url: 'http://52.11.39.202:8080/wayalarm/user',
            data: {
                email: $scope.user.email,
                password: $scope.user.password
            }
        }).then(function (res) {

            if (res.data.message === 'exist')
                $scope.result = 'Email already exist';

            if (res.data.message === 'success') {
                mapServices.setUserInfo(res.data.user);
                mapServices.setUserEmail($scope.user.email);
                $state.go('main');
            }

        });
    };


});