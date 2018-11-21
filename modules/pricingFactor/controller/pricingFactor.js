(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('pricingFactorController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.AlgorithmShow = false;//算法调整显示
            vm.isPortStatus = '显示';
            vm.isPort = false;
            vm.popShow = false;
            vm.currentType = 'base';
            //查询条件
            vm.query = {
                pageNum: 1,
                pageSize: 10,
                type: 'base'
            };


            //获取列表
            vm.getPagedDataAsync = function () {
                $api.post('/price/selectOrderPriceConfig', angular.toJson(vm.query), function (result) {
                    if (result.code === 0) {
                        vm.list = result.data.list;
                        vm.query.pages = result.data.pages;
                    }
                });
            };
//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //切换列表
            vm.changeType = function (type) {
                vm.currentType = type;
                vm.query.type = type;
                vm.getPagedDataAsync();
            };
            //显示算法调整输入框
            vm.showAlgorithm = function () {
                $api.post('/price/selectBaseFactor', function (result) {
                    if (result.code === 0) {
                        vm.dictName = result.data.dictName;
                    }
                });
                vm.AlgorithmShow = true;

            };
            //更新算法
            vm.updateDictName = function () {
                if (vm.dictName == '') {
                    return layer.msg('请输入基础系数比例', {time: 1000});
                }
                if (/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(vm.dictName)) {
                    $api.post('/price/updateFactorPrecent', angular.toJson({value: vm.dictName}), function (result) {
                        if (result.code === 0) {
                            vm.AlgorithmShow = false;
                            layer.msg(result.msg, {time: 1000});
                        }
                    });
                } else {
                    return layer.msg('请输入正确格式', {time: 1000});
                }
            };
            //更新因子系数
            vm.updeFactorPrecent = function (obj) {
                    if(obj.factor == ''){
                        return layer.msg('请输入调整系数', {time: 1000});
                    }
                if (/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(obj.factor)) {
                    $api.post('/price/updateOrderPriceConfigById', angular.toJson({factor: obj.factor,id:obj.id}), function (result) {
                        if (result.code === 0) {
                            layer.msg(result.msg, {time: 1000});
                            obj.checked = false;
                        }
                    });
                } else {
                    return layer.msg('请输入正确格式', {time: 1000});
                }

            };

            var data = [
                [[0, 1.05, 150000000, '投保单量稳定度', 1990], [4, 0.8, 80000000, '商户信用等级', 1990], [6, 1, 50000000, '复购情况', 2015], [9, 1.5, 150000000, '购物商品起运地', 1990], [11, 1.1, 80000000, '运输方式', 2015]],
                [[1, 0.75, 150000000, '赔付率', 2015], [3, 0.8, 80000000, '商户等级', 2015], [5, 0.95, 50000000, '低于常规', 2015], [8, 2, 10000000, '用户信用等级', 2015], [10, 0.9, 10000000, '购物网站等级', 2015], [12, 1.2, 80000000, '目的口岸', 2015]]
            ];
            var pricing = echarts.init(document.getElementById('pricing'));
            var pricing_option = {
                textStyle: {
                    color: '#000'
                },
                backgroundColor: "#fff",
                // legend: {
                //     right: 10,
                //     data: ['1990', '2015']
                // },
                xAxis: {
                    min: 0,
                    max: 14,
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    data: ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14"]
                },
                yAxis: {
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    scale: true,
                    min: 0,
                    max: 2.5

                },
                series: [{
                    name: '1990',
                    data: data[0],
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[2]) / 5e2;
                    },
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        textStyle: {
                            color: '#000'
                        },
                        normal: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(120, 36, 50, 0.5)',
                            shadowOffsetY: 5,
                            color: '#fe6c59'
                        }
                    }
                }, {
                    name: '2015',
                    data: data[1],
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[2]) / 5e2;
                    },
                    label: {
                        textStyle: {
                            color: '#000'
                        },
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(25, 100, 150, 0.5)',
                            shadowOffsetY: 5,
                            color: '#4687e6'
                        }
                    }
                }]
            };
            pricing.setOption(pricing_option);

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
        }])
}());