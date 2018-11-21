(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('claimOrderAddController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$cookies', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.user = JSON.parse(localStorage.getItem('user'));
            vm.appointOrder = false;
            vm.applyData = {
                source: vm.user.source,//商户标识
                companyName: '',//商户名称
                channelOrderNo: '',//渠道订单号
                ticketNo: '',//豆沙包订单号
                productName: '',//产品名称
                productId: '',//申请的产品id
                combinationId: '',//组合Id
                applyAmount: '',//理赔金额
                remark: '',//备注
                documentList: []//单证列表
            };
            // 组合产品
            vm.compensationByCombinationId = {
                combinationId: '',
                parentProductId: '',
                ticketNo: ''
            };
            vm.testImg = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/;
            vm.fontRules = {};


//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
//             vm.url = 'http://test.saas.dousha8ao.com/index.html#/claimOrderAdd.html?_login_mark=e4d86f8a7f25179d21c5bf9ffa024e40&_source=CLBGEL&_ticket_no=DSB409620180925100951058&_product_id=927http://test.api.dousha8ao.com/index.html#/claimOrderAdd.html?_login_mark=d90a853e238af21c046b5426c69072b4&_source=CLBGEL&_ticket_no=DSB409620180925100951058&_product_id=927';
            function parseQueryString(url){
                if (url.indexOf('?') > 0) {
                    var str = url.split("?")[1];
                    var iterms = str.split("&");
                    var arr, Json = {};
                    for (var i = 0; i < iterms.length; i++) {
                        arr = iterms[i].split("=");
                        Json[arr[0]] = arr[1];
                    }
                    return Json;
                }
            }

            vm.objs = parseQueryString(window.location.href);
            // vm.objs= parseQueryString(vm.url);
            // console.log('obj===', vm.objs);
            if (vm.objs) {
                vm.appointOrder = true;
                vm.user.token = vm.objs.loginMark;
                // $cookies.put($defaultConfig.session_code, vm.objs.loginMark);//token
                vm.applyData = vm.objs;
                vm.applyData.source = vm.applyData.subMerchant;
                $api.get('/user/menus', function (result) {
                    if (result.code == 0) {
                        var menuList = result.data.menuList;
                        // $cookies.put('user', result.user);//用户名
                        vm.user.user = result.user;
                        localStorage.setItem('user', JSON.stringify(vm.user));
                        localStorage.setItem('menuList', JSON.stringify(menuList));
                    }
                });
                $api.post('/apply/orderByChannelOrderNoOrTicketNo', angular.toJson(vm.applyData), function (result) {
                    if (result.code == 0) {
                        vm.productIdList = result.data.productList;
                        if (result.data.ticketNo != '') {
                            vm.applyData.ticketNo = result.data.ticketNo;
                        }
                        for (var i = 0; i < vm.productIdList.length; i++) {
                            if (vm.applyData.productId == vm.productIdList[i].id) {
                                var currentName = vm.productIdList[i].id + '-' + vm.productIdList[i].productName;
                                vm.applyData.showName = currentName;
                                vm.applyData.productName = vm.productIdList[i].productName;
                                if (vm.productIdList[i].productType == 3 || vm.productIdList[i].productType == 4) {
                                    vm.isGroup = true;
                                    $api.post('/apply/combinationsByProductId', angular.toJson({productId: vm.productIdList[i].id}), function (result) {
                                        if (result.code == 0) {
                                            vm.compositeProductList = result.data;
                                            for (var i = 0; i < vm.compositeProductList.length; i++) {
                                                vm.compositeProductList[i].showName = vm.compositeProductList[i].id + '-' + vm.compositeProductList[i].productName
                                            }
                                        }
                                    })
                                } else {
                                    vm.isGroup = false;
                                    $api.post('/apply/compensationByProductId', angular.toJson({productId: vm.productIdList[i].id}), function (result) {
                                        if (result.code == 0) {
                                            if (result.code == 0) {
                                                vm.img = result.data.img;
                                                vm.font = result.data.font;
                                                for (var i = 0; i < vm.img.length; i++) {
                                                    vm.img[i].uploadImgList = [];
                                                }
                                            } else {
                                                layer.msg(result.msg, {time: 1000});
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    } else {
                        layer.msg(result.msg, {time: 1000});
                    }
                })
            } else if (localStorage.infor) {
                vm.appointOrder = true;
                vm.infor = JSON.parse(localStorage.getItem('infor'));
                vm.applyData.channelOrderNo = vm.infor.expressNo;
                vm.applyData.ticketNo = vm.infor.ticketNo;
                vm.applyData.productId = vm.infor.applyProductId;
                vm.applyData.companyName = vm.infor.name;
                vm.compensationByCombinationId.ticketNo = vm.infor.ticketNo;
                $api.post('/apply/orderByChannelOrderNoOrTicketNo', angular.toJson(vm.applyData), function (result) {
                    if (result.code == 0) {
                        vm.productIdList = result.data.productList;
                        if (result.data.ticketNo != '') {
                            vm.applyData.ticketNo = result.data.ticketNo;
                        }
                        for (var i = 0; i < vm.productIdList.length; i++) {

                            if (vm.applyData.productId == vm.productIdList[i].id) {
                                var currentName = vm.productIdList[i].id + '-' + vm.productIdList[i].productName;
                                vm.applyData.showName = currentName;
                                vm.applyData.productName = vm.productIdList[i].productName;
                                if (vm.productIdList[i].productType == 3 || vm.productIdList[i].productType == 4) {
                                    vm.isGroup = true;
                                    $api.post('/apply/combinationsByProductId', angular.toJson({productId: vm.productIdList[i].id}), function (result) {
                                        if (result.code == 0) {
                                            vm.compositeProductList = result.data;
                                            for (var i = 0; i < vm.compositeProductList.length; i++) {
                                                vm.compositeProductList[i].showName = vm.compositeProductList[i].id + '-' + vm.compositeProductList[i].productName
                                            }
                                        }
                                    })
                                } else {
                                    vm.isGroup = false;
                                    $api.post('/apply/compensationByProductId', angular.toJson({productId: vm.productIdList[i].id}), function (result) {
                                        if (result.code == 0) {
                                            if (result.code == 0) {
                                                vm.img = result.data.img;
                                                vm.font = result.data.font;
                                                for (var i = 0; i < vm.img.length; i++) {
                                                    vm.img[i].uploadImgList = [];
                                                }
                                            } else {
                                                layer.msg(result.msg, {time: 1000});
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    } else {
                        layer.msg(result.msg, {time: 1000});
                    }
                })
            } else {
                // debugger;
                //获取商户名称
                vm.getSourceNmae = function () {
                    $api.post('/apply/findCompanyBySource', angular.toJson({source: vm.applyData.source}), function (result) {
                        if (result.code === 0) {
                            vm.applyData.companyName = result.data.companyName;
                        } else {
                            layer.msg(result.msg);
                        }
                    });
                    vm.getOrder();
                };
                //获取订单
                vm.getOrder = function () {
                    if (vm.applyData.channelOrderNo || vm.applyData.ticketNo && vm.applyData.source) {
                        $api.post('/apply/orderByChannelOrderNoOrTicketNo', angular.toJson(vm.applyData), function (result) {
                            if (result.code == 0) {
                                vm.productIdList = result.data.productList;
                                for (var i = 0; i < vm.productIdList.length; i++) {
                                    var currentName = vm.productIdList[i].id + '-' + vm.productIdList[i].productName;
                                    vm.productIdList[i].showName = currentName;
                                }
                                if (result.data.ticketNo != '') {
                                    vm.applyData.ticketNo = result.data.ticketNo;
                                }
                                vm.compensationByCombinationId.ticketNo = vm.applyData.ticketNo;
                            } else {
                                layer.msg(result.msg, {time: 1500})
                            }
                        })
                    }
                };
                vm.getSourceNmae();
                //理赔产品监听
                $scope.$watch('vm.applyData.productId', function (newVal, oldVal) {
                    if (newVal) {
                        for (var i = 0; i < vm.productIdList.length; i++) {
                            if (newVal == vm.productIdList[i].id) {
                                vm.applyData.productName = vm.productIdList[i].productName;
                                if (vm.productIdList[i].productType == 3 || vm.productIdList[i].productType == 4) {
                                    vm.isGroup = true;
                                    $api.post('/apply/combinationsByProductId', angular.toJson({productId: vm.productIdList[i].id}), function (result) {
                                        if (result.code == 0) {
                                            vm.compositeProductList = result.data;
                                            for (var i = 0; i < vm.compositeProductList.length; i++) {
                                                vm.compositeProductList[i].showName = vm.compositeProductList[i].id + '-' + vm.compositeProductList[i].productName
                                            }
                                        }
                                    })
                                } else {
                                    vm.isGroup = false;
                                    $api.post('/apply/compensationByProductId', angular.toJson({productId: vm.productIdList[i].id}), function (result) {
                                        if (result.code == 0) {
                                            vm.img = result.data.img;
                                            vm.font = result.data.font;
                                            for (var i = 0; i < vm.img.length; i++) {
                                                vm.img[i].uploadImgList = [];
                                            }
                                        } else {
                                            layer.msg(result.msg, {time: 1000});
                                        }
                                    })
                                }
                            }
                        }
                    }
                });
            }
            //组合产品监听
            $scope.$watch('vm.applyData.combinationId', function (newVal, oldVal) {
                if (newVal) {
                    for (var i = 0; i < vm.compositeProductList.length; i++) {
                        if (newVal == vm.compositeProductList[i].id) {
                            vm.compensationByCombinationId.combinationId = vm.compositeProductList[i].id;
                            vm.compensationByCombinationId.parentProductId = vm.compositeProductList[i].parentProductId;
                            vm.currentId = vm.compositeProductList[i].parentProductId;
                            $api.post('/apply/compensationByCombinationId', angular.toJson(vm.compensationByCombinationId), function (result) {
                                if (result.code == 0) {
                                    vm.img = result.data.img;
                                    vm.font = result.data.font;
                                    for (var i = 0; i < vm.img.length; i++) {
                                        vm.img[i].uploadImgList = [];
                                    }
                                } else {
                                    layer.msg(result.msg, {time: 1000});
                                    vm.img = [];
                                    vm.font = [];
                                }
                            })
                        }
                    }
                }
            });
            //返回
            vm.goBack = function () {
                history.back();
            };
            //上传
            vm.readExcel = function (file, obj) {
                if (obj.uploadImgList.length == 5) {
                    return layer.msg('最多只能上传5张', {time: 1000});
                }
                $layer.loading();
                var files = file[0];
                var name = file[0].name;
                if (files) {
                    $upload.upload({
                        url: $defaultConfig.app_uri + '/apply/upload',
                        headers: {
                            token: vm.user.token
                            // token: $cookies.get('token')
                        },
                        file: files
                    }).progress(function (evt) {//上传进度
                    }).success(function (data, status, headers, config) {
                        if (data.code == 0) {
                            $layer.close();
                            if (vm.testImg.test(data.data)) {
                                obj.uploadImgList.push({
                                    value: $defaultConfig.app_uri + '/' + data.data,
                                    isImg: true,
                                    isFont: false,
                                    name: name
                                });
                            } else {
                                obj.uploadImgList.push({
                                    value: $defaultConfig.app_uri + '/' + data.data,
                                    isImg: false,
                                    isFont: true,
                                    name: name
                                });
                            }
                        } else {
                            layer.msg(data.msg, {time: 1000});
                        }
                    }).error(function (data, status, headers, config) {
                        $layer.close();
                        layer.msg('服务器异常，请重新尝试', {time: 1000});
                    });
                }
            };
            //删除理赔必选项
            vm.deleteUploadImg = function (index, list) {
                list.splice(index, 1);
            };
            //提交
            vm.submit = function () {
                if (vm.img) {
                    for (var i = 0; i < vm.img.length; i++) {
                        if (vm.img[i].uploadImgList.length == 0) {
                            return layer.msg(vm.img[i].docName + '不能为空', {time: 1000});
                        }
                    }
                }
                if (vm.font) {
                    for (var i = 0; i < vm.font.length; i++) {
                        if (vm.font[i].value == undefined || vm.font[i].value == '') {
                            return layer.msg(vm.font[i].docName + '不能为空', {time: 1000});
                        }
                        if (vm.font[i].docName == '身份证号') {
                            if (!convertCardID(vm.font[i].value)) {
                                return layer.msg('请输入正确的身份证号', {time: 1000});
                            }
                        }
                    }
                }
                vm.applyData.documentList = [];
                if (vm.img) {
                    for (var i = 0; i < vm.img.length; i++) {
                        for (var j = 0; j < vm.img[i].uploadImgList.length; j++) {
                            vm.applyData.documentList.push(
                                {
                                    documentId: vm.img[i].id,
                                    value: vm.img[i].uploadImgList[j].value,
                                    type: vm.img[i].type
                                }
                            )
                        }
                    }
                }
                if (vm.font) {
                    for (var i = 0; i < vm.font.length; i++) {
                        vm.applyData.documentList.push(
                            {
                                documentId: vm.font[i].id,
                                value: vm.font[i].value,
                                type: vm.font[i].type
                            }
                        )
                    }
                }
                $api.post('/apply/applyByCompany', angular.toJson(vm.applyData), function (result) {
                    if (result.code == 0) {
                        layer.msg(result.msg, {time: 1000});
                        $timeout(function () {
                            $state.go('claimOrder');
                        }, 1200);
                    } else {
                        layer.msg(result.msg, {time: 1000});
                    }
                })
            };
        }])
}());