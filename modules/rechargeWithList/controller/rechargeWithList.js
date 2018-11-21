(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('rechargeWithListController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            //查询条件
            vm.query = {
                pageNum: 1,
                pageSize: 10,
                token: ''
            };

            //获取ticket
            $api.post('/account/ssoService', function (result) {
                if (result.code == 0) {
                    vm.query.token = result.data.ticket;
                    //获取列表
                    vm.getPagedDataAsync = function () {
                        $api.post('/account/getAccountRecords', angular.toJson(vm.query), function (result) {
                            if (result.code === 0) {
                                vm.list = result.data.list;
                                for (var i = 0; i < vm.list.length; i++) {
                                    switch(vm.list[i].billStatus){
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
                    vm.getPagedDataAsync();
                } else {
                    return layer.msg(result.msg, {time: 1000});
                }
            });

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
        }])
}());