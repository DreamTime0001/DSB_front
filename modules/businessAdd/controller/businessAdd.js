(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('businessAddController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$location', '$anchorScroll', '$stateParams', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $location, $anchorScroll, $stateParams) {
            var vm = this;
            vm.usernameIsRepeat = true;//手机号是否存在
            vm.isSourceRepeat = true;//source是否存在
            vm.importId = '';//进口id
            vm.exportId = '';//出口id
            vm.importList = [];
            vm.exportList = [];
            vm.isSubmit = false;
            vm.completeCompany = {
                isImport: [],
                isExport: [],
                isAddUser: {
                    username: '',
                    password: ''
                },
                company: {
                    id: '',
                    userId: '',
                    source: '',
                    companyName: '',
                    contactName: '',
                    contactPhone: '',
                    email: '',
                    hearDsb: 0,
                    businessRefer: '',
                    eChain: '',
                    businessName: '',
                    isBatch: 0
                }
            };
            vm.currentUsername = localStorage.getItem('currentUsername');
            vm.currentUserId = localStorage.getItem('currentUserId');
            if (vm.currentUsername) {
                vm.completeCompany.isAddUser.username = vm.currentUsername;
                vm.completeCompany.company.userId = vm.currentUserId;
                vm.isAdd = true;
                vm.usernameIsRepeat = false;
            } else {
                vm.isAdd = false;
            }
            //得知豆沙包来源
            vm.hearDsbList = [
                {
                    id: 0,
                    name: '无'
                },
                {
                    id: 1,
                    name: '豆沙包商务人员推荐'
                },
                {
                    id: 2,
                    name: '第三方推荐'
                }
            ];
            //海外电商
            vm.companyTypeList = [
                {
                    id: 0,
                    name: '海外电商'
                },
                {
                    id: 1,
                    name: '跨境电商'
                },

                {
                    id: 2,
                    name: '转运公司'
                },

                {
                    id: 3,
                    name: '清关公司'
                },

                {
                    id: 4,
                    name: '物流公司'
                },

                {
                    id: 5,
                    name: '卖家'
                },

                {
                    id: 6,
                    name: '供应链服务'
                },

                {
                    id: 7,
                    name: '保税区'
                },

                {
                    id: 8,
                    name: 'ERP、物流系统服务平台'
                },

                {
                    id: 9,
                    name: '三方支付'
                },
                {
                    id: 10,
                    name: '其他'
                }
            ];
            vm.regular = {
                phoneReg: /^[1][3,4,5,7,8][0-9]{9}$/,
                sourceReg: /^[A-Z]{6}$/,
                emailReg: /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
                password: /[\u4E00-\u9FA5]/g
            };
            vm.addProductObj = {
                productId: "",
                source: ''
            };
            //获得焦点
            vm.getFocus = function (id) {
                $location.hash(id);
                $anchorScroll();
                $('#' + id).focus();
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

            /**
             * 加入商户类型id
             * @param type    0-进口 1-出口
             *@param id       所选中的id
             */
            vm.pushId = function (type, id) {
                for (var i = 0; i < vm.companyTypeList.length; i++) {
                    if (id == vm.companyTypeList[i].id) {
                        vm.temp = {
                            id: vm.companyTypeList[i].id,
                            name: vm.companyTypeList[i].name
                        }
                    }
                }
                if (type === 0) {
                    if (vm.importList.length == 0) {
                        vm.importList.push(vm.temp);
                    } else {
                        vm.importHasId = false;
                        for (i in vm.importList) {
                            if (vm.temp.id === vm.importList[i].id) {
                                return vm.importHasId = false;
                            } else {
                                vm.importHasId = true;
                            }
                        }
                        if (vm.importHasId) {
                            vm.importList.push(vm.temp);
                        }
                    }
                } else if (type === 1) {
                    if (vm.exportList.length == 0) {
                        vm.exportList.push(vm.temp);
                    } else {
                        vm.exportHasId = false;
                        for (i in vm.exportList) {
                            if (vm.temp.id === vm.exportList[i].id) {
                                return vm.exportHasId = false;
                            } else {
                                vm.exportHasId = true;
                            }
                        }
                        if (vm.exportHasId) {
                            vm.exportList.push(vm.temp);
                        }
                    }
                }
            };
            /**
             * 删除用户类型
             * @param type    0-进口 1-出口
             *@param index     数组下标
             */
            vm.deleteCompany = function (type, index) {
                if (type == 0) {
                    vm.importList.splice(index, 1);
                } else if (type == 1) {
                    vm.exportList.splice(index, 1);
                }
            };
            //绑定豆沙包商务
            $api.get('/company/getBusinessNameList/7', function (result) {
                if (result.code == 0) {
                    vm.roleList = result.data;
                }
            });
//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //判断手机号是否重复
            vm.isTelephone = function () {
                if (vm.completeCompany.isAddUser.username != "") {
                    $api.post('/user/isUsernameRegister', angular.toJson({username: vm.completeCompany.isAddUser.username}), function (result) {
                        if (result.code === 0) {
                            vm.usernameIsRepeat = false;
                        } else {
                            return layer.msg(result.msg, {time: 1000});
                            vm.usernameIsRepeat = true;
                        }
                    });
                }
            };
            // 判断商户识别码是否重复
            vm.isSource = function () {
                if (vm.completeCompany.company.source != "" && vm.regular.sourceReg.test(vm.completeCompany.company.source)) {
                    $api.post('/company/isSource', angular.toJson({source: vm.completeCompany.company.source}), function (result) {
                        if (result.code === 0) {
                            vm.isSourceRepeat = false;
                        } else {
                            vm.isSourceRepeat = true;
                            return layer.msg(result.msg, {time: 1000});
                        }
                    })
                }
            };
            // 提交
            vm.submit = function () {
                if (vm.completeCompany.company.companyName == '') {
                    return layer.msg('商户名称不能为空！', {time: 1000});
                }
                if (vm.completeCompany.company.source == "") {
                    return layer.msg('商户识别码不能为空！', {time: 1000});
                } else if (!vm.regular.sourceReg.test(vm.completeCompany.company.source)) {
                    return layer.msg('商户识别码需为六位大写字母！', {time: 1000});
                }
                if (vm.completeCompany.isAddUser.username == "") {
                    return layer.msg('登录手机号不能为空！', {time: 1000});
                } else if (!vm.regular.phoneReg.test(vm.completeCompany.isAddUser.username)) {
                    return layer.msg('请输入正确的登录手机号！', {time: 1000});
                }
                if(vm.isAdd == false){
                    if (vm.completeCompany.isAddUser.password == '') {
                        return layer.msg('密码不能为空！', {time: 1000});
                    } else if (vm.regular.password.test(vm.completeCompany.isAddUser.password)) {
                        return layer.msg('密码不能输入中文！', {time: 1000});
                    } else if (sumChartCode(vm.completeCompany.isAddUser.password) < 8 || sumChartCode(vm.completeCompany.isAddUser.password) > 20) {
                        return layer.msg('密码不能少于8位或多于20位！', {time: 1000});
                    }
                }
                if (vm.completeCompany.company.contactName == "") {
                    return layer.msg('联系人不能为空！', {time: 1000});
                }
                if (vm.completeCompany.company.contactPhone == "") {
                    return layer.msg('联系电话不能为空！', {time: 1000});
                }else if(!vm.regular.phoneReg.test(vm.completeCompany.company.contactPhone)){
                    return layer.msg('联系电话格式不正确！', {time: 1000});
                }
                if (vm.completeCompany.company.email == "") {
                    return layer.msg('邮箱不能为空！', {time: 1000});
                } else if (!vm.regular.emailReg.test(vm.completeCompany.company.email)) {
                    return layer.msg('请输入正确的邮箱！', {time: 1000});
                }
                if (vm.importList.length == 0 && vm.exportList.length == 0) {
                    return layer.msg('请选择进口方式或出口方式！', {time: 1000});
                }
                if (vm.completeCompany.company.hearDsb == 1) {
                    if (vm.completeCompany.company.businessRefer == "") {
                        return layer.msg('请填写豆沙包商务对接人！', {time: 1000});
                    }
                }
                if (vm.completeCompany.company.hearDsb == 2) {
                    if (vm.completeCompany.company.businessRefer == "") {
                        return layer.msg('请填写第三方来源 ！', {time: 1000});
                    }
                }
                if (vm.completeCompany.company.businessName == "") {
                    return layer.msg('请绑定绑定豆沙包商务 ！', {time: 1000});
                }
                if (vm.completeCompany.company.eChain == "") {
                    return layer.msg('eChain地址不能为空 ！', {time: 1000});
                }
                if (vm.usernameIsRepeat) {
                    return layer.msg('手机号已存在 ！', {time: 1000});
                }
                if (vm.isSourceRepeat) {
                    return layer.msg('商户识别码已存在 ！', {time: 1000});
                }
                for (var i = 0; i < vm.importList.length; i++) {
                    vm.completeCompany.isImport.push(vm.importList[i].id);
                }
                for (var i = 0; i < vm.exportList.length; i++) {
                    vm.completeCompany.isExport.push(vm.exportList[i].id);
                }
                $api.post('/company/companyProductOperate', angular.toJson(vm.completeCompany), function (result) {
                    if (result.code === 0) {
                        layer.msg(result.msg, {time: 1000});
                        $timeout(function () {
                            if (vm.isAdd) {
                                $state.go('imperfectInfo');
                            } else {
                                $state.go('businessManage');
                            }
                        }, 1200);
                        vm.list = result.data.list;
                    } else if (result.code === 1) {
                        return layer.msg(result.msg, {time: 1000});
                    }
                })
            };
            // 新增产品提交
            vm.addNewProSubmit = function () {
                vm.addProductObj.source = vm.completeCompany.company.source;
                $api.post('/company/bindCompanyProduct', angular.toJson(vm.addProductObj), function (result) {
                    if (result.code == 0) {
                        vm.addIdPop = false;
                        vm.addProductObj.productId = null;
                        layer.msg(result.msg, {time: 1000});
                        vm.list = result.data;
                    } else {
                        return layer.msg(result.msg, {time: 1000});
                    }
                })
            };
            //删除
            vm.deleteProduct = function (id, index) {
                layer.confirm('确定要删除吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    layer.closeAll();
                    $api.post('/product/del_product/' + id, function (result) {
                        if (result.code == 0) {
                            vm.list.splice(index, 1);
                            layer.msg(result.msg, {
                                time: 1000
                            });
                        }
                    });
                })
            };
        }])
}());