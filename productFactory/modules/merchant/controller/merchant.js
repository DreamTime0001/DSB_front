(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('merchantController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$cookies', '$stateParams', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $cookies, $stateParams) {
            var vm = this;
            vm.ids = [];
            vm.user = JSON.parse(localStorage.getItem('user'));
            // if(vm.user){
            //     if(vm.user.token){
            //         $state.go('productFactoryList');
            //     }
            // }
            //获取所有商户类型
            $api.get('/v1/tb/product/productIdCard', function (result) {
                if (result.code == 0) {
                    vm.merchantList = result.data;
                    for (var i = 0; i < vm.merchantList.length; i++) {
                        vm.merchantList[i].checked = false;
                    }
                }
            });
            //跳转产品包列表
            vm.toList = function () {
                for (var i = 0; i < vm.merchantList.length; i++) {
                    if (vm.merchantList[i].checked == true) {
                        vm.ids.push(vm.merchantList[i].id);
                    }
                }
                if (vm.ids.length == 0) {
                    return layer.msg('请选择一个商户类型', {time: 1000});
                }
                localStorage.removeItem('ids');
                localStorage.setItem('ids', JSON.stringify(vm.ids));
                $state.go('productFactoryList');
            }
        }])
}());