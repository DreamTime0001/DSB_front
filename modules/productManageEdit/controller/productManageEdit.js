(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('productManageEditController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$stateParams', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $stateParams) {
            var vm = this;
            vm.backId = localStorage.getItem('backId');
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
            //产品线数据
            vm.productLineList = [
                {
                    id: 0,
                    name: '物流保障类'
                },
                {
                    id: 1,
                    name: '产品保障类'
                },
                {
                    id: 2,
                    name: '售后保障类'
                },
                {
                    id: 3,
                    name: '信用保障类'
                },
                {
                    id: 4,
                    name: '场景定制类'
                },
                {
                    id: 6,
                    name: '卖家保障类'
                },
                {
                    id: 5,
                    name: '其他产品线类'
                }
            ];
            //投保方式数据
            vm.insuranceInformation = [
                {
                    type: 'webApply',
                    name: '网页投保',
                    checked: false
                },
                {
                    type: 'excelApply',
                    name: 'Excel',
                    checked: false
                },
                {
                    type: 'apiApply',
                    name: 'API',
                    checked: false
                },
                {
                    type: 'wxApply',
                    name: '小程序',
                    checked: false
                }
            ];
            //投保必填项
            vm.insureItems = [
                {
                    type: '手机号',
                    checked: false
                },
                {
                    type: '身份证号码',
                    checked: false
                },
                {
                    type: '物流单号',
                    checked: false
                },
                {
                    type: '物流发货日期',
                    checked: false
                }, {
                    type: '收货地址',
                    checked: false
                },
                {
                    type: '购物网站订单号/海淘商品订单号',
                    checked: false
                },
                {
                    type: '购物网站',
                    checked: false
                },
                {
                    type: '商品列表',
                    checked: false
                },
                {
                    type: '保费',
                    checked: false
                },
                {
                    type: '姓名',
                    checked: false
                },
                {
                    type: '购买日期',
                    checked: false
                },
                {
                    type: '起运地',
                    checked: false
                },
                {
                    type: '目的口岸',
                    checked: false
                },
                {
                    type: '运输方式',
                    checked: false
                },
                {
                    type: '商品价值明细',
                    checked: false
                },
                {
                    type: '商品价值',
                    checked: false
                },
                {
                    type: '商品种类',
                    checked: false
                },
                {
                    type: '性别',
                    checked: false
                },
                {
                    type: '货物数量',
                    checked: false
                },
                {
                    type: '物流公司名称',
                    checked: false
                },
                {
                    type: '收件人信息',
                    checked: false
                },
                {
                    type: '寄件人信息',
                    checked: false
                },
                {
                    type: '收件人地址',
                    checked: false
                },
                {
                    type: '寄件人地址',
                    checked: false
                },
                {
                    type: '卖家账号或登录名',
                    checked: false
                },
                {
                    type: '买家账号或登录名',
                    checked: false
                }
            ];
            //理赔信息数据
            vm.claimInforList = [
                {
                    id: 0,
                    name: '立即生效'
                },
                {
                    id: 1,
                    name: '第二天0点生效'
                },
                {
                    id: 2,
                    name: '第三天0点生效'
                },
                {
                    id: 3,
                    name: '第四天0点生效'
                },
                {
                    id: 4,
                    name: '第五天0点生效'
                },
                {
                    id: 5,
                    name: '第六天0点生效'
                }
            ];
            //产品责任数据
            vm.productDutyList = [
                {
                    id: 'BSB',
                    name: '通关责任'
                },
                {
                    id: 'HSB',
                    name: '货损'
                },
                {
                    id: 'YSB',
                    name: '延时'
                },
                {
                    id: 'DJB',
                    name: '丢件'
                },
                {
                    id: 'TYB',
                    name: '退运'
                },
                {
                    id: 'THB',
                    name: '退货'
                },
                {
                    id: 'ZPB',
                    name: '正品'
                },
                {
                    id: 'CDB',
                    name: '产地'
                },
                {
                    id: 'YXQB',
                    name: '有效期险'
                },
                {
                    id: 'CPZRX',
                    name: '产品责任险'
                },
                {
                    id: 'CKHS',
                    name: '出口货损'
                },
                {
                    id: 'CKDJ',
                    name: '出口丢件'
                },
                {
                    id: 'CKCF',
                    name: '出口错发'
                },
                {
                    id: 'CKYS',
                    name: '出口延时'
                },
                {
                    id: 'CKTH',
                    name: '出口退货'
                }
            ];
            //所有互斥Id
            vm.mutexList = [];
            //理赔方式数据
            vm.claimList = [];
            //提交数据
            vm.productData = {
                productId: $stateParams.id,//产品id
                productName: '',//产品名称
                productPrice: '',//产品价格
                productPeriod: '',//产品有效期
                productType: 0,//产品类型
                highestNum: '',//单次最高购买分数
                limitTimeReduce: "",//投保时间限制T-
                limitTimePlus: "",//投保时间限制T+
                prescription: '',//申诉时效
                productLine: '',//产品线
                productCompensationAmount: '',//保额
                monthCompensationAmount: '',//月累计补贴限额
                yearCompensationAmount: '',//年累计补贴限额
                monthCompensationAmountRest: '',//月累计补贴剩余额度
                yearCompensationAmountRest: '',//年累计补贴剩余额度
                mutex: '',//险种理赔互斥
                mutexList: [],//险种理赔互斥列表
                mutexedList: [],//险种理赔互斥选中列表
                mutexed: '',//选中的理赔互斥
                insuranceDirect: 0,//保险公司直连
                insuranceName: '',//保险公司
                isStep: 0,//是否阶梯价格
                isAudit: 0,//是否小额快审
                isCochain: 0,//是否上链
                isDynamicprice: 0,//是否动态调价
                audit: {
                    limitMoney: '',//小额快审单笔上限
                    limitMoneyMonth: '',//小额快审月限额
                    limitMoneyMonthRest: ''//小额快审月剩余额度
                },
                //组合产品
                productList: [
                    {
                        mutex: '',//上传的互斥id
                        combinationProductAmount: "",//最高补贴限额
                        productPeriod: "",//产品有限期
                        parentProductId: "",//组合产品id
                        mutexed: '',//当前绑定的互斥id
                        mutexedList: []//已选择的id
                    }
                ],
                //投保信息
                insuranceInformation: {
                    applyType: [],//投保方式
                    insuranceList: [],//投保必填项
                },
                //阶梯报价
                step: [
                    {
                        type: 1,//大于1 小于-1 等于0
                        price: '',//产品价格
                        monthOrderSum: ''//月单量
                    }
                ],
                //理赔方式&&信息
                apply: {
                    customerApplyDate: '',//客户理赔生效日期
                    customerOrderDate: '',//客户保单生效日期
                    sysApplyDate: '',//系统理赔生效日期
                    sysOrderDate: '',//系统保单生效日期
                    applyType: []//理赔方式
                },
                docs: [],//理赔上传项
                isExit: '',//进出口
                productDuty: '',//产品责任
                leastPay: ''//最低收费
            };
            //获取险种理赔互斥Id
            if ($stateParams.source != null) {
                $api.get('/product/rate_list?source=' + $stateParams.source, function (result) {
                    vm.productData.mutexList = result.data;
                    for (var i = 0; i < vm.productData.mutexList.length; i++) {
                        vm.productData.mutexList[i].showName = vm.productData.mutexList[i].id + '-' + vm.productData.mutexList[i].productName;
                    }
                });
            } else {
                $api.get('/product/rate_list', function (result) {
                    vm.productData.mutexList = result.data;
                    for (var i = 0; i < vm.productData.mutexList.length; i++) {
                        vm.productData.mutexList[i].showName = vm.productData.mutexList[i].id + '-' + vm.productData.mutexList[i].productName;
                    }
                });
            }

            angular.copy(vm.insuranceInformation, vm.claimList);
            //理赔上传项数据
            $api.get('/product/getCompensation', function (result) {
                if (result.code == 0) {
                    var tempList = result.data;
                    vm.videoImgList = [];
                    vm.fontList = [];
                    for (var i = 0; i < tempList.length; i++) {
                        if (tempList[i].type == 1) {
                            vm.videoImgList.push({docsId: tempList[i].id, docName: tempList[i].docName})
                        } else {
                            vm.fontList.push({docsId: tempList[i].id, docName: tempList[i].docName})
                        }
                    }
                    //获取数据
                    $api.get('/product/getProductDetail/' + $stateParams.id, function (result) {
                        if (result.code == 0) {
                            vm.productData = angular.extend({}, vm.productData, result.data);
                            vm.productData.currentProductId = vm.productData.nextType;
                            if (vm.productData.mutex != '') {
                                vm.productData.mutexedList = vm.productData.mutex.split(",");
                            }
                            if (vm.productData.step == null) {
                                vm.productData.step = [{type: 1, price: null, monthOrderSum: null}];
                            }
                            if (vm.productData.productList == null) {
                                vm.productData.productList = [
                                    {
                                        mutex: '',
                                        combinationProductAmount: "",
                                        productPeriod: "",
                                        parentProductId: "",
                                        mutexed: '',
                                        mutexedList: []
                                    }
                                ]
                            }
                            for (var i = 0; i < vm.productData.productList.length; i++) {
                                vm.productData.productList[i].showName = vm.productData.productList[i].parentProductId + '-' + vm.productData.productList[i].productName;
                            }
                            vm.productData.nextType != null ? vm.currentProductId = vm.productData.nextType.toString() : null;
                            if (vm.productData.productList && (vm.productData.productType == 3 || vm.productData.productType == 4)) {
                                for (var i = 0; i < vm.productData.productList.length; i++) {
                                    if (vm.productData.productList[i].mutex != '') {
                                        vm.productData.productList[i].mutexedList = vm.productData.productList[i].mutex.split(",");
                                    } else {
                                        vm.productData.productList[i].mutexedList = [];
                                    }
                                    vm.mutexList.push({
                                        id: vm.productData.productList[i].parentProductId,
                                        showName: vm.productData.productList[i].showName
                                    });
                                }
                                vm.getRate(vm.currentProductId);
                            }
                            for (var i = 0; i < vm.productData.step.length; i++) {
                                if (vm.productData.step[i].price) {
                                    vm.productData.step[i].price = vm.productData.step[i].price.toFixed(8);
                                    var lenList = [];
                                    for (var j = vm.productData.step[i].price.length -1; j > 0; j--){
                                        if(vm.productData.step[i].price.charAt(j) != 0){
                                            lenList.push(j);
                                        }
                                    }
                                    var listLast = lenList.length;
                                    var last = lenList[0];
                                    vm.productData.step[i].price = parseFloat(vm.productData.step[i].price);
                                    vm.productData.step[i].price = vm.productData.step[i].price.toFixed(last-1)
                                }
                            }
                            //获取投保方式选中
                            for (var i = 0; i < vm.insuranceInformation.length; i++) {
                                for (var j = 0; j < vm.productData.insuranceInformation.applyType.length; j++) {
                                    if (vm.productData.insuranceInformation.applyType[j] == vm.insuranceInformation[i].type) {
                                        vm.insuranceInformation[i].checked = true;
                                    }
                                }
                            }
                            //获取投保必填选中
                            for (var i = 0; i < vm.insureItems.length; i++) {
                                for (var j = 0; j < vm.productData.insuranceInformation.insuranceList.length; j++) {
                                    if (vm.productData.insuranceInformation.insuranceList[j].type == vm.insureItems[i].type) {
                                        vm.insureItems[i].checked = true;
                                    }
                                }
                            }
                            //获得理赔方式
                            for (var i = 0; i < vm.claimList.length; i++) {
                                for (var j = 0; j < vm.productData.apply.applyType.length; j++) {
                                    if (vm.productData.apply.applyType[j] == vm.claimList[i].type) {
                                        vm.claimList[i].checked = true;
                                    }
                                }
                            }
                            //获取图片+视频选中的
                            for (var i = 0; i < vm.productData.docs.length; i++) {
                                if (vm.productData.docs[i].type == 1) {
                                    for (var j = 0; j < vm.videoImgList.length; j++) {
                                        if (vm.productData.docs[i].docsId == vm.videoImgList[j].docsId) {
                                            vm.videoImgList[j].checked = true;
                                        }
                                    }
                                } else if (vm.productData.docs[i].type == 2 || vm.productData.docs[i].type == -1) {
                                    for (var k = 0; k < vm.fontList.length; k++) {
                                        if (vm.productData.docs[i].docsId == vm.fontList[k].docsId) {
                                            vm.fontList[k].checked = true;
                                        }
                                    }
                                }
                            }
                            vm.productData.isExit == 0 ? vm.productData.isExitText = '进口' : vm.productData.isExitText = '出口';
                            //获取产品责任选中
                            for (var i = 0; i < vm.productDutyList.length; i++) {
                                if (vm.productData.productDuty == vm.productDutyList[i].id) {
                                    vm.productData.productDutyText = vm.productDutyList[i].name;
                                }
                            }
                        }
                    });
                }
            });


//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //监听产品类型选择
            $scope.$watch("vm.productData.mutexed", function (newValue, oldValue, scope) {
                if (newValue != oldValue) {
                    if (vm.productData.mutexedList.length == 0) {
                        vm.productData.mutexedList.push(newValue);
                    } else {
                        for (var i = 0; i < vm.productData.mutexedList.length; i++) {
                            if (newValue == vm.productData.mutexedList[i]) {
                                return false
                            } else {
                                vm.productData.mutexedList.push(newValue);
                                return false
                            }
                        }
                    }
                }
            }, true);
            vm.testInteger = /^\d+$/;
            //清除复选框
            vm.clearGrounp = function () {
                vm.productData.insuranceInformation.applyType = [];
                vm.productData.insuranceInformation.insuranceList = [];
                vm.productData.apply.applyType = [];
                vm.productData.docs = [];
            };
            //新增阶梯报价
            vm.addStep = function () {
                if (vm.productData.step.length == 5) {
                    return layer.msg('最多只能添加5条', {time: 1000});
                } else {
                    vm.productData.step.push({type: 1});
                }
            };
            //获取产品id
            vm.getRate = function (type) {
                $api.get('/product/rate_list?productType=' + type, function (result) {
                    if (result.code == 0) {
                        vm.productIdList = result.data;
                        for (var i = 0; i < vm.productIdList.length; i++) {
                            var showName = vm.productIdList[i].id + '-' + vm.productIdList[i].productName;
                            vm.productIdList[i].showName = showName;
                        }
                    }
                })
            };
            //获取组合版数据
            vm.getInfo = function (obj) {
                for (var i = 0; i < vm.productData.productList.length; i++) {
                    vm.productData.productList[i].mutexedList = [];
                }
                for (var i = 0; i < vm.productIdList.length; i++) {
                    if (obj.parentProductId == vm.productIdList[i].id) {
                        obj.productPeriod = vm.productIdList[i].productPeriod;
                        obj.combinationProductAmount = vm.productIdList[i].productCompensationAmount;
                        obj.showName = vm.productIdList[i].showName;
                    }
                }
                vm.mutexList = [];
                for (var i in vm.productData.productList) {
                    if (vm.productData.productList[i].parentProductId) {
                        vm.mutexList.push({
                            id: vm.productData.productList[i].parentProductId,
                            showName: vm.productData.productList[i].showName
                        });
                    }
                }
                vm.distinct = function (arr) {
                    var i,
                        j,
                        len = arr.length;
                    for (i = 0; i < len; i++) {
                        for (j = i + 1; j < len; j++) {
                            if (arr[i].showName == arr[j].showName) {
                                arr.splice(j, 1);
                                len--;
                                j--;
                            }
                        }
                    }
                    return arr;
                };
                vm.distinct(vm.mutexList);
            };
            //增加组合
            vm.addProduct = function () {
                if (vm.productData.productList.length == 10) {
                    return layer.msg('最多只能10条数据', {time: 1000});
                } else {
                    vm.productData.productList.push({
                        mutex: '',//上传的互斥id
                        combinationProductAmount: "",//最高补贴限额
                        productPeriod: "",//产品有限期
                        parentProductId: "",//组合产品id
                        mutexed: '',//当前绑定的互斥id
                        mutexedList: []//已选择的id
                    });
                }
            };
            //删除组合产品
            vm.deleteProduct = function (index, parentProductId) {
                layer.confirm('确定要删除吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    layer.closeAll();
                    vm.productData.productList.splice(index, 1);
                    for (var i = 0; i < vm.productData.productList.length; i++) {
                        vm.productData.productList[i].mutexedList = [];
                    }
                    for (var i = 0; i < vm.mutexList.length; i++) {
                        if (parentProductId == vm.mutexList[i].id) {
                            vm.mutexList.splice(i, 1);
                        }
                    }
                    $scope.$apply();
                });

                // if (parentProductId) {
                //     layer.confirm('确定要删除吗？', {
                //         btn: ['确定', '取消'] //按钮
                //     }, function () {
                //         layer.closeAll();
                //         vm.productData.productList.splice(index, 1);
                //         for (var i = 0; i < vm.productData.productList.length; i++) {
                //             vm.productData.productList[i].mutexedList = [];
                //         }
                //         for (var i = 0; i < vm.mutexList.length; i++) {
                //             if (parentProductId == vm.mutexList[i].id) {
                //                 vm.mutexList.splice(i, 1);
                //             }
                //         }
                // $api.post('/product/delete_combination/' + id, function (result) {
                //     if (result.code == 0) {
                //         vm.productData.productList.splice(index, 1);
                //     }
                // });
                //     })
                // } else {
                //     vm.productData.productList.splice(index, 1);
                // }
            };
            //删除理赔互斥id
            vm.deleteMutexed = function (list, index) {
                list.splice(index, 1);
            };
            //返回上一页
            vm.goBack = function () {
                history.back();
            };
            //选择组合的互斥Id
            vm.addMutexedList = function (obj) {
                var num = 0;
                if (obj.mutexedList.length == 0 && obj.mutexed != null) {
                    return obj.mutexedList.push(obj.mutexed);
                }
                if (obj.mutexed == null) {
                    return false;
                }
                for (var x in obj.mutexedList) {
                    if (obj.mutexed == obj.mutexedList[x]) {
                        num++;
                    }
                }
                if (num == 0) {
                    obj.mutexedList.push(obj.mutexed);
                }
            };
            //阶梯价删除
            vm.deleteStep = function (index) {
                vm.productData.step.splice(index, 1);
            };
            // 验证必填项
            vm.testRequired = function (obj) {
                //产品信息
                if (obj.productName === "") {
                    layer.msg("产品名称不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (obj.productType != 0) {
                    if (obj.highestNum === "") {
                        layer.msg("单次最高购买分数不能为空！", {time: 1000});
                        vm.clearGrounp();
                        return false;
                    }
                }

                if (obj.productType === 3) {
                    if (vm.currentProductId === "") {
                        layer.msg("组合版产品类型不能为空！", {time: 1000});
                        vm.clearGrounp();
                        return false;
                    } else {
                        for (var i in obj.productList) {
                            if (obj.productList[i].parentProductId === "") {
                                layer.msg("组合版产品id不能为空！", {time: 1000});
                                vm.clearGrounp();
                                return false;
                            }
                            // if (obj.productList[i].mutex === "") {
                            //     layer.msg("组合产品险种理赔互斥不能为空！", {time: 1000});
                            //     vm.clearGrounp();
                            //     return false;
                            // }
                            // if (obj.productList[i].parentProductId === obj.productList[i].mutex) {
                            //     layer.msg("险种理赔互斥id和组合版产品id不能互斥！", {time: 1000});
                            //     vm.clearGrounp();
                            //     return false;
                            // }
                            if (obj.productList[i].combinationProductAmount === "") {
                                layer.msg("最高补贴限额不能为空！", {time: 1000});
                                return false;
                            }
                            if (obj.productList[i].productPeriod === "") {
                                layer.msg("产品有效期不能为空！", {time: 1000});
                                vm.clearGrounp();
                                return false;
                            }
                        }
                    }
                } else if (obj.productType !== 3 && obj.productType !== 4) {
                    if (obj.productDutyText === "") {
                        layer.msg("产品责任不能为空！", {time: 1000});
                        vm.clearGrounp();
                        return false;
                    }
                }
                if (obj.productType === 4) {
                    for (var i in obj.productList) {
                        if (obj.productList[i].parentProductId === "") {
                            layer.msg("组合版产品id不能为空！", {time: 1000});
                            vm.clearGrounp();
                            return false;
                        }
                        if (obj.productList[i].combinationProductAmount === "") {
                            layer.msg("最高补贴限额不能为空！", {time: 1000});
                            vm.clearGrounp();
                            return false;
                        }
                        if (obj.productList[i].productPeriod === "") {
                            layer.msg("产品有效期不能为空！", {time: 1000});
                            vm.clearGrounp();
                            return false;
                        }
                    }
                }
                if (obj.productPrice === "") {
                    layer.msg("产品价格不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(obj.productPrice) == false) {
                    layer.msg("请正确输入产品价格", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (obj.limitTimeReduce === "" || obj.limitTimePlus === "") {
                    layer.msg("投保时间限制不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                } else if (!vm.testInteger.test(obj.limitTimeReduce) || !vm.testInteger.test(obj.limitTimePlus)) {
                    layer.msg("投保时间限制应为整数！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                } else if (obj.limitTimeReduce < 0) {
                    layer.msg("投保时间限制T-不能小于0！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                } else if (obj.limitTimePlus > 30) {
                    layer.msg("投保时间限制T+不能大于30！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (obj.productLine === "") {
                    layer.msg("产品线不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (obj.productPeriod === "") {
                    layer.msg("产品有效期不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (obj.productCompensationAmount === "") {
                    layer.msg("保额不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (obj.monthCompensationAmount === "") {
                    layer.msg("月累计补贴限额不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(obj.monthCompensationAmount) == false) {
                    layer.msg("请正确输入月累计补贴限额", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (obj.yearCompensationAmount === "") {
                    layer.msg("年累计补贴限额不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(obj.yearCompensationAmount) == false) {
                    layer.msg("请正确输入年累计补贴限额", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (obj.monthCompensationAmountRest === "") {
                    layer.msg("月累计补贴剩余额度不能为空！", {time: 1000});
                    return false;
                }
                if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(obj.monthCompensationAmountRest) == false) {
                    layer.msg("请正确输入月累计补贴剩余额度", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (obj.yearCompensationAmountRest === "") {
                    layer.msg("年累计补贴剩余额度不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(obj.yearCompensationAmountRest) == false) {
                    layer.msg("请正确输入年累计补贴剩余额度", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                // if (obj.mutex === "") {
                //     layer.msg("险种理赔互斥不能为空！", {time: 1000});
                //     vm.clearGrounp();
                //     return false;
                // }
                if (obj.prescription === "") {
                    layer.msg("申诉时效不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(obj.prescription) == false) {
                    layer.msg("请正确输入申诉时效", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (obj.insuranceDirect == 1) {
                    if (obj.insuranceName === "") {
                        layer.msg("保险公司不能为空！", {time: 1000});
                        vm.clearGrounp();
                        return false;
                    }
                }
                //投保信息
                vm.checkNum01 = false;
                vm.checkNum02 = false;
                for (var i in vm.insuranceInformation) {
                    if (vm.insuranceInformation[i].checked === true) {
                        vm.checkNum01 = true;
                    }
                }
                if (vm.checkNum01 === false) {
                    layer.msg("至少选择一种投保方式！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }

                for (var i in vm.insureItems) {
                    if (vm.insureItems[i].checked === true) {
                        vm.checkNum02 = true;
                    }
                }
                if (vm.checkNum02 === false) {
                    layer.msg("至少选择一种投保必填项！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                //阶梯报价
                if (obj.isStep === 1) {
                    for (var i in obj.step) {
                        if (obj.step[i].monthOrderSum === "") {
                            layer.msg("月单量不能为空！", {time: 1000});
                            vm.clearGrounp();
                            return false;
                        }
                        if (obj.step[i].price === "") {
                            layer.msg("产品价格不能为空！", {time: 1000});
                            vm.clearGrounp();
                            return false;
                        }
                    }
                }
                //理赔方式
                vm.checkNum03 = false;
                for (var i in vm.claimList) {
                    if (vm.claimList[i].checked === true) {
                        vm.checkNum03 = true;
                    }
                }
                if (vm.checkNum03 === false) {
                    layer.msg("至少选择一种理赔方式！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                //理赔上传项
                // 图片+视频
                vm.checkNum04 = false;
                for (var i in vm.videoImgList) {
                    if (vm.videoImgList[i].checked === true) {
                        vm.checkNum04 = true;
                    }
                }
                if (vm.checkNum04 === false) {
                    layer.msg("至少选择一种图片或视频！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                // 文字
                vm.checkNum05 = false;
                for (var i in vm.fontList) {
                    if (vm.fontList[i].checked === true) {
                        vm.checkNum05 = true;
                    }
                }
                if (vm.checkNum05 === false) {
                    layer.msg("至少选择一种文字介绍！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                //理赔信息
                if (obj.apply.customerOrderDate === "") {
                    layer.msg("客户保单生效日期不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (obj.apply.customerApplyDate === "") {
                    layer.msg("客户理赔生效日期不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (obj.apply.sysOrderDate === "") {
                    layer.msg("系统保单生效日期不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                if (obj.apply.sysApplyDate === "") {
                    layer.msg("系统理赔生效日期不能为空！", {time: 1000});
                    vm.clearGrounp();
                    return false;
                }
                //小额快审
                if (obj.isAudit === 1) {
                    if (obj.audit.limitMoney === "") {
                        layer.msg("小额快审单笔上限不能为空！", {time: 1000});
                        vm.clearGrounp();
                        return false;
                    }
                    if (obj.audit.limitMoneyMonth === "") {
                        layer.msg("小额快审月限额不能为空！", {time: 1000});
                        vm.clearGrounp();
                        return false;
                    }
                    if (obj.audit.limitMoneyMonthRest === "") {
                        layer.msg("小额快审月剩余额度不能为空！", {time: 1000});
                        vm.clearGrounp();
                        return false;
                    }
                    if (obj.leastPay === "") {
                        layer.msg("最低收费不能为空！", {time: 1000});
                        vm.clearGrounp();
                        return false;
                    }
                }
                return true;
            };

            //提交
            vm.submit = function () {
                vm.productData.insuranceInformation.applyType = [];
                vm.productData.insuranceInformation.insuranceList = [];
                vm.productData.apply.applyType = [];
                vm.productData.docs = [];
                //获取投保方式的id
                for (var i = 0; i < vm.insuranceInformation.length; i++) {
                    if (vm.insuranceInformation[i].checked) {
                        vm.productData.insuranceInformation.applyType.push(vm.insuranceInformation[i].type);
                    }
                }
                //获取投保必填id
                for (var i = 0; i < vm.insureItems.length; i++) {
                    if (vm.insureItems[i].checked) {
                        vm.productData.insuranceInformation.insuranceList.push({
                            type: vm.insureItems[i].type,
                            isNew: 0
                        });
                    }
                }
                //获取理赔方式的id
                for (var i = 0; i < vm.claimList.length; i++) {
                    if (vm.claimList[i].checked) {
                        vm.productData.apply.applyType.push(vm.claimList[i].type);
                    }
                }
                //获取理赔上传
                //图片+视频
                for (var i = 0; i < vm.videoImgList.length; i++) {
                    if (vm.videoImgList[i].checked) {
                        vm.productData.docs.push({
                            docsId: vm.videoImgList[i].docsId,
                            docName: vm.videoImgList[i].docName
                        });
                    }
                }
                //文字介绍
                for (var i = 0; i < vm.fontList.length; i++) {
                    if (vm.fontList[i].checked) {
                        vm.productData.docs.push({
                            docsId: vm.fontList[i].docsId,
                            docName: vm.fontList[i].docName
                        });
                    }
                }
                for (var i = 0; i < vm.productData.productList.length; i++) {
                    if (vm.productData.productList[i].mutexedList != null) {
                        vm.productData.productList[i].mutex = vm.productData.productList[i].mutexedList.toString();
                    }
                }
                vm.productData.mutex = vm.productData.mutexedList.toString();
                //如果是组合型
                if (vm.productData.productType == 3 || vm.productData.productType == 4) {
                    if (vm.productData.productList.length >= 2 && vm.productData.productList.length <= 10) {
                        for (i = 0; i < vm.productData.productList.length; i++) {
                            vm.productData.productList[i].combinationId = vm.productData.productList[i].id;
                        }
                    } else {
                        return layer.msg('组合产品内产品数量在2-10个内', {time: 1000});
                    }
                }

                if (vm.testRequired(vm.productData)) {
                    $api.post('/product/update', angular.toJson(vm.productData), function (result) {
                        if (result.code == 0) {
                            layer.msg(result.msg, {time: 1000});
                            if (vm.backId == null) {
                                $timeout(function () {
                                    $state.go('productManage');
                                }, 1200);
                            } else {
                                $timeout(function () {
                                    $state.go('businessEdit', {id: vm.backId});
                                }, 1200);
                            }
                        } else {
                            vm.productData.insuranceInformation.applyType = [];
                            vm.productData.insuranceInformation.insuranceList = [];
                            vm.productData.apply.applyType = [];
                            vm.productData.docs = [];
                            return layer.msg(result.msg, {time: 1000});
                        }
                    });
                }

            };
            //监听产品类型选择
            $scope.$watch("vm.productData.productType", function (newValue, oldValue, scope) {
                if (newValue === 0 || newValue === 4) {
                    vm.productData.highestNum = 1;
                }
                if (newValue === 3) {
                    vm.productData.productList == null ? vm.productData.productList = [] : null;
                }
                if (newValue == 4) {
                    vm.currentProductId = 0;
                    vm.getRate(0);
                }
            }, true);
        }])
}());