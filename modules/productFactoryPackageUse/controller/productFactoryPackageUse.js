(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('productFactoryPackageUseController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$cookies', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $cookies) {
            var vm = this;
            vm.user = JSON.parse(localStorage.getItem('user'));
            vm.packageUseData = JSON.parse(localStorage.getItem('packageUseData'));
            vm.rules = [];
            //投保提交数据
            vm.orderApi = {
                userProductPackageId:'',
                source: vm.user.source,//商户标识
                productName: '',//产品名称
                productId: '',//产品id
                companyName: '',//商户名称
                phoneNo: '',//手机号
                idCard: '',//身份证号码
                expressNo: '',//物流单号
                expressTime: '',//物流发货日期
                receiverAddress: '',//收货地址
                purchasOrderNo: '',//购物网站订单号/海淘商品订单号
                shoppingSite: '',//购物网站
                goodsCategory: '',//商品列表
                premium: '',//保费
                name: '',//姓名
                shoppingTime: '',//购买日期
                loadingPort: '',//起运地
                destinationPort: '',//目的口岸
                expressChannel: '',//运输方式
                goodsValueDetail: '',//商品价值明细
                goodsValue: '',//商品价值
                goodsKind: '',//商品种类
                goodsAmount: '',//货物数量
                expressCompanyName: '',//物流公司名称
                receiverInfo: '',//收件人信息
                sendInfo: '',//寄件人信息
                receiverAddr: '',//收件人地址
                senderAddress: '',//寄件人地址
                sellerAccount: '',//卖家账号或登录名
                buyerAccount: '',//买家账号或登录名
                sex: '男',//性别
                type: 0,//前台投保
                packageProductList: [],
                productPackage: {}
            };
            if (vm.packageUseData) {
                //获取产品包信息
                $api.get('/productfactory/userProductPackage/' + vm.packageUseData.orderDetailNo + '/' + vm.packageUseData.id, function (result) {
                    if (result.code == 0) {
                        //获取规则
                        vm.ruleList = result.data.orderInsurance;
                        angular.forEach(vm.ruleList, function (obj) {
                            vm.rules[obj] = true;
                        });
                        vm.orderApi.packageProductList = result.data.packageProductList;
                        vm.orderApi.productPackage = result.data.productPackage;
                        vm.orderApi.userProductPackageId = result.data.userProductPackage.id;
                        vm.orderApi.loadingPort = result.data.userProductPackage.configV5Desc;
                        vm.orderApi.destinationPort = result.data.userProductPackage.configV6Desc;
                        vm.orderApi.expressChannel = result.data.productPackage.configV3Desc;
                        vm.orderApi.goodsKind = result.data.productPackage.configV1Desc;
                        vm.orderApi.goodsValue = result.data.productPackage.configV2Value;

                        for (var i = 0; i < vm.orderApi.packageProductList.length; i++) {
                            vm.orderApi.packageProductList[i].showName = vm.orderApi.packageProductList[i].productTemplateId + '-' + vm.orderApi.packageProductList[i].productName;
                        }
                    }
                });
            } else {
                layer.msg('获取产品包失败', {time: 1000});
            }
            //日期初始化
            var toDay = new Date();
            initDate('#expressTime', 'yyyy-mm-dd', 2, function () {
            });
            initDate('#shoppingTime', 'yyyy-mm-dd', 2, function () {
            });
            //获取source 商户姓名
            $api.get('/order/findCompanyBySource/' + vm.orderApi.source, function (result) {
                if (result.code == 0) {
                    vm.orderApi.companyName = result.data.company.companyName;
                } else {
                    layer.msg(result.msg, {time: 1000});
                }
            });


//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //校验数据
            vm.checkData = function (obj) {
                vm.phone = /^[1][3,4,5,7,8][0-9]{9}$/;
                vm.testNum = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
                vm.testInteger = /^\d+$/;
                if (vm.rules['姓名']) {
                    if (obj.name === '') {
                        layer.msg('请输入购买人姓名', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['手机号']) {
                    if (obj.phoneNo === '') {
                        layer.msg('请输入手机号', {time: 1000});
                        return false;
                    } else if (!vm.phone.test(obj.phoneNo)) {
                        layer.msg('请输入正确的手机号', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['身份证号码']) {
                    if (obj.idCard === '') {
                        layer.msg('请输入身份证号', {time: 1000});
                        return false;
                    } else if (!convertCardID(obj.idCard)) {
                        layer.msg('请输入正确的身份证号', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['起运地']) {
                    if (obj.loadingPort === '') {
                        layer.msg('请输入起运地', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['目的口岸']) {
                    if (obj.destinationPort === '') {
                        layer.msg('请输入目的口岸', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['物流单号']) {
                    if (obj.expressNo === '') {
                        layer.msg('请输入物流单号', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['物流发货日期']) {
                    if (obj.expressTime === '') {
                        layer.msg('请选择物流发货日期', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['收货地址']) {
                    if (obj.receiverAddress === '') {
                        layer.msg('请输入收货地址', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['运输方式']) {
                    if (obj.expressChannel === '') {
                        layer.msg('请输入运输方式', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['购物网站']) {
                    if (obj.shoppingSite === '') {
                        layer.msg('请输入购物网站', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['购买日期']) {
                    if (obj.shoppingTime === '') {
                        layer.msg('请输入购买日期', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['商品价值']) {
                    if (obj.goodsValue === '') {
                        layer.msg('请输入商品价值', {time: 1000});
                        return false;
                    } else if (!vm.testNum.test(obj.goodsValue)) {
                        layer.msg('请输入正确的商品价值', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['商品列表']) {
                    if (obj.goodsCategory === '') {
                        layer.msg('请输入商品列表', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['商品价值明细']) {
                    if (obj.goodsValueDetail === '') {
                        layer.msg('请输入商品价值明细', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['商品种类']) {
                    if (obj.goodsKind === '') {
                        layer.msg('请输入商品种类', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['保费']) {
                    if (obj.premium === '') {
                        layer.msg('请输入保费', {time: 1000});
                        return false;
                    } else if (!vm.testNum.test(obj.premium)) {
                        layer.msg('请输入正确的保费', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['购物网站订单号/海淘商品订单号']) {
                    if (obj.purchasOrderNo === '') {
                        layer.msg('请输入购物网站订单号', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['货物数量']) {
                    if (obj.goodsAmount === '') {
                        layer.msg('请输入货物数量', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['物流公司名称']) {
                    if (obj.expressCompanyName === '') {
                        layer.msg('请输入物流公司名称', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['收件人信息']) {
                    if (obj.receiverInfo === '') {
                        layer.msg('请输入收件人信息', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['寄件人信息']) {
                    if (obj.sendInfo === '') {
                        layer.msg('请输入寄件人信息', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['收件人地址']) {
                    if (obj.receiverAddr === '') {
                        layer.msg('请输入收件人地址', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['寄件人地址']) {
                    if (obj.senderAddress === '') {
                        layer.msg('请输入寄件人地址', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['卖家账号或登录名']) {
                    if (obj.sellerAccount === '') {
                        layer.msg('请输入卖家账号或登录名', {time: 1000});
                        return false;
                    }
                }
                if (vm.rules['买家账号或登录名']) {
                    if (obj.buyerAccount === '') {
                        layer.msg('请输入买家账号或登录名', {time: 1000});
                        return false;
                    }
                }
                return true;
            };
            //提交
            vm.submit = function () {
                if (vm.checkData(vm.orderApi)) {
                    $api.post('/tb/product/addTbProductPackage', angular.toJson(vm.orderApi), function (result) {
                        if (result.code == 0) {
                            layer.msg(result.msg, {time: 1000});
                            $state.go('customerInsure');
                        }
                    });
                }
            };
        }]);
}());