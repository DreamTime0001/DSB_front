(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('customerInsureDetailsController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$stateParams', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $stateParams) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//

            // 获取订单详情
            $api.get('/order/orderList?productId=' + $stateParams.productId + '&id=' + $stateParams.id, function (result) {
                if (result.code == 0) {
                    vm.list = result.data[0];
                    vm.list.productAmount = vm.list.productAmount / 100;
                    vm.list.goodsValue = vm.list.goodsValue / 100;
                    vm.list.effectiveDate = vm.list.expressTime + vm.list.customerOrderDate* 24 * 3600 * 1000;
                    vm.list.endTime = vm.list.expressTime + (vm.list.productDay +vm.list.customerOrderDate) * 24 * 3600 * 1000;
                    vm.productType = vm.list.productType;
                    if (vm.productType == 3) {
                        vm.periodList = vm.list.periodList;
                        var days = vm.list.currentTime - vm.list.expressTime;
                        vm.time = parseInt(days / (1000 * 60 * 60 * 24));
                    }
                    for (var x  in vm.periodList) {
                        vm.periodList[x].dashDay = vm.periodList[x].productPeriod - vm.time;
                        if (vm.periodList[x].dashDay < 0) {
                            vm.periodList[x].dashDay = 0;
                        }
                    }
                } else {
                    layer.msg(result.msg, {time: 1000});
                }
            })
        }])
}());