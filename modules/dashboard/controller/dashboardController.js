var app = angular.module('dashboard', ['ngCookies', 'app.config', 'app.services', 'app.layer', 'app.util']);
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.withCredentials = false;
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' +
                        encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}]);
app.controller('dashboardController', ['$scope', '$cookies', '$cookieStore', '$defaultConfig', '$api', '$util', '$http', '$layer', '$timeout', function ($scope, $cookies, $cookieStore, $defaultConfig, $api, $util, $http, $layer, $timeout) {
    var vm = this;
    vm.user = JSON.parse(localStorage.getItem('user'));
    // vm.user = $cookies.get('user');//获取用户名
    // vm.isFront = $cookies.get('isFront');//获取用户前台后台显示
    // vm.ePoints = $cookies.get('epoints');//获取ePoints
    // vm.isMerchantManagement = $cookies.get('isMerchantManagement');//商户管理是否显示
    // vm.isPandect = $cookies.get('isPandect');//总览是否显示
    // vm.isUserManagement = $cookies.get('isUserManagement');//用户管理是否显示
    // vm.isCenter = $cookies.get('isCenter');//后台管理中心是否显示
    // vm.isAdmin = $cookies.get('isAdmin');//是否是Admin


    //获取数据总览数据
    $api.get('/v1/statics/getOrderPremiumInsurance', function (result) {
            if(result.code == 0){
                vm.totalData = result.data;
                vm.totalData.rate = (vm.totalData.rate * 100).toFixed(2)
            }
    });


    vm.currentCle = 0;
    // 业务总览
    var cle_1 = echarts.init(document.getElementById('cle_1'));
    // var cle_2 = echarts.init(document.getElementById('cle_2'));
    // var cle_3 = echarts.init(document.getElementById('cle_3'));
    // var cle_4 = echarts.init(document.getElementById('cle_4'));
    var cle_1_option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
            {
                name: '总保费',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: true,
                labelLine: {
                    normal: {
                        show: true
                    }
                },
                data: [
                    {value: 1134571.54, name: '物流保障类'},
                    {value: 6100711.85, name: '信用保障类'},
                    {value: 329767.07, name: '通关保障类'},
                    {value: 166358.05, name: '售后保障类'}
                ]
            },
        ],
        color: ['#fe6f5a', '#84c22b', '#5c95fe', '#b48bf7']
    };
    // var cle_2_option = {
    //     backgroundColor: '#fff',
    //     tooltip: {
    //         trigger: 'item',
    //         formatter: "{a} <br/>{b}: {c} ({d}%)"
    //     },
    //     series: [
    //         {
    //             name: '总商户数',
    //             type: 'pie',
    //             radius: ['50%', '70%'],
    //             avoidLabelOverlap: true,
    //             labelLine: {
    //                 normal: {
    //                     show: true
    //                 }
    //             },
    //             data: [
    //                 {value: 1200, name: '物流保障类'},
    //                 {value: 300, name: '信用保障类'},
    //                 {value: 300, name: '质量保障类'},
    //                 {value: 100, name: '售后保障类'},
    //                 {value: 100, name: '价格保障类'},
    //             ]
    //         },
    //     ],
    //     color: ['#fe6f5a', '#84c22b', '#5c95fe', '#b48bf7', '#fbcd3f']
    // };
    // var cle_3_option = {
    //     backgroundColor: '#fff',
    //     tooltip: {
    //         trigger: 'item',
    //         formatter: "{a} <br/>{b}: {c} ({d}%)"
    //     },
    //     series: [
    //         {
    //             name: '总用户数',
    //             type: 'pie',
    //             radius: ['50%', '70%'],
    //             avoidLabelOverlap: true,
    //             labelLine: {
    //                 normal: {
    //                     show: true
    //                 }
    //             },
    //             data: [
    //                 {value: 130000, name: '物流保障类'},
    //                 {value: 30000, name: '信用保障类'},
    //                 {value: 20000, name: '质量保障类'},
    //                 {value: 10000, name: '售后保障类'},
    //                 {value: 10000, name: '价格保障类'},
    //             ]
    //         },
    //     ],
    //     color: ['#fe6f5a', '#84c22b', '#5c95fe', '#b48bf7', '#fbcd3f']
    // };
    // var cle_4_option = {
    //     backgroundColor: '#fff',
    //     tooltip: {
    //         trigger: 'item',
    //         formatter: "{a} <br/>{b}: {c} ({d}%)"
    //     },
    //     series: [
    //         {
    //             name: '总订单数',
    //             type: 'pie',
    //             radius: ['50%', '70%'],
    //             avoidLabelOverlap: true,
    //             labelLine: {
    //                 normal: {
    //                     show: true
    //                 }
    //             },
    //             data: [
    //                 {value: 130000, name: '物流保障类'},
    //                 {value: 30000, name: '信用保障类'},
    //                 {value: 20000, name: '质量保障类'},
    //                 {value: 10000, name: '售后保障类'},
    //                 {value: 10000, name: '价格保障类'},
    //             ]
    //         },
    //     ],
    //     color: ['#fe6f5a', '#84c22b', '#5c95fe', '#b48bf7', '#fbcd3f']
    // };
    cle_1.setOption(cle_1_option);
    // cle_2.setOption(cle_2_option);
    // cle_3.setOption(cle_3_option);
    // cle_4.setOption(cle_4_option);

    //险种分布图
    var block = echarts.init(document.getElementById('block'));


    block.showLoading();
    $.get('json/disk.tree.json', function (diskData) {
        block.hideLoading();

        function colorMappingChange(value) {
            var levelOption = getLevelOption(value);
            chart.setOption({
                series: [{
                    levels: levelOption
                }]
            });
        }

        var formatUtil = echarts.format;

        function getLevelOption() {
            return [
                {
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            gapWidth: 5,
                        }
                    }
                },
                {
                    itemStyle: {
                        normal: {
                            gapWidth: 1,
                        }
                    }
                },
                {
                    colorSaturation: [0.35, 0.5],
                    itemStyle: {
                        normal: {
                            gapWidth: 1,
                            borderColorSaturation: 0.6
                        }
                    }
                }
            ];
        }

        block.setOption(block_option = {
            backgroundColor: '#fff',
            // title: {
            //     text: 'Disk Usage',
            //     left: 'center'
            // },
            tooltip: {
                formatter: function (info) {
                    var value = info.value;
                    var treePathInfo = info.treePathInfo;
                    var treePath = [];
                    for (var i = 1; i < treePathInfo.length; i++) {
                        treePath.push(treePathInfo[i].name);
                    }
                    return [
                        '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>'
                    ].join('');
                }
            },
            series: [
                {
                    roam: false,
                    name: '所有险种',
                    type: 'treemap',
                    visibleMin: 300,
                    // color:['#fe6c59','#3b74c7','#66b9bd','#dd6b66','#f49f42'],
                    label: {
                        show: true,
                        formatter: '{b}'
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                        }
                    },
                    levels: getLevelOption(),
                    data: diskData
                }
            ]
        });
    });

    //物流保障类业务数据
    var lineEchart = echarts.init(document.getElementById('lineEchart'));
    var lineEchart_option = {
        backgroundColor: '#fff',
        grid: {
            x: 100,
            y: 150,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data: ['订单量', '保费量'],
            x: 'center',
            y: 50
        },
        xAxis: [
            {
                type: 'category',
                data: ['2017-07', '2017-08', '2017-09', '2017-10', '2017-11', '2017-12', '2018-01', '2018-02', '2018-03', '2018-04'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '数量',
                min: 0,
                max: 1000000,
                interval: 100000,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '保费量',
                min: 0,
                max: 1000000,
                interval: 100000,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: '订单量',
                type: 'bar',
                data: [20182, 35861, 77180, 153981, 159903, 207035, 293361, 65613, 447469, 852087],
                itemStyle: {
                    normal: {color: '#fe6c59'}
                },
                barMaxWidth:50,//最大宽度
            },
            {
                name: '保费量',
                type: 'line',
                yAxisIndex: 1,
                data: [61744, 70470, 220160, 405122, 314109.7, 254546, 208131, 83387.65, 395982, 829289],
                itemStyle: {
                    normal: {color: '#5c95fe'}
                }
            }
        ]
    };
    lineEchart.setOption(lineEchart_option);

    //航线图
    // var flights = echarts.init(document.getElementById('flights'));
    // var uploadedDataURL = "json/flights.json";
    // flights.showLoading();
    // $.getJSON(uploadedDataURL, function (data) {
    //     flights.hideLoading();
    //
    //     function getAirportCoord(idx) {
    //         return [data.airports[idx][3], data.airports[idx][4]];
    //     }
    //
    //     var routes = data.routes.map(function (airline) {
    //         return [
    //             getAirportCoord(airline[1]),
    //             getAirportCoord(airline[2])
    //         ];
    //     });
    //
    //     flights.setOption({
    //         geo3D: {
    //             map: 'world',
    //             shading: 'realistic',
    //             silent: true,
    //             environment: '#333',
    //             realisticMaterial: {
    //                 roughness: 0.8,
    //                 metalness: 0
    //             },
    //             postEffect: {
    //                 enable: true
    //             },
    //             groundPlane: {
    //                 show: false
    //             },
    //             light: {
    //                 main: {
    //                     intensity: 1,
    //                     alpha: 30
    //                 },
    //                 ambient: {
    //                     intensity: 0
    //                 }
    //             },
    //             viewControl: {
    //                 distance: 70,
    //                 alpha: 89,
    //                 panMouseButton: 'left',
    //                 rotateMouseButton: 'right'
    //             },
    //
    //             itemStyle: {
    //                 areaColor: '#000'
    //             },
    //             regionHeight: 0.5
    //         },
    //         series: [{
    //             type: 'lines3D',
    //             coordinateSystem: 'geo3D',
    //             effect: {
    //                 show: true,
    //                 trailWidth: 1,
    //                 trailOpacity: 0.5,
    //                 trailLength: 0.2,
    //                 constantSpeed: 5
    //             },
    //             blendMode: 'lighter',
    //
    //             lineStyle: {
    //                 width: 0.2,
    //                 opacity: 0.05
    //             },
    //             data: routes
    //         }]
    //     });
    //
    //     window.addEventListener('keydown', function () {
    //         flights.dispatchAction({
    //             type: 'lines3DToggleEffect',
    //             seriesIndex: 0
    //         });
    //     });
    // });

    //总览
    vm.toDashborad = function () {
        window.location.href = $defaultConfig.current_uri + 'dashboard.html';
    };
    //后台管理
    vm.toSelf = function () {
        window.location.href = $defaultConfig.current_uri + 'index.html#/personalOrder.html'
    }

}]);