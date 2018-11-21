var app = angular.module('detail', ['ngCookies', 'app.config', 'app.services', 'app.layer', 'app.util']);
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
app.controller('detailController', ['$scope', '$cookies', '$cookieStore', '$defaultConfig', '$api', '$util', '$http', '$layer', '$timeout', function ($scope, $cookies, $cookieStore, $defaultConfig, $api, $util, $http, $layer, $timeout) {
    var vm = this;
    vm.usrInfor = {};//用户信息
    //默认加载左侧导航和个人信息
    vm.init = function () {
        $layer.loading();
        $http({
            url: $defaultConfig.current_uri + 'json/navList.json',//请求的url路径
            method: 'GET',    //GET/POST
            // params:params ,   //参数
            // data: data        //通常在POST请求时使用
        }).success(function (result) {
            //成功处理
            $layer.close();
            vm.usrInfor.usrName = result.data.usrName;
        }).error(function () {
            //错误处理
        });
    };
    //总览
    vm.toDashborad = function () {
        window.location.href = $defaultConfig.current_uri + 'dashboard.html';
    };
    //后台管理
    vm.toSelf = function () {
        window.location.href = $defaultConfig.current_uri + 'index.html#/personalOrder.html'
    }

}]);