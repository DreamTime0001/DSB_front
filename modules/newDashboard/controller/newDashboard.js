(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('newDashboardController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$cookies',function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer,$cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.isNew = $cookies.get('isNew');
//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            vm.closeIsNew = function () {
                $cookies.put('isNew', 0);
                vm.isNew = 0;
                console.log(vm.isNew)
            };
        }])
}());