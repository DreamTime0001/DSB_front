(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('personalClaimDetailsController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.analysis = false;
            vm.popShow = false;

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //查询
            vm.search = function () {
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //开始解析
            vm.toAnalysis = function () {
                $layer.loading();
                $timeout(function () {
                    vm.analysis = true;
                    $layer.close()
                }, 2000)
            };
            //订单画像
            vm.toDetail = function () {
                window.open($defaultConfig.current_uri + 'detail.html');
            }
        }])
}());