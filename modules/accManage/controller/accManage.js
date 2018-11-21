(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('accManageController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.regular = {
                phone: /^[1][3,4,5,7,8][0-9]{9}$/,
                password: /[\u4E00-\u9FA5]/g,
                email: /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            };
            vm.errors = {
                username: false,
                name: false,
                email: false,
                telephone: false,
                password: false,
            };
            //重置密码数据
            vm.userInfo = {
                userId: '',
                username: '',
                password: ''
            };
            vm.isAdd = true;//新增或修改
            //获取用户组列表
            $api.post('/user/findAllBackRole', function (result) {
                if (result.code === 0) {
                    vm.roleListPage = result.data;
                    vm.roleListPop = result.data;
                    for (var i = 0; i < vm.roleListPop.length; i++) {
                        vm.roleListPop[i].checked = false;
                    }
                }
            });
            //状态列表
            vm.statusList = [
                {
                    status: 0,
                    name: '冻结'
                },
                {
                    status: 1,
                    name: '激活'
                }];
            //查询条件
            vm.query = {
                username: '',
                name: '',
                telephone: '',
                roleId: null,
                status: null,
                pageNum: 1,
                pageSize: 10
            };
            //获取列表
            vm.getPagedDataAsync = function () {
                $api.post('/user/searchUserByCondition', angular.toJson(vm.query), function (result) {
                    if (result.code === 0) {
                        vm.list = result.data.list;
                        vm.query.pages = result.data.pages;
                    }
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].status === 0 ? vm.list[i].statusText = '冻结' : vm.list[i].statusText = '激活'
                    }
                });
            };
            //新增/修改账户数据
            vm.role = {
                username: '',
                name: '',
                email: '',
                telephone: '',
                password: '',
                roleList: [],
                type: 1
            };
//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //计算字符长度
            function sumChartCode(str) {
                if (str) {
                    return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
                }
                else {
                    return 0
                }
            }

            //查询
            vm.search = function () {
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //新增弹框
            vm.popShowAddRole = function () {
                vm.usernameNoEdit = false;
                for (var i = 0; i < vm.roleListPop.length; i++) {
                    vm.roleListPop[i].checked = false;
                }
                vm.popRoleTitle = '新增账户';
                vm.isAdd = true;
                vm.popShow = true;
                vm.role = {
                    username: '',
                    name: '',
                    email: '',
                    telephone: '',
                    password: '',
                    roleList: [],
                    type: 1
                };
            };

            /**
             * 修改账号
             * @param obj    当前整条数据
             */
            vm.popShowEditRole = function (obj) {
                vm.usernameNoEdit = true;
                vm.popRoleTitle = '修改账户';
                vm.isAdd = false;
                vm.popShow = true;
                vm.role.roleList = [];
                vm.role = {
                    username: obj.username,
                    name: obj.name,
                    email: obj.email,
                    telephone: obj.telephone,
                    password: '',
                    roleList: obj.roleList,
                    type: 1,
                    id: obj.id
                };
                for (var i = 0; i < vm.roleListPop.length; i++) {
                    vm.roleListPop[i].checked = false;
                    for (var j = 0; j < vm.role.roleList.length; j++) {
                        if (vm.role.roleList[j].id == vm.roleListPop[i].id) {
                            vm.roleListPop[i].checked = true;
                        }
                    }
                }
            };
            //新增-修改账户
            vm.roleFun = function () {
                if (vm.isAdd) {
                    if (vm.role.username == '') {
                        return layer.msg('账号不能为空', {time: 1000});
                    } else {
                        $api.post('/user/isUsernameRegister', angular.toJson({username: vm.role.username}), function (result) {
                            if (result.code === 1) {
                                layer.msg(result.msg, {time: 1000});
                                vm.isUsernameRepeate = true;
                            }
                        });
                    }
                }
                if (vm.isUsernameRepeate) {
                    return false;
                }
                if (vm.role.name == '') {
                    return layer.msg('姓名不能为空', {time: 1000});
                }
                if (vm.role.email == '') {
                    return layer.msg('邮箱不能为空', {time: 1000});
                } else if (!vm.regular.email.test(vm.role.email)) {
                    return layer.msg('请输入正确的邮箱', {time: 1000});
                }
                if (vm.role.telephone == '') {
                    return layer.msg('联系方式不能为空', {time: 1000});
                } else if (!vm.regular.phone.test(vm.role.telephone)) {
                    return layer.msg('请输入正确的联系方式', {time: 1000});
                }
                if (vm.isAdd) {
                    if (vm.role.password == '') {
                        return layer.msg('密码不能为空', {time: 1000});
                    } else if (vm.regular.password.test(vm.role.password)) {
                        return layer.msg('不能输入中文', {time: 1000});
                    } else if (sumChartCode(vm.role.password) < 8 || sumChartCode(vm.role.password) > 20) {
                        return layer.msg('不能少于8位或多于20位', {time: 1000});
                    }
                }
                vm.role.roleList = [];
                for (var i = 0; i < vm.roleListPop.length; i++) {
                    if (vm.roleListPop[i].checked) {
                        vm.role.roleList.push({id: vm.roleListPop[i].id});
                    }
                }
                if (vm.role.roleList.length == 0) {
                    return layer.msg('请选择账号组', {time: 1000});
                }
                if (vm.isAdd) {
                    $api.post('/user/register', angular.toJson(vm.role), function (result) {
                        if (result.code == 0) {
                            vm.popShow = false;
                            vm.role = {
                                username: '',
                                name: '',
                                email: '',
                                telephone: '',
                                password: '',
                                roleList: [],
                                type: 1
                            };
                            layer.msg(result.msg, {time: 1000});
                            $timeout(function () {
                                vm.getPagedDataAsync();
                            }, 1200)
                        }
                    });
                } else {
                    $api.post('/user/updateUserInfo', angular.toJson(vm.role), function (result) {
                        if (result.code == 0) {
                            vm.popShow = false;
                            vm.role = {
                                username: '',
                                name: '',
                                email: '',
                                telephone: '',
                                password: '',
                                roleList: [],
                                type: 1
                            };
                            layer.msg(result.msg, {time: 1000});
                            $timeout(function () {
                                vm.getPagedDataAsync();
                            }, 1200)
                        }
                    });
                }
            };
            /**
             * 冻结账号
             * @param id    当前数据id
             */
            vm.disableUser = function (id,username) {
                $api.post('/user/disableUser', angular.toJson({id: id,username:username}), function (result) {
                    if (result.code === 0) {
                        layer.msg(result.msg, {time: 1000});
                        $timeout(function () {
                            vm.getPagedDataAsync();
                        }, 1200)
                    }
                });
            };
            /**
             * 激活账户
             * @param id    当前数据id
             */
            vm.enableUser = function (id) {
                $api.post('/user/enableUser', angular.toJson({id: id}), function (result) {
                    if (result.code === 0) {
                        layer.msg(result.msg, {time: 1000});
                        $timeout(function () {
                            vm.getPagedDataAsync();
                        }, 1200)
                    }
                });
            };
            //重置密码弹出框
            vm.resetPasswordPop = function (obj) {
                vm.popPasswordShow = true;
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
                        vm.popPasswordShow = false;
                        layer.msg(result.msg, {time: 1000});
                    }
                });
            };
            //清除用记提交信息
            vm.clearUserInfo = function () {
                vm.popPasswordShow = false;
                vm.userInfo = {
                    username: '',
                    userId: '',
                    password: ''
                }
            };
        }])
}());