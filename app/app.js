'use strict';

angular.module('Wayalarm', ['ionic', 'ngCordova', 'Wayalarm.controllers', 'Wayalarm.directives', 'Wayalarm.services', 'ui.bootstrap', 'ui.router'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
}).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('login', {
        url: '/',
        templateUrl: 'views/login.html',
        controller: 'loginController'
    });

    $stateProvider.state('main', {
        url: '/main',
        templateUrl: 'views/main.html',
        controller: 'mainController'
    });
    
    $stateProvider.state('register', {
        url: '/register',
        templateUrl: 'register.html',
        controller: 'loginController'
    });
    $urlRouterProvider.otherwise('/')
}).config(function ($httpProvider) {
    
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

});