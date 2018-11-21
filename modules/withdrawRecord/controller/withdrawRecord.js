(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('withdrawRecordController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$cookies', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.user = JSON.parse(localStorage.getItem('user'));
            //查询条件
            vm.query = {
                pageNum: 1,
                pageSize: 10,
                createMinDate: '',
                createMaxDate: '',
                billStatus: '',
                billNo: '',
                merchantName: '',
                source: ''
            };
            // 存储商户信息
            vm.companyNameArr = [];
            //获取所有商户信息
            if (vm.user) {
                if (vm.user.token) {
                    $http({
                        method: "POST",
                        url: $defaultConfig.app_uri + '/company/getCompanyListName',
                        headers: {'token': vm.user.token},
                    }).success(function (result) {
                        vm.businessArry = result.data;
                        for (var i in vm.businessArry) {
                            vm.companyNameArr.push(vm.businessArry[i].companyName);
                        }
                        var autoComplete = new AutoComplete("input", "auto", vm.companyNameArr);
                        document.getElementById("input").onkeyup = function (event) {
                            autoComplete.start(event);
                        }
                    }).error(function (result) {
                    });
                }
            }
            //提现状态列表
            vm.statusList = [
                {
                    id: '0',
                    name: '待付款'
                },
                {
                    id: '1',
                    name: '申请提现'
                },
                {
                    id: '2',
                    name: '转账过程中'
                },
                {
                    id: '97',
                    name: '过期未支付'
                },
                {
                    id: '98',
                    name: '交易取消'
                },
                {
                    id: '99',
                    name: '交易失败'
                },
                {
                    id: '100',
                    name: '交易成功'
                },
                {
                    id: '1000',
                    name: '交易关闭'
                }
            ];
            //日期初始化
            var toDay = new Date();
            //开始时间
            initDate('#createMinDate', 'yyyy-mm-dd', 2, function (date) {
                $('#createMaxDate').datetimepicker('setStartDate', date);
            });
            //结束时间
            initDate('#createMaxDate', 'yyyy-mm-dd', 2, function (date) {
                $('#createMinDate').datetimepicker('setEndDate', date);
            });
            //获取列表
            vm.getPagedDataAsync = function () {
                $api.post('/account/getWithdrawBillResult', angular.toJson(vm.query), function (result) {
                    if (result.code === 0) {
                        vm.list = result.data.list;
                        for (var i = 0; i < vm.list.length; i++) {
                            vm.list[i].sourceBillNo == undefined ? vm.list[i].hasSource = false : vm.list[i].hasSource = true;
                            vm.list[i].isRetried == 0 ? vm.list[i].isRetriedText = '初始订单' : vm.list[i].isRetriedText = '已重交订单';
                            switch (vm.list[i].billStatus) {
                                case 0:
                                    vm.list[i].statusText = '待付款';
                                    break;
                                case 1:
                                    vm.list[i].statusText = '申请提现';
                                    break;
                                case 2:
                                    vm.list[i].statusText = '转账过程中';
                                    break;
                                case 97:
                                    vm.list[i].statusText = '过期未支付';
                                    break;
                                case 98:
                                    vm.list[i].statusText = '交易取消';
                                    break;
                                case 99:
                                    vm.list[i].statusText = '交易失败';
                                    break;
                                case 100:
                                    vm.list[i].statusText = '交易成功';
                                    break;
                                case 1000:
                                    vm.list[i].statusText = '交易关闭';
                                    break;
                            }
                        }
                        vm.query.pages = result.data.pages;
                    }
                });
            };

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //查询
            vm.search = function () {
                vm.query.merchantName = $('#input').val();
                if (vm.query.merchantName == "") {
                    vm.query.source = "";
                } else if (!in_arr(vm.query.merchantName, vm.companyNameArr)) {
                    vm.list = [];
                    return;
                } else {
                    for (var i in vm.businessArry) {
                        if (vm.query.merchantName === vm.businessArry[i].companyName) {
                            vm.query.source = vm.businessArry[i].source;
                        }
                    }
                }

                // localStorage.setItem('businessOrder', JSON.stringify(vm.query));
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //重置
            vm.clear = function () {
                vm.query.createMinDate = '';
                vm.query.createMaxDate = '';
                vm.query.billStatus = '';
                vm.query.billNo = '';
                vm.query.merchantName = '';
                vm.query.source = '';
                vm.query.pageNum = 1;
                vm.query.pageSize = 10;
            };
            //重新发起付款
            vm.againPay = function (billNo) {
                layer.confirm('确定要付款吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    layer.closeAll();
                    $api.get('/account/reWithdraw/' + billNo, function (result) {
                        if (result.code == 0) {
                            $timeout(function () {
                                vm.getPagedDataAsync();
                            }, 1200);
                        }
                        layer.msg(result.msg, {
                            time: 1000
                        });
                    });
                })
            };
            //显示原始订单号
            vm.showSource = function (source, e) {
                var id = e.target.id;
                layer.tips("原始流水号</br>" + source, '#' + id, {
                    tips: [1, '#000'],
                });
            };
            vm.tipClose = function () {
                layer.closeAll();
            };
        }])
}());