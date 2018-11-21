(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('userManageController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer) {
            var vm = this;
            //查询条件
            vm.query = {
                pageNum: 1,
                pageSize: 10
            };
            //获取列表
            vm.getPagedDataAsync = function () {
                $layer.loading();
                $http({
                    url: $defaultConfig.current_uri + '/json/list.json',//请求的url路径
                    method: 'GET',    //GET/POST
                    params: {query: angular.toJson(vm.query)},   //参数
                    // data: data        //通常在POST请求时使用
                }).success(function (result) {
                    //成功处理
                    $layer.close();
                    vm.list = result.data.list;
                    vm.query.pages = result.data.pages;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                    }
                }).error(function () {
                    //错误处理
                });
            };
            //日期初始化
            var toDay = new Date();
            //开始时间
            initDate('#startDate', 'yyyy-mm-dd', 2, function (date) {
                $('#endDate').datetimepicker('setStartDate', date);
            }, toDay);
            //结束时间
            initDate('#endDate', 'yyyy-mm-dd', 2, function (date) {
                $('#startDate').datetimepicker('setEndDate', date);
            }, toDay);

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //查询
            vm.search = function () {
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
        }])

}());