var app = angular.module('policyQueryList', ['ngCookies', 'app.config']);
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
app.controller('policyQueryListController', ['$scope', '$cookies', '$defaultConfig', '$http', '$timeout', function ($scope, $cookies, $defaultConfig, $http, $timeout) {
    var vm = this;
    vm.promotionList = JSON.parse(localStorage.getItem('promotionList'));

    vm.list = vm.promotionList;
    console.log(vm.list);
    for(var i in vm.list){
        if(vm.list[i].status == 0){
            vm.list[i].statusText = "待支付";
        }else if(vm.list[i].status == 1){
            vm.list[i].statusText = "处理中";
        }else if(vm.list[i].status == 2){
            vm.list[i].statusText = "已出单";
        }else if(vm.list[i].status == 3){
            vm.list[i].statusText = "失效";
        }
    }
    // 电子发票下载
    vm.InvoiceDownLoad = function (o) {
        $http({
            method: "POST",
            url: $defaultConfig.app_uri + '/v1/electronic',
            // headers: {'token': $cookies.get('token')},
            data:angular.toJson({ticketNo:o.ticketNo})
        }).success(function(result){
            location.href = result.Url;
        }).error(function(result){
            layer.msg(result.msg,{time:1500});
        });
    };

    // 去支付
    vm.toPay = function (o) {
        $http({
            method: "POST",
            url: $defaultConfig.app_uri + '/v1/payurl',
            // headers: {'token': $cookies.get('token')},
            data:angular.toJson({ticketNo:o.ticketNo})
        }).success(function(result){
            location.href = result.data;
        }).error(function(result){
            layer.msg(result.msg,{time:1500});
        });
    };

    // 去支付
    vm.toPay = function (o) {
        $http({
            method: "POST",
            url: $defaultConfig.app_uri + '/v1/payurl',
            // headers: {'token': $cookies.get('token')},
            data:angular.toJson({ticketNo:o.ticketNo})
        }).success(function(result){
            console.log(result);
            location.href = result.data;
        }).error(function(result){
            layer.msg(result.msg,{time:1500});
        });
    }

}]);