(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('productManageCompanyController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$cookies', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.user = JSON.parse(localStorage.getItem('user'));
            vm.localQuery = JSON.parse(localStorage.getItem('productManageCompany'));
            //获取查询条件
            if (vm.localQuery) {
                vm.query = vm.localQuery;
            } else {
                vm.query = {
                    productId: '',
                    companyName: '',
                    source: '',
                    productName: '',
                    productType: '',
                    pageNum: 1,
                    pageSize: 10,
                    url: 'productManageCompany'
                };
            }
            // 存储商户信息
            vm.companyNameArr = [];
            //获取商户列表
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
            //产品类型数据
            vm.productTypeList = [
                {
                    id: 0,
                    name: '费率'
                },
                {
                    id: 1,
                    name: '定价'
                },
                {
                    id: 2,
                    name: '份数'
                },
                {
                    id: 3,
                    name: '组合'
                },
                {
                    id: 4,
                    name: '组合费率'
                }
            ];
            //获取列表
            vm.getPagedDataAsync = function () {
                $api.post('/product/merchantProduct', angular.toJson(vm.query), function (result) {
                    if (result.code === 0) {
                        vm.list = result.data.list;
                        for (var i = 0; i < vm.list.length; i++) {
                            if (vm.list[i].productType == 0) {
                                vm.list[i].productTypeText = '费率';
                            } else if (vm.list[i].productType == 1) {
                                vm.list[i].productTypeText = '定价';
                            } else if (vm.list[i].productType == 2) {
                                vm.list[i].productTypeText = '份数';
                            } else if (vm.list[i].productType == 3) {
                                vm.list[i].productTypeText = '组合';
                            } else if (vm.list[i].productType == 4) {
                                vm.list[i].productTypeText = '组合费率';
                            }
                        }
                        vm.query.pages = result.data.pages;
                    }
                });
            };

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //查询
            vm.search = function () {
                vm.query.companyName = $('#input').val();
                if (vm.query.companyName == "") {
                    vm.query.source = "";
                } else if (!in_arr(vm.query.companyName, vm.companyNameArr)) {
                    vm.list = [];
                    return;
                } else {
                    for (var i in vm.businessArry) {
                        if (vm.query.companyName === vm.businessArry[i].companyName) {
                            vm.query.source = vm.businessArry[i].source;
                        }
                    }
                }
                localStorage.setItem('productManageCompany', JSON.stringify(vm.query));
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //删除
            vm.deleteProduct = function (id) {
                layer.confirm('确定要删除吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    layer.closeAll();
                    $api.post('/product/del_product/' + id, function (result) {
                        if (result.code == 0) {
                            layer.msg(result.msg, {
                                time: 1000
                            });
                            $timeout(function () {
                                vm.getPagedDataAsync();
                            }, 1200)
                        }
                    });
                })
            };
            //编辑
            vm.editProduct = function (id) {
                localStorage.removeItem('backId');
                $state.go('productManageEdit', {id: id});
            }
        }])
}());