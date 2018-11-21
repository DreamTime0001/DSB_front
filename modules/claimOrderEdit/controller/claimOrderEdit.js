(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('claimOrderEditController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$cookies', '$stateParams', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $cookies, $stateParams) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.user = JSON.parse(localStorage.getItem('user'));
            vm.infor = JSON.parse(localStorage.getItem('infor'));
            vm.font = [];
            vm.img = [];
            vm.applyData = {
                id: vm.infor.id,
                source: vm.user.source,//商户标识
                companyName: vm.infor.name,//商户名称
                channelOrderNo: vm.infor.expressNo,//渠道订单号
                ticketNo: vm.infor.ticketNo,//豆沙包订单号
                productName: vm.infor.applyProductName,//产品名称
                productId: vm.infor.applyProductId,//申请的产品id
                parentProductId: vm.infor.parentProductId,//申请的产品id
                combinationId: vm.infor.applyProductCombinationId,//组合Id
                applyAmount: vm.infor.applyAmount,//理赔金额
                remark: '',//备注
                documentList: [],//单证列表
                showName: vm.infor.applyProductId + '-' + vm.infor.applyProductName
            };

            vm.testImg = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/;
            vm.fontRules = {};

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//

            //上传
            vm.readExcel = function (file, obj) {
                if (obj.imgList.length == 5) {
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
                        },
                        file: files
                    }).progress(function (evt) {//上传进度
                    }).success(function (data, status, headers, config) {
                        if (data.code == 0) {
                            $layer.close();
                            if (vm.testImg.test(data.data)) {
                                obj.imgList.push({
                                    value: $defaultConfig.app_uri + '/' + data.data,
                                    isImg: true,
                                    isFont: false,
                                    name: name
                                });
                            } else {
                                obj.imgList.push({
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
                vm.applyData.documentList = [];
                for (var i = 0; i < vm.img.length; i++) {
                    for (var j = 0; j < vm.img[i].imgList.length; j++) {
                        vm.applyData.documentList.push(
                            {
                                documentId: vm.img[i].id,
                                value: vm.img[i].imgList[j].value,
                                type: vm.img[i].type
                            }
                        )
                    }
                }
                for (var i = 0; i < vm.font.length; i++) {
                    vm.applyData.documentList.push(
                        {
                            documentId: vm.font[i].id,
                            value: vm.font[i].value,
                            type: vm.font[i].type
                        }
                    )
                }
                $api.post('/apply/applyAppeal', angular.toJson(vm.applyData), function (result) {
                    if (result.code == 0) {
                        layer.msg(result.msg, {time: 1000});
                        $timeout(function () {
                            localStorage.removeItem("infor");
                            $state.go('claimOrder');
                        }, 1200);
                    } else {
                        layer.msg(result.msg, {time: 1000});
                    }
                })
            };


            // 获取单证列表信息
            $api.post('/apply/documentInfo', angular.toJson({id: vm.infor.id}), function (result) {
                if (result.code == 0) {
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].type == 1) {
                            vm.img.push(result.data[i])
                        } else {
                            vm.font.push(result.data[i])
                        }

                    }
                    //图片+视屏获取
                    for (var i = 0; i < vm.img.length; i++) {
                        for (var j = 0; j < vm.img[i].imgList.length; j++) {
                            vm.img[i].imgList[j].value = vm.img[i].imgList[j].path;
                            vm.img[i].imgList[j].name = vm.img[i].imgList[j].path.substring(vm.img[i].imgList[j].path.lastIndexOf("/") + 1, vm.img[i].imgList[j].path.length);
                            vm.img[i].imgList[j].name = vm.img[i].imgList[j].name.split('.')[0];
                        }
                    }
                    //文字获取
                    for (var i = 0; i < vm.font.length; i++) {
                        vm.font[i].value = vm.font[i].imgList[0].path;
                    }
                } else {
                    layer.msg(result.msg, {time: 1500});
                }
            })


            // 清除localStorage
            vm.clearLocalStorage = function () {
                localStorage.removeItem("infor");
                $state.go('claimOrder');
            }


        }])
}());