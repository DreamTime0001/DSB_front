(function () {
    'use strict';
    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/notFound.html');
            $stateProvider
                //商户选择页
                .state('merchant', {
                    url: '/merchant.html',
                    templateUrl: 'modules/merchant/view/merchant.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/merchant/controller/merchant.js?" + new Date());
                        }]
                    }
                })
                //产品工厂列表
                .state('productFactoryList', {
                    url: '/productFactoryList.html',
                    templateUrl: 'modules/productFactoryList/view/productFactoryList.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productFactoryList/controller/productFactoryList.js?" + new Date());
                        }]
                    }
                })
                 //产品包详情页
                 .state('productPackageDetails', {
                    url: '/productPackageDetails.html?id?productWrapId',
                    templateUrl: 'modules/productPackageDetails/view/productPackageDetails.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productPackageDetails/controller/productPackageDetails.js?" + new Date());
                        }]
                    }
                })
                //404
                /*.state('notFound', {
                    url: '/notFound.html',
                    templateUrl: 'modules/notFound/view/notFound.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/notFound/controller/notFoundController.js?" + new Date());
                        }]
                    }
                })*/
        }])
        .run(['$api', '$rootScope', '$defaultConfig', '$templateCache', function ($api, $rootScope, $defaultConfig, $templateCache) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
                //监听路由
                // $templateCache.removeAll();
                // $api.get('/checkSession', function(result) {
                // 	if(!result) {
                // 		window.location.href = $defaultConfig.current_uri + '/login.html';
                // 	}
                // })
            });
        }]);
}());