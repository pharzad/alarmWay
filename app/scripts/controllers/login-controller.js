'use strict';

angular.module('Wayalarm.controllers', [])

.controller('loginController', function ($scope, $cordovaOauth, $state, $http, mapServices, $timeout, $ionicLoading) {
    $scope.loading = true;
    
    $timeout(function () {
        $scope.loading = false;
    }, 8000);
    
    console.log(JSON.stringify(localStorage.getItem('userEmail')));
    
    $scope.user = {};
    
    $scope.fLogin = function () {
        $cordovaOauth.facebook('608245845976632', ['email', 'user_location']).then(function (result) {
            localStorage.setItem('access_token', result.access_token);
            mapServices.faceBookCheck().then(function (result) {
                localStorage.setItem('userEmail', result.data.email);
                mapServices.userVerify(result.data.email).then(function (res) {
                    console.log(JSON.stringify(res));
                    if (typeof res !== 'undefined') {
                        if (res.length > 0) {
                            $ionicLoading.show({
                                content: 'Loading',
                                showBackdrop: false
                            });
                            mapServices.fileOperations();
                            $state.go('main');
                        } else {
                            mapServices.createUser(result.data).then(function () {
                                $state.go('main');
                            });
                        }
                    } else {
                        mapServices.createUser(result.data).then(function () {
                            $state.go('main');
                        });
                    }
                });
            }, function (error) {
                alert('There was a problem getting your profile.  Check the logs for details.');
            });

        }, function (error) {
            alert('There is a problem, try another login');
        });
    };

    $scope.login = function () {
//mapServices.fileOperations();
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
                $cordovaFile.checkFile(cordova.file.dataDirectory, 'user.dat')
                    .then(function (success) {
                        console.log(JSON.stringify(success));
                    }, function (error) {
                        // error
                    });
//                $cordovaFile.createFile(cordova.file.dataDirectory, 'user.dat', true)
//                    .then(function (success) {
//                        $cordovaFile.writeExistingFile(cordova.file.dataDirectory, 'user.dat', $scope.user.email)
//                            .then(function (success) {
//                                mapServices.setUserInfo(res.data.user);
//                                mapServices.setUserEmail($scope.user.email);
//                                $state.go('main');
//                            }, function (error) {});
//                    }, function (error) {});
            }
        });
    };


});