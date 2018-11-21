var app = angular.module('insure', ['ngCookies', 'app.config']);
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    // x-www-form-urlencoded
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
app.controller('insureController', ['$scope', '$cookies', '$defaultConfig', '$http', '$timeout', function ($scope, $cookies, $defaultConfig, $http, $timeout) {
    var vm = this;
    localStorage.clear();
    vm.date = (new Date().getTime()) + 10 * 24 * 60 * 60 * 1000;
    // 创建考试类型相关数组
    vm.listArr = [
        {
            type: '0',
            name: '成人高考'
        },
        {
            type: '1',
            name: '自学考试'
        }
    ];
    vm.promotion = {
        name: '',
        idCard: '',
        phone: '',
        examType: '',
        amount: '',
        examNo: '',
        email: '',
        insuranceData: vm.date,
        insuranceExpense: 0,
        code: '',
        trainingCost: '',
        checkBox: false
    };
    $scope.$watch('vm.promotion.examType', function (newVal, oldVal) {
        if (newVal != oldVal) {
            if (newVal == '成人高考') {
                vm.testArr = [
                    {
                        code: 'JBQ4401001',
                        choice: '0-6980',
                        price: 168
                    },
                    {
                        code: 'JBQ4401002',
                        choice: '6981-8400',
                        price: 188
                    },
                    {
                        code: 'JBQ4401003',
                        choice: '8401-10600',
                        price: 198
                    }
                ]
            } else {
                vm.testArr = [
                    {
                        code: 'JBQ4401004',
                        choice: '0-2880',
                        price: 116
                    },
                    {
                        code: 'JBQ4401005',
                        choice: '2881-3880',
                        price: 156
                    },
                    {
                        code: 'JBQ4401006',
                        choice: '3881-4880',
                        price: 176
                    },
                    {
                        code: 'JBQ4401007',
                        choice: '4881-6880',
                        price: 206
                    },
                    {
                        code: 'JBQ4401008',
                        choice: '6881-8880',
                        price: 236
                    },
                    {
                        code: 'JBQ4401009',
                        choice: '8881-10980',
                        price: 256
                    }
                ]
            }
        }
    });
    //获取价格区间
    vm.getSum = function (insuranceExpense) {
        vm.promotion.insuranceExpense = insuranceExpense;
        for (var i = 0; i < vm.testArr.length; i++) {
            if (insuranceExpense == vm.testArr[i].price) {
                vm.promotion.amount = vm.testArr[i].choice;
                vm.promotion.code = vm.testArr[i].code;
                vm.interval = vm.testArr[i].choice; // 纯粹只为获取区间
            }
        }
    };

    // 数据提交内容
    //         vm.localPromotion = JSON.parse(localStorage.getItem('insureContent'));
    //         if(vm.localPromotion){
    //             vm.promotion = vm.localPromotion;
    //             if(vm.promotion.examType == 0){
    //                 vm.testArr = [
    //                     {
    //                         code:'JBQ4401001',
    //                         choice:'0-6980',
    //                         price:168
    //                     },
    //                     {
    //                         code:'JBQ4401002',
    //                         choice:'6981-8400',
    //                         price:188
    //                     },
    //                     {
    //                         code:'JBQ4401003',
    //                         choice:'8401-10600',
    //                         price:198
    //                     }
    //                 ]
    //             }else{
    //                 vm.testArr = [
    //                     {
    //                         code:'JBQ4401004',
    //                         choice:'0-2880',
    //                         price:116
    //                     },
    //                     {
    //                         code:'JBQ4401005',
    //                         choice:'2881-3880',
    //                         price:156
    //                     },
    //                     {
    //                         code:'JBQ4401006',
    //                         choice:'3881-4880',
    //                         price:176
    //                     },
    //                     {
    //                         code:'JBQ4401007',
    //                         choice:'4881-6880',
    //                         price:206
    //                     },
    //                     {
    //                         code:'JBQ4401008',
    //                         choice:'6881-8880',
    //                         price:236
    //                     },
    //                     {
    //                         code:'JBQ4401009',
    //                         choice:'8881-10980',
    //                         price:256
    //                     }
    //                 ]
    //             }
    //         }else{
    //             vm.promotion = {
    //                 name: '',
    //                 idCard: '',
    //                 phone: '',
    //                 examType: '',
    //                 amount: '',
    //                 examNo: '',
    //                 email: '',
    //                 insuranceData: vm.date,
    //                 insuranceExpense: 0,
    //                 code: '',
    //                 trainingCost: '',
    //                 checkBox: false
    //             };
    //         }

    // 获取承包方案中最大的值
    vm.trans = function () {
        if (vm.interval) {
            vm.arr = vm.interval.split('-');
            vm.arr.sort(function (a, b) {
                return a - b;
            });
            vm.promotion.amount = vm.arr[vm.arr.length - 1];//获取区间最大的值并传递给后端
            vm.min = vm.arr[0];
            vm.max = vm.arr[vm.arr.length - 1];
        }
    };

    // 协议
    vm.checkOff = function () {
        // if(vm.promotion.checkBox){
        //     vm.promotion.checkBox = false;
        //     localStorage.setItem('insureContent', JSON.stringify(vm.promotion));
        // }
    };


    // 输入框验证
    vm.phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    vm.emailReg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
    vm.test = function (obj) {
        if (obj.name == "") {
            layer.msg("姓名不能为空！", {time: 1000});
            return false;
        }
        if (obj.idCard == "") {
            layer.msg("身份证号码不能为空！", {time: 1000});
            return false;
        } else if (!convertCardID(obj.idCard)) {
            layer.msg("请填写正确的身份证号码！", {time: 1000});
            return false;
        }
        if (obj.phone == "") {
            layer.msg("手机号码不能为空！", {time: 1000});
            return false;
        } else if (!vm.phoneReg.test(obj.phone)) {
            layer.msg("请填写正确的手机号码！", {time: 1000});
            return false;
        }
        if (obj.examType == "") {
            layer.msg("请选择考试类型！", {time: 1000});
            return false;
        }
        if (obj.trainingCost == "") {
            layer.msg("培训费用不能为空！", {time: 1000});
            return false;
        } else if (Number(obj.trainingCost) < Number(vm.min) || Number(obj.trainingCost) > Number(vm.max)) {
            layer.msg("培训费用不在正确的范围内！", {time: 1500});
            return false;
        }
        if (obj.insuranceExpense == null) {
            layer.msg("请选择承保方案！", {time: 1000});
            return false;
        }
        if (obj.examNo == "") {
            layer.msg("订单编号不能为空！", {time: 1000});
            return false;
        }
        if (obj.email == "") {
            layer.msg("邮箱不能为空！", {time: 1000});
            return false;
        } else if (!vm.emailReg.test(obj.email)) {
            layer.msg("请输入正确的邮箱！", {time: 1000});
            return false;
        }
        if (obj.checkBox == false) {
            layer.msg("请勾选协议！", {time: 1000});
            return false;
        }
        return true;
    };
    // 确认支付
    vm.makeSure = function () {
        vm.trans();
        if (vm.test(vm.promotion)) {
            $http({
                method: "POST",
                url: $defaultConfig.app_uri + '/v1/savePromotion',
                data: angular.toJson(vm.promotion)
            }).success(function (result) {
                if (result.code == 0) {
                    location.href = result.data.payUrl;
                    layer.msg(result.msg, {time: 1000});
                } else {
                    layer.msg(result.msg, {time: 1000});
                }
            }).error(function (result) {
                layer.msg(result.msg, {time: 1500});
                console.log("err:  " + result);
            });
        }

    };


}]);