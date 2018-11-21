(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('imperfectInfoController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer) {
            var vm = this;
            vm.regular = {
                phoneReg: /^[1][3,4,5,7,8][0-9]{9}$/,
                sourceReg: /^[A-Z]{6}$/,
                emailReg: /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
                password: /[\u4E00-\u9FA5]/g
            };

            //计算字符长度
            function sumChartCode(str) {
                if (str) {
                    return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
                }
                else {
                    return 0
                }
            }

            //重置密码数据
            vm.userInfo = {
                userId: '',
                username: '',
                password: ''
            };
            vm.localQuery = JSON.parse(localStorage.getItem('imperfectInfo'));
            //获取查询条件
            if (vm.localQuery) {
                vm.query = vm.localQuery;
            } else {
                vm.query = {
                    username:"",
                    pageNum: 1,
                    pageSize: 10,
                    url:'imperfectInfo'
                };
            }
            //获取列表
            vm.getPagedDataAsync = function () {
                $api.post('/user/imperfectUsers', angular.toJson(vm.query), function (result) {
                    if (result.code === 0) {
                        vm.list = result.data.list;
                        vm.query.pages = result.data.pages;
                    }
                });
            };

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //查询
            vm.search = function () {
                localStorage.setItem('imperfectInfo', JSON.stringify(vm.query));
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //跳转修改页
            vm.toEditPage = function (id) {
                $state.go('businessEdit', {id: id});

            };
            //重置密码弹出框
            vm.resetPasswordPop = function (obj) {
                vm.popShow = true;
                vm.userInfo.userId = obj.id;
                vm.userInfo.username = obj.username;
            };
            //确认重置密码
            vm.resetPassword = function () {
                if (vm.userInfo.password == '') {
                    return layer.msg('密码不能为空！', {time: 1000});
                } else if (vm.regular.password.test(vm.userInfo.password)) {
                    return layer.msg('密码不能输入中文！', {time: 1000});
                } else if (sumChartCode(vm.userInfo.password) < 8 || sumChartCode(vm.userInfo.password) > 20) {
                    return layer.msg('密码不能少于8位或多于20位！', {time: 1000});
                }
                console.log(vm.userInfo);
                $api.post('/company/resetPassword', angular.toJson(vm.userInfo), function (result) {
                    if (result.code === 0) {
                        vm.popShow = false;
                        layer.msg(result.msg, {time: 1000});
                    }
                });
            };
            //修改
            vm.toPerfect = function (username,id) {
                localStorage.removeItem('currentUsername');
                localStorage.removeItem('currentUserId');
                localStorage.setItem('currentUsername', username);
                localStorage.setItem('currentUserId', id);
                $state.go('businessAdd');
            };
            //清除用记提交信息
            vm.clearUserInfo = function () {
                vm.popShow = false;
                vm.userInfo = {
                    username: '',
                    userId: '',
                    password: ''
                }
            };
        }])

}());