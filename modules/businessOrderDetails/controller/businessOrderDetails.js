(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('businessOrderDetailsController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$stateParams', '$filter', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $stateParams, $filter) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.isPortStatus = '显示';
            vm.isPort = false;

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //订单画像
            vm.toDetail = function () {
                window.open($defaultConfig.current_uri + 'detail.html');
            };

            // 订单详情
            $api.get('/merchant/merchantOrderList?productId=' + $stateParams.productId + '&id=' + $stateParams.id, function (result) {
                if (result.code === 0) {
                    vm.list = result.data[0];
                    vm.list.originalAmount = vm.list.originalAmount / 100;
                    vm.list.productAmount = vm.list.productAmount / 100;
                    vm.list.goodsValue = vm.list.goodsValue / 100;
                    vm.list.effectiveDate = vm.list.expressTime + vm.list.customerOrderDate* 24 * 3600 * 1000;
                    vm.list.endTime = vm.list.expressTime + (vm.list.productDay +vm.list.customerOrderDate) * 24 * 3600 * 1000;
                    YQV5.trackSingleF1({
                        //必须，指定悬浮位置的元素ID。
                        YQ_ElementId:"expressNo",
                        //可选，指定查询结果宽度，最小为260px，默认为470px。
                        YQ_Width:470,
                        //可选，指定查询结果高度，最大为800px，默认为560px。
                        YQ_Height:560,
                        //可选，指定运输商，默认为自动识别。
                        YQ_Fc:"0",
                        //可选，指定UI语言，默认根据浏览器自动识别。
                        YQ_Lang:"zh-CN",
                        //必须，指定要查询的单号。
                        YQ_Num:vm.list.expressNo
                    });

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
                }
            })

            //订单画像显示隐藏
            vm.toggleShow = function () {
                if (vm.isPort) {
                    vm.isPort = false;
                    vm.isPortStatus = '显示';
                } else {
                    vm.isPort = true;
                    vm.isPortStatus = '隐藏';
                }
            };
        }])
}());