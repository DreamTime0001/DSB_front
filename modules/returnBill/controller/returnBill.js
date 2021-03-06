(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('returnBillController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
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

//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //查询
            vm.search = function () {
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //删除
            vm.delete = function (index) {
                vm.list.splice(index, 1);
            }
        }])
}());