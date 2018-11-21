(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('productPackageManageController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            localStorage.removeItem('productPackageManage');
            vm.localQuery = JSON.parse(localStorage.getItem('productPackageManage'));
            //获取查询条件
            if (vm.localQuery) {
                vm.query = vm.localQuery;
            } else {
                vm.query = {
                    id: null,
                    productName: '',
                    productType: null,
                    pageNum: 1,
                    pageSize: 10,
                    salerLine: '',
                    url:'productPackageManage'
                };
            }
            vm.popShow = false;//售价系数弹框默认不显示
            vm.notisAgree = function () {
                vm.popShow = false;
            };
            vm.isAgree = function () {
                vm.popShow = true;
            };
            //售价系数默认选中状态
            vm.isSelectAll = false;
            // 售价系数弹框售价系数设置
            vm.updateSaleRatio = {
                "ids": [],
                "saleRatio": ''
            };
            vm.RatioList = [];
            //产品线数据
            vm.productLineList = [
                {
                    id: 1,
                    name: "物流保障类"
                },
                {
                    id: 2,
                    name: "产品保障类"
                },
                {
                    id: 3,
                    name: "售后保障类"
                },
                {
                    id: 4,
                    name: "信用保障类"
                },
                {
                    id: 5,
                    name: "场景定制类"
                },
                {
                    id: 6,
                    name: "卖家保障类"
                },
                {
                    id: 7,
                    name: "其他产品线类"
                }
            ];
            //售价系数列表
            vm.getRaticList = function () {
                $api.post('/tb/productWrap/saleRatioList', function (result) {
                    if (result.code === 0) {
                        vm.RatioList = result.data;
                        for(var i = 0; i < vm.RatioList.length;i++) {
                            vm.RatioList[i].toggle = false;
                        }
                    }
                });
            };
            vm.getRaticList();
            //售价系数设置
            vm.setSaleRatio = function () {
                if(vm.updateSaleRatio.saleRatio == '') {
                    layer.msg('售价系数不能为空',{ time: 1000 });
                    return false;
                }
                if(vm.updateSaleRatio.saleRatio < 0.1 || vm.updateSaleRatio.saleRatio > 10) {
                    layer.msg('该系数应在[0.1,10]之间',{ time: 1000 });
                    return false;
                }
                // for(var i = 0;i<vm.RatioList.length;i++) {
                //     if(vm.RatioList[i].toggle == false) {
                //         console.log(vm.RatioList[i]);
                //         layer.msg('请至少选择一个产品包',{ time: 1000 });
                //         return false;
                //     }
                // }
                for(var j = 0;j<vm.RatioList.length;j++) {
                    if(vm.RatioList[j].toggle == true) {
                        console.log('vm.RatioList[j].toggle===',vm.RatioList[j].toggle)
                        vm.updateSaleRatio.ids.push(vm.RatioList[j].id);
                    }
                }
                if (vm.updateSaleRatio.ids.length == 0) {
                    layer.msg('请至少选择一个产品包',{ time: 1000 });
                    return false;
                }
                $api.post('/tb/productWrap/updateSaleRatio', angular.toJson(vm.updateSaleRatio), function (result) {
                    if (result.code === 0) {
                        vm.getRaticList();
                        vm.getPagedDataAsync();
                        vm.updateSaleRatio = {
                            "ids": [],
                            "saleRatio": ''
                        };
                    }
                });
                vm.isSelectAll = false;
            };
            //全选
            vm.selectAll = function() {
                if (vm.isSelectAll) {
                    for (var i = 0; i < vm.RatioList.length; i++) {
                        vm.RatioList[i].toggle = true;
                    }
                } else {
                    for (var i = 0; i < vm.RatioList.length; i++) {
                        vm.RatioList[i].toggle = false;
                    }
                }
            };
            //单选
            vm.singleSelect = function() {
                var num = 0;
                for (var i = 0; i < vm.RatioList.length; i++) {
                    if (vm.RatioList[i].toggle) {
                        num++;
                    }
                }
                if (num == vm.RatioList.length) {
                    vm.isSelectAll = true;
                } else {
                    vm.isSelectAll = false;
                }
            };
            //获取列表
            vm.getPagedDataAsync = function () {
                $api.post('/tb/productWrap/productWrapList', angular.toJson(vm.query), function (result) {
                    if (result.code === 0) {
                        vm.list = result.data.list;
                        for (var i = 0; i < vm.list.length; i++) {
                            vm.list[i].status == 1 ? vm.list[i].status = true : vm.list[i].status = false;
                            if (vm.list[i].productType == 0) {
                                vm.list[i].productTypeText = '费率';
                            } else if (vm.list[i].productType == 1) {
                                vm.list[i].productTypeText = '定价';
                            } else if (vm.list[i].productType == 2) {
                                vm.list[i].productTypeText = '份数';
                            } else if (vm.list[i].productType == 3) {
                                vm.list[i].productTypeText = '组合';
                            }else if (vm.list[i].productType == 4) {
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
                localStorage.setItem('productManage', JSON.stringify(vm.query));
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //切换状态
            vm.changeStatus = function (status,id) {
                // debugger;
                var _status = 0;
                status == true ? _status = 1 : _status = 0;
                $api.post('/tb/productWrap/status',angular.toJson({id:id,flag:_status}), function (result) {
                    layer.msg(result.msg, {time: 1000});
                    vm.query.pageNum = 1;
                    vm.getPagedDataAsync();
                })
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
            vm.toEdit = function (id) {
                $state.go('productPackageManageEdit', {id: id});
            }
        }])
}());