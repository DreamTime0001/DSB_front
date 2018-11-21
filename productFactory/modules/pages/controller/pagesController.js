(function () {
    'use strict';
    angular.module('app.controllers', ['ngCookies', 'angularFileUpload'])
        // 首页
        .controller('pagesController', ['$state', '$cookies', '$timeout', '$api', '$defaultConfig', '$location', '$filter', '$http', '$layer', '$anchorScroll', '$scope', '$compile', '$rootScope', function ($state, $cookies, $timeout, $api, $defaultConfig, $location, $filter, $http, $layer, $anchorScroll, $scope, $compile, $rootScope) {
            var vm = this;
            vm.shopLayerPop = false;
            $scope.tempList = [];
            $scope.saveList = [];
            $scope.res = [];
            $scope.isSettle = false;
            var loginPop_html;
            loginPop_html = $compile('<div class="pop-mask" ng-if="loginPop">\n' +
                '        <div class="login-pop">\n' +
                '            <div class="close">\n' +
                '                <a href="javascript:;" class="ico" ng-click="vm.closeLoginPop()"></a>\n' +
                '            </div>\n' +
                '            <h2 style="text-align: center">欢迎登录</h2>\n' +
                '            <ul>\n' +
                '                <li>\n' +
                '                    <span class="left">用户名：</span>\n' +
                '                    <input type="text" placeholder="请输入用户名" ng-model="vm.query.telephone" id="telephone"\n' +
                '                           ng-keypress="vm.loginKeyPress($event)">\n' +
                '                </li>\n' +
                '                <li>\n' +
                '                    <span class="left">密码：</span>\n' +
                '                    <input type="password" placeholder="请输入密码" ng-model="vm.query.password" id="password"\n' +
                '                           ng-keypress="vm.loginKeyPress($event)">\n' +
                '                </li>\n' +
                '            </ul>\n' +
                '            <div class="bottom-ico">\n' +
                '                <a href="javascript:;" class="nomal" ng-click="vm.toRegister()">注 册</a>\n' +
                '                <a href="javascript:;" class="buy" ng-click="vm.login()">登 录</a>\n' +
                '            </div>\n' +
                '        </div>\n' +
                '    </div>')($scope);
            angular.element('body').append(loginPop_html);
            $scope.shop = {
                shopList: [],
                allChecked: true
            };
            $scope.sumPrice = 0;
            vm.user = JSON.parse(localStorage.getItem('user'));
            $scope.loginPop = false;
            //移动端购物车默认隐藏
            $scope.shopListShow = false;
            vm.query = {
                telephone: '',
                password: ''
            };
            vm.productShopList = {
                pageNum: 1,
                pageSize: 20,
                ids: null,
                configV1Id: '',
                configV2Id: '',
                configV3Id: '',
                pages: 1,
                source: ''
            };
            //登录层显示
            $scope.showLoginPop = function () {
                $scope.loginPop = true;
            };
            //注册按钮
            vm.toRegister = function () {
                window.location.href = $defaultConfig.outside_uri + '/register.html'
            };
            //登录按钮
            vm.login = function () {
                if (!vm.query.telephone) {
                    return layer.msg('请输入用户名', { time: 1000 })
                }
                if (!vm.query.password) {
                    return layer.msg('请输入密码', { time: 1000 })
                }
                $api.post('/user/login', angular.toJson(vm.query), function (result) {
                    if (result.code === 0) {
                        $scope.loginPop = false;
                        vm.user = {
                            token: result.token,
                            isFront: result.isFront,//用户属于前台还是后台
                            epoints: result.epoints,//用户的epotints金额
                            userId: result.userId,//用户的userId
                            isMerchantManagement: result.isMerchantManagement,//商户管理是否显示
                            isPandect: result.isPandect,//总览是否显示
                            isUserManagement: result.isUserManagement,//用户管理是否显示
                            isCenter: result.isCenter,//后台管理中心是否显示
                            isAdmin: result.isAdmin,//是否是Admin
                            username: result.username,//登录名
                            source : result.source
                        };
                        //如果是产品工厂页，获取列表
                        if ($location.url() == '/productFactoryList.html' && $scope.isSettle == false) {
                            vm.productShopList.source = vm.user.source;
                            $api.post('/v1/tb/product/productShop', angular.toJson(vm.productShopList), function (result) {
                                $scope.$broadcast('shopList', result.data);
                            })
                        }
                        localStorage.clear();//清除缓存
                        localStorage.setItem('user', JSON.stringify(vm.user));
                        //保存未登录时选择的产品
                        if ($scope.shop.shopList.length > 0) {
                            $scope.tempList = $scope.shop.shopList;
                            for (var i = 0; i < $scope.tempList.length; i++) {
                                $scope.tempList[i].isRep = false;
                            }
                        }
                        //获取登录之后的购物车
                        $api.post('/tbcard/list', function (result) {
                            if (result.code == 0) {
                                $scope.shop.allChecked = result.data.allChecked;
                                $scope.shop.shopList = result.data.shopList;
                                if ($scope.shop.shopList.length > 0 && $scope.tempList.length > 0) {
                                    for (var i = 0; i < $scope.tempList.length; i++) {
                                        for (var j = 0; j < $scope.shop.shopList.length; j++) {
                                            if ($scope.shop.shopList[j].productPackageId == $scope.tempList[i].productPackageId && $scope.shop.shopList[j].configV5Desc == $scope.tempList[i].configV5Desc && $scope.shop.shopList[j].configV6Desc == $scope.tempList[i].configV6Desc) {
                                                $scope.shop.shopList[j].num++;
                                                $scope.tempList[i].isRep = true;
                                            }
                                        }
                                    }
                                    for (var i = 0; i < $scope.tempList.length; i++) {
                                        if ($scope.tempList[i].isRep == false) {
                                            $scope.shop.shopList.unshift($scope.tempList[i]);
                                        }
                                    }
                                    for (var i = 0; i < $scopev.shopList.length; i++) {
                                        $scope.shop.shopList[i].priceSum = ($scope.shop.shopList[i].price * $scope.shop.shopList[i].num).toFixed(2);
                                    }
                                    $scope.sumPrice = $scope.getSum().toFixed(2);
                                }
                                if ($scope.shop.shopList.length == 0) {
                                    $scope.shop.shopList = $scope.tempList;
                                }
                                $api.post('/productfactory/updateCard', angular.toJson($scope.shop), function (result) {
                                    if (result.code == 0) {
                                        $scope.shop = result.data;
                                        if ($scope.shop.shopList.length > 0) {
                                            for (var i = 0; i < $scope.shop.shopList.length; i++) {
                                                $scope.shop.shopList[i].priceSum = ($scope.shop.shopList[i].price * $scope.shop.shopList[i].num).toFixed(2);
                                            }
                                            $scope.sumPrice = $scope.getSum().toFixed(2);
                                        }
                                        vm.query = {
                                            telephone: '',
                                            password: ''
                                        };
                                        if (result.company) {
                                            vm.user.source = result.company.source
                                        }
                                        vm.isComplete = result.isComplete;//是否完善良信息
                                        if (vm.isComplete == 0) {
                                            window.location.href = $defaultConfig.outside_uri + '/perfectInfo.html'
                                        } else {
                                            $api.get('/user/menus', function (result) {
                                                var menuList = result.data.menuList;
                                                vm.user.user = result.user;
                                                localStorage.setItem('user', JSON.stringify(vm.user));//用户名
                                                localStorage.setItem('menuList', JSON.stringify(menuList));//当前第一页
                                                if ($location.url() == '/merchant.html') {
                                                    $state.go('productFactoryList')
                                                }
                                                //从去结算按钮点入
                                                if ($scope.isSettle) {
                                                    window.location.href = $defaultConfig.outside_uri + '/index.html#/productFactoryCar.html';
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        layer.msg(result.msg, { time: 1000 });
                    }
                });
            };
            //登录回车事件
            vm.loginKeyPress = function (event) {
                if (event.charCode == 13) {
                    vm.login();
                }
            };
            //关闭登录层
            vm.closeLoginPop = function () {
                $scope.loginPop = false;
                vm.query = {
                    telephone: '',
                    password: ''
                }
            };
            //购物车显示隐藏
            vm.togglePop = function () {
                if (vm.shopLayerPop == false) {
                    vm.shopLayerPop = true;
                    vm.isRouter = true;
                } else {
                    vm.shopLayerPop = false;
                    vm.isRouter = false;
                }
            };
            //获取总价
            $scope.getSum = function () {
                var sum = null;
                for (var i = 0; i < $scope.shop.shopList.length; i++) {
                    sum += Number($scope.shop.shopList[i].priceSum)
                }
                return sum;
            };
            //加法
            $scope.toPlus = function (obj) {
                obj.num += 1;
                obj.priceSum = (obj.price * obj.num).toFixed(2);
                $scope.sumPrice = $scope.getSum().toFixed(2);
                if (vm.user) {
                    if (vm.user.token) {
                        $api.post('/productfactory/updateCard', angular.toJson($scope.shop), function (result) {
                            if (result.code == 0) {
                                $scope.shop = result.data;
                                if ($scope.shop.shopList.length > 0) {
                                    for (var i = 0; i < $scope.shop.shopList.length; i++) {
                                        $scope.shop.shopList[i].priceSum = ($scope.shop.shopList[i].price * $scope.shop.shopList[i].num).toFixed(2);
                                    }
                                    $scope.sumPrice = $scope.getSum().toFixed(2);
                                }
                            }
                        });
                    }
                }
            };
            //减法
            $scope.toMinus = function (obj) {
                if (obj.num > 1) {
                    obj.num -= 1;
                    obj.priceSum = (obj.priceSum - obj.price).toFixed(2);
                    $scope.sumPrice = $scope.getSum().toFixed(2);
                    if (vm.user) {
                        if (vm.user.token) {
                            $api.post('/productfactory/updateCard', angular.toJson($scope.shop), function (result) {
                                if (result.code == 0) {
                                    $scope.shop = result.data;
                                    if ($scope.shop.shopList.length > 0) {
                                        for (var i = 0; i < $scope.shop.shopList.length; i++) {
                                            $scope.shop.shopList[i].priceSum = ($scope.shop.shopList[i].price * $scope.shop.shopList[i].num).toFixed(2);
                                        }
                                        $scope.sumPrice = $scope.getSum().toFixed(2);
                                    }
                                }
                            });
                        }
                    }
                }
            };
            //删除
            $scope.toDelete = function (index, obj) {
                $scope.shop.shopList.splice(index, 1);
                if (vm.user) {
                    if (vm.user.token) {
                        $api.post('/productfactory/deleteShopCard', angular.toJson({ id: obj.id }), function (result) {
                            if (result.code == 0) {
                                layer.msg(result.msg, { time: 1000 })
                            }
                            else {
                                layer.msg(result.msg, { time: 1000 })
                            }
                        });
                    }
                }
                if ($scope.shop.shopList.length == 0) {
                    $scope.sumPrice = 0
                } else {
                    $scope.sumPrice = $scope.getSum().toFixed(2);
                }

            };
            //去结算
            $scope.toSettle = function () {
                if (vm.user) {
                    if (vm.user.token) {
                        $api.get('/user/menus', function (result) {
                            var menuList = result.data.menuList;
                            var landingPage = menuList[0].list[0].url;
                            $cookies.put('landingPage', landingPage);//当前第一页
                            localStorage.setItem('menuList', JSON.stringify(menuList));
                            window.location.href = $defaultConfig.outside_uri + '/index.html#/productFactoryCar.html';
                        });
                    }
                } else {
                    $scope.loginPop = true;
                    $scope.isSettle = true;
                }
            };
            //跳转SaaS
            $scope.toSaaS = function () {
                $api.get('/user/menus', function (result) {
                    var menuList = result.data.menuList;
                    var landingPage = menuList[0].list[0].url;
                    $cookies.put('landingPage', landingPage);//当前第一页
                    localStorage.setItem('menuList', JSON.stringify(menuList));
                    window.location.href = $defaultConfig.outside_uri + '/index.html#/' + landingPage + '.html';
                });
            };
        }])
}());