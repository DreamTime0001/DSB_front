(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('claimOrderController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$cookies', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.user = JSON.parse(localStorage.getItem('user'));
            vm.localQuery = JSON.parse(localStorage.getItem('claimOrder'));
            //查询条件
            if (vm.localQuery) {
                vm.query = vm.localQuery;
            } else {
                vm.query = {
                    pageNum: 1,
                    pageSize: 10,
                    source: vm.user.source,
                    status: '',
                    ticketNo: '',
                    startTime: '',
                    endTime: '',
                    url: 'claimOrder'
                };
            }
            vm.exlModel = $defaultConfig.app_uri + '/upload/apply/理赔模板.zip';
            vm.upload = {
                dataMap: [],
                filePath: '',
                backFile: ''
            };
            // 状态列表
            vm.statusList = [
                {
                    status: 2,
                    name: '待审核'
                },
                {
                    status: 6,
                    name: '审核中'
                },
                {
                    status: 11,
                    name: '待打款'
                },
                {
                    status: 3,
                    name: '已付款'
                },
                {
                    status: 4,
                    name: '驳回'
                }
            ];
            //获取列表
            vm.getPagedDataAsync = function () {
                $api.post('/apply/applyList', angular.toJson(vm.query), function (result) {
                    if (result.code === 0) {
                        vm.total = result.data.total;//总条数
                        vm.list = result.data.list;
                        vm.downLoadList = result.data.list;
                        for (var i = 0; i < vm.downLoadList.length; i++) {
                            if (vm.downLoadList[i].productType == 3 || vm.downLoadList[i].productType == 4) {
                                vm.downLoadList[i].productShowName = vm.downLoadList[i].applyProductName + '_' + vm.downLoadList[i].groupProductName;
                            } else {
                                vm.downLoadList[i].productShowName = vm.downLoadList[i].applyProductName
                            }
                        }
                        if (vm.list.length > 0) {
                            vm.money = vm.list[0].money1;
                        }
                        vm.query.pages = result.data.pages;
                        for (var i in vm.list) {
                            //产品名显示
                            if (vm.list[i].productType == 3 || vm.list[i].productType == 4) {
                                vm.list[i].applyProductName = vm.list[i].groupProductName;
                            }
                            if (vm.list[i].status == 2 || vm.list[i].status == 5) {
                                vm.list[i].statusText = "待审核";
                            }
                            else if (vm.list[i].status == 6) {
                                vm.list[i].statusText = "审核中";
                            }
                            else if (vm.list[i].status == 11) {
                                vm.list[i].statusText = "待打款";
                            }
                            else if (vm.list[i].status == 3) {
                                vm.list[i].statusText = " 已付款";
                            }
                            else if (vm.list[i].status == 4) {
                                vm.list[i].statusText = "驳回";
                            }
                            //判断是否可以发起申诉
                            if (vm.list[i].appeal == true) {
                                if (vm.list[i].status == 11 || vm.list[i].status == 4) {
                                    vm.list[i].isClaim = true;
                                }
                            } else {
                                vm.list[i].isClaim = false;
                            }
                        }
                    }
                })
            };
            //日期初始化
            var toDay = new Date();
            //开始时间
            initDate('#startDate', 'yyyy-mm-dd', 2, function (date) {
                $('#endDate').datetimepicker('setStartDate', date);
            });
            //结束时间
            initDate('#endDate', 'yyyy-mm-dd', 2, function (date) {
                $('#startDate').datetimepicker('setEndDate', date);
            });

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //新增理赔
            vm.claimAdd = function () {
                localStorage.removeItem('infor');//先清除再获取
                $state.go('claimOrderAdd');
            };
            //查询
            vm.search = function () {
                localStorage.setItem("claimOrder", JSON.stringify(vm.query));
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //导出Excel
            vm.downloadExcel = function () {
                if (vm.list && vm.list.length > 0) {
                    $layer.loading();
                    $("#tableInfo").table2excel({
                        exclude: ".noExl",
                        name: "Excel Document Name",
                        filename: "理赔订单" + new Date().toISOString().replace(/[\-\:\.]/g, "") + '.xls',
                        fileext: ".xls",
                        exclude_img: true,
                        exclude_links: true,
                        exclude_inputs: true
                    });
                    $timeout(function () {
                        $layer.close();
                    }, 1500)
                } else {
                    layer.msg('请先查询出结果', {time: 1000});
                }
            };
            //附件上传-选择excel
            vm.readExcel = function (obj) {
                var files = obj;
                vm.file = files[0];
                vm.fileName = files[0].name;
                if (vm.fileName.indexOf('+') > -1 || vm.fileName.indexOf(' ') > -1) {
                    $layer.close();
                    return layer.msg('文件名不能含有空格或者+', {time: 1000})
                }
                var fileReader = new FileReader();
                fileReader.onload = function (ev) {
                    try {
                        var data = ev.target.result,
                            workbook = XLSX.read(data, {
                                type: 'binary'
                            }), // 以二进制流方式读取得到整份excel表格对象
                            persons = []; // 存储获取到的数据
                    } catch (e) {
                        return layer.msg('文件类型不正确', {time: 1000});
                    }
                    // 表格的表格范围，可用于判断表头是否数量是否正确
                    var fromTo = '';
                    // 遍历每张表读取
                    for (var sheet in workbook.Sheets) {
                        if (workbook.Sheets.hasOwnProperty(sheet)) {
                            fromTo = workbook.Sheets[sheet]['!ref'];
                            persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                            break; // 如果只取第一张表，就取消注释这行
                        }
                    }
                    var str = "";
                    if (persons.length > 200) {
                        layer.msg('数据不能超过200条', {time: 1000});
                        vm.canUpload = false;
                    } else {
                        vm.upload.dataMap = persons;
                        for (var x in vm.upload.dataMap) {
                            if (vm.upload.dataMap[x]['豆沙包单号']) {
                                vm.upload.dataMap[x].ticketNo = vm.upload.dataMap[x]['豆沙包单号']
                            }
                            if (vm.upload.dataMap[x]['商品品类']) {
                                vm.upload.dataMap[x].goodsKind = vm.upload.dataMap[x]['商品品类']
                            }
                            if (vm.upload.dataMap[x]['产品类型ID']) {
                                vm.upload.dataMap[x].productId = vm.upload.dataMap[x]['产品类型ID']
                            }
                            if (vm.upload.dataMap[x]['理赔金额/元']) {
                                vm.upload.dataMap[x].applyAmount = vm.upload.dataMap[x]['理赔金额/元']
                            }
                            if (vm.upload.dataMap[x]['理赔金额明细']) {
                                vm.upload.dataMap[x].applyAmountDetail = vm.upload.dataMap[x]['理赔金额明细']
                            }
                            if (vm.upload.dataMap[x]['身份证号']) {
                                vm.upload.dataMap[x].idCard = vm.upload.dataMap[x]['身份证号']
                            }
                        }
                        $api.post('/apply/uploadApplyByExcel', angular.toJson(vm.upload), function (result) {
                            if (result.code == 0 && result.data.data == '') {
                                layer.msg(result.msg, {time: 1000});
                                vm.canUpload = true;
                            }
                            if (result.code == 0 && result.data.data != '') {
                                layer.alert(result.data.data, {
                                    area: ['380px', '280px']
                                });
                                vm.file = '';
                                vm.fileName = '';
                            }
                            if (result.code == 1) {
                                layer.msg(result.msg, {time: 1000});
                                vm.file = '';
                                vm.fileName = '';
                            }
                        });
                    }
                };
                // 以二进制方式打开文件
                fileReader.readAsBinaryString(files[0]);
                // body...
            };
            //zip上传
            vm.readZip = function (obj) {
                $layer.loading();
                var files = obj;
                vm.fileZip = files[0];
                vm.zipName = files[0].name;
                if (vm.zipName.indexOf('+') > -1 || vm.zipName.indexOf(' ') > -1) {
                    $layer.close();
                    return layer.msg('文件名不能含有空格或者+', {time: 1000})
                }
                if (files) {
                    $upload.upload({
                        url: $defaultConfig.app_uri + '/apply/upload',
                        headers: {
                            token: vm.user.token
                        },
                        file: vm.fileZip
                    }).progress(function (evt) {//上传进度
                    }).success(function (data, status, headers, config) {
                        if (data.code == 0) {
                            $layer.close();
                            layer.msg(data.msg, {time: 1000});
                            vm.upload.backFile = data.data;
                            vm.canZip = true;
                        } else {
                            layer.msg(data.msg, {time: 1000});
                        }
                    }).error(function (data, status, headers, config) {
                        $layer.close();
                        layer.msg('服务器异常，请重新尝试', {time: 1000});
                    });
                }

            };
            //附件上传-提交
            vm.uploadAll = function () {
                vm.upload.filePath = vm.upload.backFile;
                $api.post('/apply/uploadApplyByExcel', angular.toJson(vm.upload), function (result) {
                    if (result.code == 0) {
                        if (result.data.message == 'error') {
                            layer.alert(result.data.data, {
                                area: ['380px', '280px'],
                            });
                        } else {
                            layer.msg(result.msg, {time: 1000});
                            vm.popAnnex = false;
                            vm.query.pageNum = 1;
                            vm.getPagedDataAsync();
                        }
                    } else {
                        layer.msg(result.msg, {time: 1000});
                    }
                });
            };

            //发起申诉
            vm.getClaimInfo = function (obj) {
                localStorage.removeItem('infor');//先清除再获取
                vm.infor =
                    {
                        id: obj.id,
                        applyProductId: obj.applyProductId,
                        expressNo: obj.expressNo,
                        ticketNo: obj.ticketNo,
                        applyProductCombinationId: obj.applyProductCombinationId,
                        applyProductName: obj.applyProductName,
                        indemnifySum: obj.indemnifySum,
                        name: obj.name,
                        parentProductId: obj.parentProductId,
                        applyAmount: obj.applyAmount
                    };
                localStorage.setItem('infor', JSON.stringify(vm.infor));
                $state.go('claimOrderEdit');
            };
            // 重置
            vm.clear = function () {
                vm.query.ticketNo = "";
                vm.query.status = "";
                vm.query.startTime = "";
                vm.query.endTime = "";
                vm.query.source = vm.user.source;
            };
            //关闭批量层
            vm.closePop = function () {
                vm.popAnnex = false;
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            }
        }])
}());