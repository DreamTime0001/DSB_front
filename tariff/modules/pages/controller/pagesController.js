var app = angular.module('pages', ['app.config', 'ngCookies', 'angularFileUpload']);
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
app.controller('pagesController', ['$scope', '$cookies', '$defaultConfig', '$http', '$timeout', '$upload', function ($scope, $cookies, $defaultConfig, $http, $timeout, $upload) {
    var vm = this;
    vm.requireAgain = true;//按钮状态
    vm.submitCon = {
        businessName: "",
        businessContact: "",
        businessPhone: "",
        businessEmail: "",
        firstArea: '',
        licenceUrl: "",
        idcardUrl: "",
        taxAmount: "",
        delayDay: "",
        predictAmount: ""
    };

    vm.uploadImg = function (obj, type) {
        var files = obj;
        layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        vm.file = files[0];
        $upload.upload({
            url: $defaultConfig.app_uri + '/v1/tax/upload',
            file: vm.file
        }).progress(function (evt) {//上传进度
        }).success(function (data, status, headers, config) {
            if (data.code == 0) {
                if (type == 0) {
                    $(".imgBox01 img").height(200);
                } else {
                    $(".imgBox02 img").height(200);
                }
                layer.closeAll();
                type == 0 ? vm.submitCon.licenceUrl = data.msg : vm.submitCon.idcardUrl = data.msg;
            }
        }).error(function (data, status, headers, config) {
            layer.closeAll();
            layer.msg('服务器异常，请重新尝试', {time: 1000});
        });
    };
    vm.phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    vm.floatReg = /^\d+(?=\.{0,1}\d+$|$)/;
    vm.numReg = /^[0-9]*[1-9][0-9]*$/;
    vm.emailReg=/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    vm.test = function (obj) {
        if (obj.businessName == "") {
            layer.msg("企业名称不能为空！", {time: 1500});
            return false;
        }
        if (obj.businessContact == "") {
            layer.msg("联系人不能为空！", {time: 1500});
            return false;
        }
        if (obj.businessPhone == "") {
            layer.msg("联系手机不能为空！", {time: 1500});
            return false;
        } else if (!vm.phoneReg.test(obj.businessPhone)) {
            layer.msg("联系手机填写不正确！", {time: 1500});
            return false;
        }
        if (obj.firstArea == "") {
            layer.msg("首选关区不能为空！", {time: 1500});
            return false;
        }
        if (obj.businessEmail == "") {
            layer.msg("联系邮箱不能为空！", {time: 1500});
            return false;
        } else if (!vm.emailReg.test(obj.businessEmail)) {
            layer.msg("联系邮箱填写不正确！", {time: 1500});
            return false;
        }
        if (obj.taxAmount == "") {
            layer.msg("缴纳税金不能为空！", {time: 1500});
            return false;
        } else if (!vm.floatReg.test(obj.taxAmount)) {
            layer.msg("缴纳税金填写不正确！", {time: 1500});
            return false;
        }
        if (obj.delayDay == "") {
            layer.msg("拟申请保单期限不能为空！", {time: 1500});
            return false;
        } else if (!vm.numReg.test(obj.delayDay)) {
            layer.msg("拟申请保单期限填写不正确！", {time: 1500});
            return false;
        }
        return true;
    };

    // 判断是移动端还是PC端
    if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
        window.location.href =  $defaultConfig.local_url + '/tariff/index.html'
    }

    vm.ua = window.navigator.userAgent.toLowerCase();
    $(function(){
        if(vm.ua.match(/MicroMessenger/i) == 'micromessenger'){
            //微信走这个
            window.location.href =  $defaultConfig.local_url + '/tariff/index.html'
        }
    });
    // 提交
    vm.submit = function () {
        // 获取保险费用
        vm.assuranceRandom = (0.8 + Math.random() * 0.4).toFixed(3);
        vm.submitCon.predictAmount = vm.submitCon.taxAmount * vm.submitCon.delayDay * (2 / 1000) * vm.assuranceRandom;
        vm.submitCon.predictAmount = vm.submitCon.predictAmount.toFixed(2);

        if (vm.test(vm.submitCon)) {
            if (vm.requireAgain) {
                vm.requireAgain = false;
                $http({
                    method: "POST",
                    url: $defaultConfig.app_uri + '/v1/tax/submit',
                    // headers: {'token': $cookies.get('token')},
                    data: angular.toJson(vm.submitCon)
                }).success(function (result) {
                    if (result.code == 0) {
                        vm.requireAgain = true;
                        $cookies.put('predictAmount', vm.submitCon.predictAmount);
                        layer.msg(result.msg, {time: 1000});
                        location.href = 'tariffDetails.html';
                    }
                }).error(function (result) {
                    vm.requireAgain = true;
                    layer.msg(result.msg, {time: 1500})
                });
            }

        }
    }

}]);