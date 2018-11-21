(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('claimOrderDetailsController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$stateParams', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $stateParams) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            $api.get('/apply/applyDetails?id=' + $stateParams.id + '&applyProductId=' + $stateParams.applyProductId + '&ticketNo=' + $stateParams.ticketNo, function (result) {
                if (result.code === 0) {
                    vm.list = result.data[0];
                    if (vm.list.productType == '3' || vm.list.productType == '4') {
                        vm.list.productShowId = vm.list.applyProductId + '_' + vm.list.applyProductCombinationId;
                        vm.list.productShowName = vm.list.productName + '_' + vm.list.groupProductName;
                    } else {
                        vm.list.productShowName = vm.list.productName;
                        vm.list.productShowId = vm.list.applyProductId;
                    }
                    vm.list.discountAmount = vm.list.discountAmount / 100;
                    vm.list.goodsValue = vm.list.goodsValue / 100;
                    vm.list.premium = vm.list.premium / 100;
                    vm.list.effectiveDate = vm.list.expressTime + vm.list.customerApplyDate* 24 * 3600 * 1000;
                    vm.list.expiryDate = vm.list.expressTime + (vm.list.productDay +vm.list.customerApplyDate) * 24 * 3600 * 1000;
                    vm.list.isShowApplyRemark = false;
                    for (var x in vm.list) {
                        if (vm.list.status == 2) {
                            vm.list.statusTxt = "初审";
                        } else if (vm.list.status == 6) {
                            vm.list.statusTxt = "复审";
                        } else if (vm.list.status == 11) {
                            vm.list.statusTxt = "待打款";
                            vm.list.isShowApplyRemark = true;
                        } else if (vm.list.status == 3) {
                            vm.list.statusTxt = "已打款";
                            vm.list.isShowApplyRemark = true;
                        } else if (vm.list.status == 4) {
                            vm.list.statusTxt = "驳回";
                            vm.list.isShowApplyRemark = true;
                        } else if (vm.list.status == 5) {
                            vm.list.statusTxt = "小额快审";
                        }
                    }
                }
            })
        }])
}());