(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('largeRechargeDetailsController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$cookies',function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer,$cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //定义可选充值金额
            vm.baseInfo = {
                billNo:$cookies.get("billNo"),
                billAmount1:$cookies.get("billAmount1"),
                payment:"银行转账",
                remitIdentityCode:$cookies.get("remitIdentityCode"),
                accountName:"豆沙包科技（上海）有限公司",
                ds8BankAccountId:"694136979",
                ds8BankAccountName:"中国民生银行上海新泾支行"
            };

            //点击复制
            vm.copyCode = function(){
                document.getElementsByClassName("largeInput")[0].select();
                if(document.execCommand("copy")){
                    layer.msg("汇款识别码复制成功！",{time:1000});
                }
            };

            vm.closeCookies = function(){
                $cookies.remove("billNo");
                $cookies.remove("billAmount1");
                $cookies.remove("remitIdentityCode");
                $state.go("largeRecharge");
            }

        }])
}());