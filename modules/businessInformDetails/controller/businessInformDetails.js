(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('businessInformDetailsController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$stateParams', '$cookies', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $stateParams, $cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.user = JSON.parse(localStorage.getItem('user'));
            vm.img = [];
            vm.zip = [];
            vm.font = [];
            vm.testImg = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/;
            vm.testZip = /\.zip$/;

            vm.companyProductDetail = {
                productId:$stateParams.productId,
                id:$stateParams.id,
                source: vm.user.source
            };
//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//

            vm.getPagedDataAsync = function () {
                $api.post('/company/companyProductDetail',angular.toJson(vm.companyProductDetail),function (result) {
                  // 基本信息
                    vm.product = result.data.product;

                    if(vm.product.productType == 0){
                        vm.product.productTypeText = '费率';
                    }else if(vm.product.productType == 1){
                        vm.product.productTypeText = '定价';
                    }else if(vm.product.productType == 2){
                        vm.product.productTypeText = '份数';
                    }else if(vm.product.productType == 3){
                        vm.product.productTypeText = '组合';
                    }else if(vm.product.productType == 4){
                        vm.product.productTypeText = '组合费率';
                    }

                    vm.product.isExit == 0 ? vm.product.isExitText = '进口' : vm.product.isExitText = '出口';
                    // 包含产品
                    vm.list = result.data.list;
                    // 理赔必填项
                    vm.orderTemplate = result.data.orderTemplate;
                    // 上传凭证
                    vm.applyTemplate = result.data.applyTemplate;
                    for(var i in vm.applyTemplate){

                        for(var j in vm.applyTemplate[i]){
                            vm.values = vm.applyTemplate[i][j].values;
                            for(var k in vm.values){
                                if(vm.testImg.test(vm.values[k])){
                                    vm.applyTemplate[i][j].isImg = true;
                                }else if(vm.testZip.test(vm.values[k])){
                                    vm.applyTemplate[i][j].isZip = true;
                                }else {
                                    vm.applyTemplate[i][j].isFont = true;
                                }
                            }
                            if(vm.applyTemplate[i][j].isImg){
                                vm.img.push(vm.applyTemplate[i][j]);
                            }else if(vm.applyTemplate[i][j].isZip){
                                vm.zip.push(vm.applyTemplate[i][j]);
                            }else if(vm.applyTemplate[i][j].isFont){
                                vm.font.push(vm.applyTemplate[i][j]);
                            }

                        }
                    }

                })
            }


        }])
}());