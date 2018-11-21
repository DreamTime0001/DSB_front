(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('productFactoryOrderController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$cookies', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.toPayPop = false;
            vm.query = {
                pageNum: 1,
                pageSize: 10,
                isPay: null,
                pages: 0
            };
            vm.user = JSON.parse(localStorage.getItem('user'));
            vm.payInfo = {
                userName: vm.user.username,
                orderNo: '',
                orderAmount: ''
            };
            vm.getPagedDataAsync = function () {
                $api.post('/productfactory/tbOrderList', angular.toJson(vm.query), function (result) {
                    if (result.code == 0) {
                        vm.list = result.data.list;
                        vm.query.pages = result.data.pages;
                        for (var i = 0; i < vm.list.length; i++) {
                            vm.list[i].moreText = '详情';
                            vm.list[i].isPay == 3 ? vm.list[i].isPayText = '未支付' : vm.list[i].isPayText = '已支付';
                        }
                    }

                });
            };
            //前往产品工厂
            vm.toProductFactory = function () {
                window.location.href = $defaultConfig.current_uri + '/productFactory/pages.html#/productFactoryList.html';
            };
            //切换列表状态
            vm.changePay = function (status) {
                vm.query.isPay = status;
                vm.getPagedDataAsync();
            };
            //获取订单明细
            vm.getProductList = function (obj) {
                if (obj.moreText == '详情') {
                    $api.post('/productfactory/tbOrderDetailList', angular.toJson({orderNo: obj.orderNo}), function (result) {
                        if (result.code == 0) {
                            obj.productList = result.data.list;
                            for (var i = 0; i < obj.productList.length; i++) {
                                obj.productList[i].sum = (obj.productList[i].price * obj.productList[i].num).toFixed(2);
                            }
                        }
                    });
                    obj.moreText = '收起';
                } else {
                    obj.productList = [];
                    obj.moreText = '详情';
                }
            };
            //立即支付弹层
            vm.toPayPopShow = function (obj) {
                vm.toPayPop = true;
                vm.payInfo.orderAmount = obj.orderPrice;
                vm.payInfo.orderNo = obj.orderNo;
                $api.post('/company/getBalance', angular.toJson({username: vm.payInfo.userName}), function (res) {
                    if (res.code == 0) {
                        vm.ticket = res.data.ticket;
                        $api.post('/account/info', angular.toJson({t: vm.ticket}), function (res) {
                            if (res.code == 0) {
                                vm.payInfo.balance = (res.data.info.subAccountInfos[0].subAccountBalance * 100 + res.data.info.subAccountInfos[0].subAccountWithdrawBalance * 100) / 100;//余额
                            } else {
                                layer.msg(res.msg, {time: 1000});
                            }
                        });
                    }
                });
            };
            //确认支付
            vm.confirmToPay = function () {
                if (vm.payInfo.orderAmount > vm.payInfo.balance) {
                    return layer.msg('余额不足，请充值！', {time: 1000})
                }
                //支付
                $api.post('/tbpay/order', angular.toJson(vm.payInfo), function (result) {
                    if (result.code == 0) {
                        layer.msg(result.msg, {time: 1000});
                        vm.toPayPop = false;
                        $state.go('productFactoryPackage');
                    }
                });
            };
        }])
}());