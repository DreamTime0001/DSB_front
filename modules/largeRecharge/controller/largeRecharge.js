(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('largeRechargeController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$cookies', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $cookies) {
            var vm = this;
            vm.user = JSON.parse(localStorage.getItem('user'));
            $timeout(function () {
                initMenu();
            }, 100);

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //定义可选充值金额
            vm.chooseMoneyBox = [
                {
                    id: 3000,
                    amount: "3000元"
                },
                {
                    id: 5000,
                    amount: "5000元"
                },
                {
                    id: 10000,
                    amount: "10000元"
                },
                {
                    id: 30000,
                    amount: "30000元"
                },
                {
                    id: 50000,
                    amount: "50000元"
                }
            ];
            vm.subAccountInfo = {
                t: "",
                chargeCurrency: 156,
                chargeAmount: "",
                paymentCategoryCode: "remit"
            };
            vm.subAccountBalance = 0;//余额
            vm.chooseMoneyBox.id = 3000;//设置默认样式
            // 点击选择充值金额
            vm.chooseMoney = function (id) {
                vm.chooseMoneyBox.id = id;
                vm.subAccountInfo.chargeAmount = vm.chooseMoneyBox.id;
            };
            // 验证充值金额
            vm.checkMoney = function () {
                vm.valueReg = /^(?:[\+\-]?\d+(?:\.\d+)?)?$/g;
                if (vm.subAccountInfo.chargeAmount == "") {
                    layer.msg("充值金额不能为空！", {time: 2000});
                    return false;
                } else if (vm.valueReg.test(vm.subAccountInfo.chargeAmount)) {
                    if (vm.subAccountInfo.chargeAmount < 3000) {
                        layer.msg("充值金额应不小于3000！", {time: 2000});
                        return false;
                    }
                } else {
                    layer.msg("请输入正确的金额！", {time: 2000});
                    return false;
                }
                return true;
            };
            //获取ticket
            $api.post('/account/ssoService', function (result) {
                if (result.code == 0) {
                    vm.ticket = result.data.ticket;
                    //余额
                    $api.post('/account/info', angular.toJson({t: vm.ticket}), function (res) {
                        vm.subAccountBalance = (res.data.info.subAccountInfos[0].subAccountBalance * 100 + res.data.info.subAccountInfos[0].subAccountWithdrawBalance * 100 ) / 100;//余额
                    });
                    // 充值
                    vm.recharge = function () {
                        if (vm.checkMoney()) {
                            vm.subAccountInfo.t = vm.ticket;
                            $api.post('/account/payment', angular.toJson(vm.subAccountInfo), function (res) {
                                if (res.code === 0) {
                                    $cookies.put('billNo', res.data.billNo);
                                    $cookies.put('billAmount1', res.data.billAmount1);
                                    $cookies.put('remitIdentityCode', res.data.remitIdentityCode);
                                    $state.go("largeRechargeDetails");
                                }
                            })
                        }
                    };
                } else {
                    return layer.msg(result.data.message, {time: 1000});
                }
            });
        }])
}());