var app = angular.module('perfectInfo', ['ngCookies', 'app.config', 'app.services', 'app.layer', 'app.util']);
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;utf-8';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;utf-8';
    $httpProvider.defaults.withCredentials = true;
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
app.controller('perfectInfoController', ['$scope', '$cookies', '$cookieStore', '$defaultConfig', '$api', '$util', '$http', '$layer', '$timeout', '$filter', '$location', '$anchorScroll', function ($scope, $cookies, $cookieStore, $defaultConfig, $api, $util, $http, $layer, $timeout, $filter, $location, $anchorScroll) {
    var vm = this;
    vm.user = JSON.parse(localStorage.getItem('user'));
    //提交数据
    vm.completeCompany = {
        company: {
            companyName: '',
            hearDsb: 0,
            businessRefer: '',
            agreementStartTime: '',
            agreementEndTime: '',
            // userId: localStorage.getItem("userId")
            userId: ''
        },
        companyExtend: {
            contactName: '',
            contactPhone: '',
            email: ''
        },
        isImport: [],
        isExport: []
    };
    if (vm.user) {
        if (vm.user.userId) {
            vm.completeCompany.company.userId = vm.user.userId;
        }
    }
    vm.importId = '';//进口id
    vm.exportId = '';//出口id
    vm.importList = [];//进口数据
    vm.exportList = [];//出口数据
    vm.icoDisabled = true;//协议按钮默认不可点
    vm.checkBox = false;//同意默认
    vm.popShow = false;//弹出层默认
    //得知豆沙包来源
    vm.hearDsbList = [
        {
            id: 0,
            name: '无'
        },
        {
            id: 1,
            name: '豆沙包商务人员推荐'
        },
        {
            id: 2,
            name: '第三方推荐'
        }
    ];
    //海外电商
    vm.companyTypeList = [
        {
            id: 0,
            name: '海外电商'
        },
        {
            id: 1,
            name: '跨境电商'
        },

        {
            id: 2,
            name: '转运公司'
        },

        {
            id: 3,
            name: '清关公司'
        },

        {
            id: 4,
            name: '物流公司'
        },

        {
            id: 5,
            name: '卖家'
        },

        {
            id: 6,
            name: '供应链服务'
        },

        {
            id: 7,
            name: '保税区'
        },

        {
            id: 8,
            name: 'ERP、物流系统服务平台'
        },

        {
            id: 9,
            name: '三方支付'
        },
        {
            id: 10,
            name: '其他'
        }
    ];
//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
    /**
     * 加入商户类型id
     * @param type    0-进口 1-出口
     *@param id       所选中的id
     */
    vm.pushId = function (type, id) {
        for (i in vm.companyTypeList) {
            if (id == vm.companyTypeList[i].id) {
                vm.temp = {
                    id: vm.companyTypeList[i].id,
                    name: vm.companyTypeList[i].name
                }
            }
        }
        if (type === 0) {
            if (vm.importList.length == 0) {
                vm.importList.push(vm.temp);
            } else {
                vm.importHasId = false;
                for (i in vm.importList) {
                    if (vm.temp.id === vm.importList[i].id) {
                        return vm.importHasId = false;
                    } else {
                        vm.importHasId = true;
                    }
                }
                if (vm.importHasId) {
                    vm.importList.push(vm.temp);
                }
            }
        } else if (type === 1) {
            if (vm.exportList.length == 0) {
                vm.exportList.push(vm.temp);
            } else {
                vm.exportHasId = false;
                for (i in vm.exportList) {
                    if (vm.temp.id === vm.exportList[i].id) {
                        return vm.exportHasId = false;
                    } else {
                        vm.exportHasId = true;
                    }
                }
                if (vm.exportHasId) {
                    vm.exportList.push(vm.temp);
                }
            }
        }
    };

    /**
     * 删除用户类型
     * @param type    0-进口 1-出口
     *@param index     数组下标
     */
    vm.deleteCompany = function (type, index) {
        if (type == 0) {
            vm.importList.splice(index, 1);
        } else if (type == 1) {
            vm.exportList.splice(index, 1);
        }
    };
    vm.stopProp = function (e) {
        // 阻止冒泡
        e = e || window.event;
        e.stopPropagation();
    };
    // 协议弹出框监听滚动条
    $(".protocolPop").scroll(function () {
        var viewH = $(this).get(0).offsetHeight,//可见高度
            contentH = $(this).get(0).scrollHeight,//内容高度
            scrollTop = $(this).scrollTop();//滚动高度
        if (scrollTop >= (contentH - viewH - 5)) { //到达底部时,加载新内容
            vm.icoDisabled = false;
            $scope.$apply();
        }
    });

    //获取协议开始时间
    vm.getStartTime = function () {
        vm.agree = false;
        if (vm.checkBox) {
            vm.popShow = true;
            vm.completeCompany.company.agreementStartTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        }
        else {
            vm.popShow = false;
            vm.checkBox = false;
        }
    };
    //获取协议结束时间
    vm.getEndTime = function () {
        vm.popShow = false;
        vm.agree = true;
        vm.completeCompany.company.agreementEndTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
    };
    //判断是否点击同意
    vm.isAgree = function () {
        vm.popShow = false;
        vm.agree ? vm.checkBox = true : vm.checkBox = false;
    };
    //获得焦点
    vm.getFocus = function (id) {
        $location.hash(id);
        $anchorScroll();
        $('#' + id).focus();
    };
    //提交
    vm.submit = function () {
        // 完善信息验证
        vm.phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        vm.emailReg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
        if (vm.completeCompany.company.companyName == '') {
            vm.getFocus('companyName');
            return layer.msg('商户名称不能为空！', {time: 1000});
        }
        if (vm.completeCompany.companyExtend.contactName == "") {
            vm.getFocus('contactName');
            return layer.msg('联系人不能为空！', {time: 1000});
        }
        if (vm.completeCompany.companyExtend.contactPhone == "") {
            vm.getFocus('contactPhone');
            return layer.msg('联系电话不能为空！', {time: 1000});
        } else if (!vm.phoneReg.test(vm.completeCompany.companyExtend.contactPhone)) {
            vm.getFocus('contactPhone');
            return layer.msg('请输入正确的手机号！', {time: 1000});
        }
        if (vm.completeCompany.companyExtend.email == "") {
            vm.getFocus('email');
            return layer.msg('邮箱不能为空！', {time: 1000});
        } else if (!vm.emailReg.test(vm.completeCompany.companyExtend.email)) {
            vm.getFocus('email');
            return layer.msg('请输入正确的邮箱！', {time: 1000});
        }
        if (vm.importList.length == 0 && vm.exportList.length == 0) {
            return layer.msg('请选择进口方式或出口方式！', {time: 1000});
        }
        if (vm.completeCompany.company.hearDsb == 1) {
            if (vm.completeCompany.company.businessRefer == "") {
                vm.getFocus('businessRefer');
                return layer.msg('请填写豆沙包商务对接人！', {time: 1000});
            }
        }
        if (vm.completeCompany.company.hearDsb == 2) {
            if (vm.completeCompany.company.businessRefer == "") {
                vm.getFocus('businessRefer');
                return layer.msg('请填写第三方来源 ！', {time: 1000});
            }
        }
        if (!vm.agree) {
            return layer.msg('请勾选豆沙包商户平台合作协议 ！', {time: 1000});
        }


        for (i in vm.importList) {
            vm.completeCompany.isImport.push(vm.importList[i].id);
        }
        for (i in vm.exportList) {
            vm.completeCompany.isExport.push(vm.exportList[i].id);
        }
        $api.post('/company/completeCompany', angular.toJson(vm.completeCompany), function (result) {
            if (result.code === 0) {
                // $cookies.put('source', result.data);
                vm.user.source = result.data;
                layer.msg(result.msg, {time: 1000});
                $api.get('/user/menus', function (result) {
                    var menuList = result.data.menuList;
                    var landingPage = menuList[0].list[0].url;
                    vm.user.user = result.user;//用户名
                    vm.user.landingPage = result.landingPage;//当前第一页
                    // $cookies.put('user', result.user);//用户名
                    // $cookies.put('landingPage', landingPage);//当前第一页
                    localStorage.setItem('user', JSON.stringify(vm.user));
                    localStorage.setItem('menuList', JSON.stringify(menuList));
                    $cookies.put('isNew', 1);
                    window.location.href = $defaultConfig.current_uri + '/index.html#/' + landingPage + '.html';
                });
            }
        })
    }
}]);