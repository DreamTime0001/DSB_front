(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('businessOrderAddController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer) {
            var vm = this;
            vm.rules = {};//统计规则
            vm.popToPay = false;//去支付
            vm.payInfo = {
                ticketNo: '',
                source: '',
                productName: '',
                discountAmount: '',
                balance: ''
            };
            vm.ids = '';
            //投保提交数据
            vm.orderApi =
                {
                    source: '',//商户标识
                    productName: '',//产品名称
                    productId: '',//产品Id
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
                    type: 1,//后台投保
                    orderProductList: [
                        {
                            productId: '',
                            productNum: 1,
                            productPrice: '',
                            productCompensationAmount: '',
                            productPeriod: '',
                            compositeProductList: []
                        }
                    ]
                };

            vm.productIdList = [];
            //日期初始化
            var toDay = new Date();
            initDate('#expressTime', 'yyyy-mm-dd', 2, function () {
            });
            initDate('#shoppingTime', 'yyyy-mm-dd', 2, function () {
            });

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//

            //计算字符长度
            function sumChartCode(str) {
                if (str) {
                    return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
                }
                else {
                    return 0;
                }
            }

            //获取商户标识
            vm.getSource = function (source) {
                if (sumChartCode(source) == 6) {
                    $api.get('/order/findCompanyBySource/' + source, function (result) {
                        if (result.code == 0) {
                            if (result.data.company) {
                                vm.orderApi.companyName = result.data.company.companyName;
                                vm.productIdList = result.data.product;
                                for (var i = 0; i < vm.productIdList.length; i++) {
                                    var currentName = vm.productIdList[i].id + '-' + vm.productIdList[i].productName;
                                    vm.productIdList[i].showName = currentName;
                                }
                            } else {
                                layer.msg('没有查到相关商户,请重新输入', {time: 1000});
                            }
                        } else {
                            layer.msg(result.msg, {time: 1000});
                        }
                    });
                }else{
                    vm.productIdList = [];
                    angular.forEach(vm.ruleList, function (obj) {
                        vm.rules[obj] = false;
                    });
                    vm.ruleList = [];
                }
            };
            //增加产品id
            vm.addProduct = function () {
                if (vm.orderApi.orderProductList.length == 10) {
                    return layer.msg('最多只能10条数据', {time: 1000});
                } else {
                    vm.orderApi.orderProductList.push({
                        productId: '',
                        productNum: 1,
                        productPrice: '',
                        productCompensationAmount: '',
                        productPeriod: ''
                    });
                }
            };
            // 删除产品id
            vm.deleteProductId = function (index, obj) {
                obj.splice(index, 1);
                vm.ids = [];
                for (var i = 0; i < vm.orderApi.orderProductList.length; i++) {
                    vm.ids.push(vm.orderApi.orderProductList[i].productId);
                }
                vm.ids = vm.ids.toString();
                console.log(vm.ids);
                $api.post('/order/getInsuranceInformation', angular.toJson({ids: vm.ids}), function (result) {
                    if (result.code == 0) {
                        vm.ruleList = result.data;
                        vm.rules = [];
                    }
                    angular.forEach(vm.ruleList, function (obj) {
                        vm.rules[obj] = true;
                    });
                });
            };
            vm.distinct = function (arr) {
                var i,
                    j,
                    len = arr.length;
                for (i = 0; i < len; i++) {
                    for (j = i + 1; j < len; j++) {
                        if (arr[i] == arr[j]) {
                            arr.splice(j, 1);
                            len--;
                            j--;
                        }
                    }
                }
                return arr;
            };
            //监听产品id选择
            var tempList = [];
            vm.getProductId = function (obj) {
                for (var i = 0; i < vm.productIdList.length; i++) {
                    if (obj.productId == vm.productIdList[i].id) {
                        obj.productPeriod = vm.productIdList[i].productPeriod;
                        obj.productPrice = vm.productIdList[i].productPrice;
                        obj.productCompensationAmount = vm.productIdList[i].productCompensationAmount;
                        obj.productType = vm.productIdList[i].productType;
                        if (obj.productType == 0 || obj.productType == 4) {
                            obj.isGroup = true;
                            obj.productNum = 1;
                        } else {
                            obj.isGroup = false;
                        }
                        if (vm.productIdList[i].productType == 3 || vm.productIdList[i].productType == 4) {
                            $api.post('/apply/combinationsByProductId', angular.toJson({productId: obj.productId}), function (result) {
                                if (result.code == 0) {
                                    obj.compositeProductList = result.data;
                                }
                            })
                        } else {
                            obj.compositeProductList = [];
                        }
                    }
                }
                tempList = [];
                if (vm.orderApi.orderProductList.length == 1) {
                    tempList.push(obj.productId);
                } else {
                    for (var i = 0; i < vm.orderApi.orderProductList.length; i++) {
                        tempList.push(vm.orderApi.orderProductList[i].productId)
                    }
                    vm.distinct(tempList);
                }
                vm.ids = tempList.toString();
                console.log(vm.ids);
                $api.post('/order/getInsuranceInformation', angular.toJson({ids: vm.ids}), function (result) {
                    if (result.code == 0) {
                        vm.rules = [];
                        vm.ruleList = result.data;
                    }
                    angular.forEach(vm.ruleList, function (obj) {
                        vm.rules[obj] = true;
                    });
                });

            };
            //判断物流单号是否重复
            vm.expressIsRepeat = function () {
                if (vm.orderApi.expressNo != '') {
                    $api.post('/order/expressNoRepeat', angular.toJson({
                        expressNo: vm.orderApi.expressNo,
                        source: vm.orderApi.source
                    }), function (result) {
                        if (result.code == 1) {
                            layer.msg(result.msg, {time: 1000});
                        }
                    })
                }
            };
            //校验数据
            vm.checkData = function (obj) {
                vm.phone = /^[1][3,4,5,7,8][0-9]{9}$/;
                vm.testNum = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
                vm.testInteger = /^\d+$/;
                if (obj.source === '') {
                    layer.msg('请输入商户标识', {time: 1000});
                    return false;
                }
                for (var i = 0; i < obj.orderProductList.length; i++) {
                    if (obj.orderProductList[i].productId === '') {
                        layer.msg('请选择产品id', {time: 1000});
                        return false;
                    }
                    if (obj.orderProductList[i].productNum === "") {
                        layer.msg('请选择份数', {time: 1000});
                        return false;
                    } else if (!vm.testInteger.test(obj.orderProductList[i].productNum)) {
                        layer.msg('份数应为整数', {time: 1000});
                        return false;
                    }
                }
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
                        layer.msg('请输入正确的商品价值', {time: 1000});
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
                    $api.post('/order/addOrderApi', angular.toJson(vm.orderApi), function (result) {
                        if (result.code == 0) {
                            $api.post('/company/getBalance', angular.toJson({username: result.data.payPhoneno}), function (res) {
                                if (res.code == 0) {
                                    vm.ticket = res.data.ticket;
                                    $api.post('/account/info', angular.toJson({t: vm.ticket}), function (res) {
                                        if (res.code == 0) {
                                            vm.payInfo.balance = (res.data.info.subAccountInfos[0].subAccountBalance * 100 + res.data.info.subAccountInfos[0].subAccountWithdrawBalance * 100) / 100;//余额
                                        } else {
                                            layer.msg(res.msg, {time: 1000});
                                        }
                                    });
                                }
                            });
                            if(result.data.productNameList !=null && result.data.productNameList!=""){
                                vm.productNameList = result.data.productNameList.split("<br>");
                                // 数组去空值
                                for(var i = 0 ;i<vm.productNameList.length;i++){
                                    if(vm.productNameList[i] == "" || typeof(vm.productNameList[i]) == "undefined")
                                    {
                                        vm.productNameList.splice(i,1);
                                        i= i-1;
                                    }
                                }
                            }
                            if(result.data.productNameList && result.data.sb){
                                vm.info = result.data.productNameList + result.data.sb;
                            }else if(!result.data.productNameList){
                                vm.info = result.data.sb;
                            }
                            if(result.data.sb){
                                layer.alert(vm.info, {
                                    area: ['380px', '280px']
                                },function (index) {
                                    if(result.data.productNameList){
                                        vm.popToPay = true;
                                    }else{
                                        vm.popToPay = false;
                                    }
                                    $scope.$apply();
                                    layer.close(index);
                                });
                            }else {
                                vm.popToPay = true;
                            }
                            if(result.data.order !=null){
                                vm.payInfo.discountAmount = result.data.order.discountAmount / 100;
                                vm.payInfo.ticketNo = result.data.order.ticketNo;
                                vm.payInfo.source = result.data.order.source;
                            }

                        } else {
                            layer.msg(result.msg, {time: 1000});
                        }
                    });
                }
            };
            //确认支付
            vm.confirmToPay = function () {
                vm.popToPay = true;
                $api.get('/order/updateOrderById/' + vm.payInfo.ticketNo + '/' + vm.payInfo.source, function (result) {
                    if (result.code == 0) {
                        vm.popToPay = false;
                        layer.msg(result.msg, {time: 1000});
                        $timeout(function () {
                            $state.go('businessOrder');
                        }, 1200);
                    } else {
                        vm.popToPay = false;
                        layer.msg(result.msg, {time: 1000});
                        $timeout(function () {
                            $state.go('businessOrder')
                        }, 1200);
                    }
                });
            };
        }]);
}());