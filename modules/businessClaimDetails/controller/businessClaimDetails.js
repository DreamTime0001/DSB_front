(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('businessClaimDetailsController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$stateParams', '$cookies', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $stateParams, $cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.user = JSON.parse(localStorage.getItem('user'));
            vm.isPortStatus = '显示';
            vm.isPort = false;
            vm.analysis = false;
            vm.popShow = false;
            vm.infoLog = 0; // 0 - 基本信息 1 - 理赔日志
            vm.testImg = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/;
            vm.font = [];
            vm.img = [];
            vm.zip = [];
            vm.showPicList = [];
            vm.applyAudit = {
                id: "",
                ticketNo: $stateParams.ticketNo,
                productId: $stateParams.applyProductId,
                auditStatus: "1",
                indemnifySum: "",//实际打款金额
                applyIndemnify: "",//状态
                applyRemark: ""
            };
//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //补充理赔信息并提交
            vm.supplyInfo = {
                id:$stateParams.id,
                data:[]
            };
            // 点击补充理赔字段
            vm.supplyFieldInfo = {
                productId:$stateParams.applyProductId,
                id:$stateParams.id,
                productCombinationId:''
            };
            //查询
            vm.search = function () {
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //开始解析
            vm.toAnalysis = function () {
                $layer.loading();
                $timeout(function () {
                    vm.analysis = true;
                    $layer.close()
                }, 2000)
            };
            //订单画像
            vm.toDetail = function () {
                window.open($defaultConfig.current_uri + 'detail.html');
            };
            //获取理赔基本信息
            vm.getClaimDataAsync = function () {
                $api.get('/apply/applyClaim?ticketNo=' + $stateParams.ticketNo + '&id=' + $stateParams.id + '&applyProductId=' + $stateParams.applyProductId, function (result) {
                    if (result.code === 0) {
                        vm.info = result.data[0];
                        vm.info.discountAmount = vm.info.discountAmount / 100;
                        vm.info.premium = vm.info.premium / 100;
                        vm.info.goodsValue = vm.info.goodsValue / 100;
                        vm.info.effectiveDate = vm.info.expressTime + vm.info.customerApplyDate* 24 * 3600 * 1000;
                        vm.info.expiryDate = vm.info.expressTime + (vm.info.productDay +vm.info.customerApplyDate) * 24*3600*1000;
                        result.data[0].indem == null ? vm.sum = 0 : vm.sum = result.data[0].indem;
                        vm.applyAudit.id = result.data[0].id;
                        vm.applyAudit.applyIndemnify = result.data[0].status;
                        YQV5.trackSingleF1({
                            //必须，指定悬浮位置的元素ID。
                            YQ_ElementId:"expressNo",
                            //可选，指定查询结果宽度，最小为260px，默认为470px。
                            YQ_Width:470,
                            //可选，指定查询结果高度，最大为800px，默认为560px。
                            YQ_Height:560,
                            //可选，指定运输商，默认为自动识别。
                            YQ_Fc:"0",
                            //可选，指定UI语言，默认根据浏览器自动识别。
                            YQ_Lang:"zh-CN",
                            //必须，指定要查询的单号。
                            YQ_Num:vm.info.expressNo
                        });
                        // 组合产品时传applyProductCombinationId
                        if(vm.info.productType == 3 || vm.info.productType == 4){
                            vm.supplyFieldInfo.productCombinationId = vm.info.applyProductCombinationId;
                            vm.info.productShowId = vm.info.applyProductId + '_' + vm.info.applyProductCombinationId;
                            vm.info.productShowName = vm.info.applyProductName + '_' + vm.info.groupProductName;
                        }else{
                            vm.supplyFieldInfo.productCombinationId = "";
                            vm.info.productShowId = vm.info.applyProductId;
                            vm.info.productShowName = vm.info.applyProductName;
                        }
                        // 文字转换
                        if (vm.info.status == 2) {
                            vm.info.statusTxt = "初审";
                        } else if (vm.info.status == 6) {
                            vm.info.statusTxt = "复审";
                        } else if (vm.info.status == 11) {
                            vm.info.statusTxt = "待打款";
                        } else if (vm.info.status == 3) {
                            vm.info.statusTxt = "已打款";
                        } else if (vm.info.status == 4) {
                            vm.info.statusTxt = "驳回";
                        } else if (vm.info.status == 5) {
                            vm.info.statusTxt = "小额快审";
                        }
                    }
                })
            };
            // 获取列表
            vm.getPagedDataAsync = function () {
                $api.post('/apply/applyClaimLog', angular.toJson({ticketNo: $stateParams.ticketNo}), function (result) {
                    vm.list = result.data;
                    for (var i =0;i<vm.list.length;i++) {
                        vm.list[i].operateResult == 1 ? vm.list[i].operateResultTxt = '成功' : vm.list[i].operateResultTxt = '失败';
                        switch (vm.list[i].operation){
                            case 2:
                                vm.list[i].operationText = "初审-";
                                break;
                            case 3:
                                vm.list[i].operationText = "已打款-";
                                break;
                            case 4:
                                vm.list[i].operationText = "驳回-";
                                break;
                            case 6:
                                vm.list[i].operationText = "复审-";
                                break;
                            case 11:
                                vm.list[i].operationText = "待打款-";
                                break;
                        }
                        switch (vm.list[i].applyStatus){
                            case 0:
                                vm.list[i].applyStatusText = "驳回成功";
                                break;
                            case 1:
                                vm.list[i].applyStatusText = "审核通过";
                                break;
                        }
                    }
                })
            };
            // 审核提交
            vm.submit = function () {
                $api.post('/apply/applyAudit', angular.toJson(vm.applyAudit), function (result) {
                    if (result.code === 0) {
                        layer.msg(result.msg, {time: 1000});
                        vm.popShow = false;
                        $state.go('businessClaim');
                    } else {
                        layer.msg(result.msg, {time: 1500});
                    }
                });
            };
            // 切换
            vm.changeInfo = function (type) {
                vm.infoLog = type;
                type == 0 ? vm.getClaimDataAsync() : vm.getPagedDataAsync();
                console.log(vm.infoLog)
            };
            //订单画像显示隐藏
            vm.toggleShow = function () {
                if (vm.isPort) {
                    vm.isPort = false;
                    vm.isPortStatus = '显示';
                } else {
                    vm.isPort = true;
                    vm.isPortStatus = '隐藏';
                }
            };
            //变更到上一步审核
            vm.backStatus = function () {
                layer.confirm('确定要返回吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    layer.closeAll();
                    $api.post('/apply/applyAuditPre', angular.toJson(vm.applyAudit), function (result) {
                        if (result.code == 0) {
                            layer.msg(result.msg, {
                                time: 1000
                            });
                            $timeout(function () {
                                $state.go('businessClaim');
                            }, 1200);
                        }
                    });
                })
            };
            // 获取单证列表信息
            $api.post('/apply/documentInfo', angular.toJson({id: $stateParams.id}), function (result) {
                if (result.code == 0) {
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].type == 1) {
                            vm.img.push(result.data[i]);
                            vm.imgList = result.data[i].imgList;
                            for (var k = 0; k < vm.imgList.length; k++) {
                                if (vm.testImg.test(vm.imgList[k].path)) {
                                    // result.data[i].isImg = true;
                                    vm.imgList[k].isImg = true;
                                } else {
                                    // result.data[i].isImg = false;
                                    vm.imgList[k].isImg = false;
                                }
                            }
                        } else if (result.data[i].type == 2) {
                            vm.font.push(result.data[i])
                        }else if(result.data[i].type == -1){
                            vm.zip.push(result.data[i]);
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
                        for (var j = 0; j < vm.font[i].imgList.length; j++) {
                            vm.font[i].imgList[j].value = vm.font[i].imgList[j].path;
                        }

                    }
                } else {
                    layer.msg(result.msg, {time: 1500});
                }
            });
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
                        url: $defaultConfig.app_uri + '/apply/uploadDocumentInfo',
                        headers: {
                            token: vm.user.token
                        },
                        file: files,
                        data: {applyId: $stateParams.id, documentationId: obj.id},
                    }).progress(function (evt) {//上传进度
                    }).success(function (data, status, headers, config) {
                        $layer.close();
                        if (data.code == 0) {
                            $layer.close();
                            if (vm.testImg.test(data.data.path)) {
                                obj.imgList.push({
                                    value: data.data.path,
                                    isImg: true,
                                    documentationId: data.data.id
                                });
                            } else {
                                obj.imgList.push({
                                    value: data.data.path,
                                    isImg: false,
                                    documentationId: data.data.id
                                });
                            }
                        } else {
                            $layer.close();
                            layer.msg(data.msg, {time: 1500});
                        }
                    }).error(function (data, status, headers, config) {
                        $layer.close();
                        layer.msg('服务器异常，请重新尝试', {time: 1000});
                    });
                }
            };
            //删除图片
            vm.deleteUploadImg = function (index, list, current) {
                layer.confirm('确定要删除吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    layer.closeAll();
                    $api.post('/apply/deleteDocumentInfo', angular.toJson({id: current.documentationId}), function (result) {
                        if (result.code == 0) {
                            list.splice(index, 1);
                            layer.msg(result.msg, {time: 1000});
                        } else {
                            layer.msg(result.msg, {time: 1500});
                        }
                    });
                })

            };
            // 补充理赔字段
            vm.supplyField = function () {
                $api.post('/apply/supplyField',angular.toJson(vm.supplyFieldInfo),function (result) {
                    if(result.code == 0){
                        vm.supplyFieldPop = true;
                        vm.supplyFieldList = result.data;
                    }else {
                        layer.msg(result.msg,{time:1500});
                    }
                })
            };
            // 补充理赔字段提交信息
            vm.supplyInfoSubmit = function () {
                vm.supplyInfo.data = [];
                for (var i = 0; i < vm.supplyFieldList.length; i++) {
                    vm.supplyInfo.data.push({
                        name: vm.supplyFieldList[i].name,
                        value: vm.supplyFieldList[i].value
                    })
                }
                $api.post('/apply/supplyInfo', angular.toJson(vm.supplyInfo), function (result) {
                    if (result.code == 0) {
                        vm.supplyFieldPop = false;
                        layer.msg(result.msg, {time: 1000})
                    } else {
                        layer.msg(result.msg, {time: 1500});
                    }
                })
            };
            //解压文件
            vm.unzipFile = function () {
                $api.get('/apply/showPic/'+$stateParams.id,function (result) {
                    vm.showPicList = result.data;
                })
            };
            //审核框显示并获取信息
            vm.getData = function () {
                vm.popShow = true;
                vm.applyAudit.indemnifySum = vm.info.indemnifySum;
                vm.applyAudit.applyRemark = vm.info.applyRemark;
            };
        }])
}());