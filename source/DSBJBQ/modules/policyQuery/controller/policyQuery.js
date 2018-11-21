var app = angular.module('policyQuery', ['ngCookies', 'app.config']);
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
app.controller('policyQueryController', ['$scope', '$cookies', '$defaultConfig', '$http', '$timeout', function ($scope, $cookies, $defaultConfig, $http, $timeout) {
    var vm = this;

    vm.promotionList = {
        idCard: '',
        phone: '',
        examNo: ''
    };
    vm.search = function () {
        localStorage.clear();
        if (vm.promotionList.idCard == '' || vm.promotionList.phone == '' || vm.promotionList.examNo == '') {
            return layer.msg('查询条件不能为空', {time: 1000});
        }
        $http({
            method: "POST",
            url: $defaultConfig.app_uri + '/v1/promotionList',
            data: angular.toJson(vm.promotionList)
        }).success(function (result) {
            if (result.code === 0) {
                if (result.data.length > 0) {
                    location.href = "policyQueryList.html";
                    localStorage.setItem("promotionList", JSON.stringify(result.data));
                    layer.msg(result.msg, {time: 1000});
                    console.log(result);
                } else {
                    return layer.msg("没有查询到数据！", {time: 1500});
                }
            }
        }).error(function (result) {
        });
    };


}]);