(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('personalCenterController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$cookies', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.user = JSON.parse(localStorage.getItem('user'));
            vm.userInfo = {
                id: vm.user.userId,
                password: '',
                oldPassword: ''
            };
//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //获取个人基本信息
            $api.get('/merchant/merchantCenter?id=' + vm.user.userId, function (result) {
                if(result.code === 0){
                    vm.selfInfo = result.data[0];
                }
            });
            //计算字符长度
            function sumChartCode(str) {
                if (str) {
                    return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
                }
                else {
                    return 0
                }
            }


            //修改密码
            vm.changePassword = function () {
                vm.passwordReg = /[\u4E00-\u9FA5]/g;
                // 判断原密码
                if(vm.userInfo.oldPassword == ""){
                    layer.msg("原密码不能为空！", {time: 1000});
                    return false;
                }
                // 判断新密码
                if (vm.userInfo.password == '') {
                    layer.msg("新密码不能为空！", {time: 1000});
                    return false;
                } else if (vm.passwordReg.test(vm.userInfo.password)) {
                    layer.msg("新密码不能输入中文！", {time: 1000});
                    return false;
                } else if (sumChartCode(vm.userInfo.password) < 8 || sumChartCode(vm.userInfo.password) > 20) {
                    layer.msg("新密码不能少于8位或多于20位！", {time: 1000});
                    return false;
                }
                // 判断确认密码
                if(vm.userInfo.password != vm.userInfo.passwordAgain){
                    layer.msg("新密码与确认密码不一致！", {time: 1000});
                    return false;
                }
                $api.post('/merchant/merchantPwd', angular.toJson(vm.userInfo), function (result) {
                    if (result.code == 0) {
                        layer.msg(result.msg, {time: 1000});
                        vm.popShow = false;
                        $timeout(function () {
                            vm.logout();
                        },1500);
                    }else{
                        layer.msg(result.msg, {time: 1000});
                    }
                });
            };
            //登出
            vm.logout = function () {
                $api.post('/user/logout', function (result) {
                    localStorage.clear();//清除缓存
                    var getCookies = $cookies.getAll();//获取所有cooikes的值
                    //循环删除
                    angular.forEach(getCookies, function (v, k) {
                        $cookies.remove(k);
                    });
                    window.location.href = $defaultConfig.current_uri + 'login.html';
                });
            };

        }])
}());