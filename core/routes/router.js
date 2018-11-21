(function () {
    'use strict';
    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/notFound.html');
            $stateProvider
            //------------------------------------------------------------ 前台路由 ----------------------------------------------------//
            //订单管理-我的保单
                .state('customerInsure', {
                    url: '/customerInsure.html',
                    templateUrl: 'modules/customerInsure/view/customerInsure.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/customerInsure/controller/customerInsure.js?" + new Date());
                        }]
                    }
                })
                //订单管理-我的保单-详情
                .state('customerInsureDetails', {
                    url: '/customerInsureDetails.html?id?productId',
                    templateUrl: 'modules/customerInsureDetails/view/customerInsureDetails.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/customerInsureDetails/controller/customerInsureDetails.js?" + new Date());
                        }]
                    }
                })
                //订单管理-我的保单-新增
                .state('customerInsureAdd', {
                    url: '/customerInsureAdd.html',
                    templateUrl: 'modules/customerInsureAdd/view/customerInsureAdd.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/customerInsureAdd/controller/customerInsureAdd.js?" + new Date());
                        }]
                    }
                })
                //产品工厂-我的购物车
                .state('productFactoryCar', {
                    url: '/productFactoryCar.html',
                    templateUrl: 'modules/productFactoryCar/view/productFactoryCar.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productFactoryCar/controller/productFactoryCar.js?" + new Date());
                        }]
                    }
                })
                //产品工厂-我的订单
                .state('productFactoryOrder', {
                    url: '/productFactoryOrder.html',
                    templateUrl: 'modules/productFactoryOrder/view/productFactoryOrder.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productFactoryOrder/controller/productFactoryOrder.js?"+ new Date());
                        }]
                    }
                })

                //产品工厂-我的产品包
                .state('productFactoryPackage', {
                    url: '/productFactoryPackage.html',
                    templateUrl: 'modules/productFactoryPackage/view/productFactoryPackage.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productFactoryPackage/controller/productFactoryPackage.js?"+ new Date());
                        }]
                    }
                })
                //产品工厂-我的产品包-使用
                .state('productFactoryPackageUse', {
                    url: '/productFactoryPackageUse.html',
                    templateUrl: 'modules/productFactoryPackageUse/view/productFactoryPackageUse.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productFactoryPackageUse/controller/productFactoryPackageUse.js?"+ new Date());
                        }]
                    }
                })
                //订单管理-订单归档
                // .state('orderFiling', {
                //     url: '/orderFiling.html',
                //     templateUrl: 'modules/orderFiling/view/orderFiling.html'
                // })

                //理赔管理-理赔订单
                .state('claimOrder', {
                    url: '/claimOrder.html',
                    templateUrl: 'modules/claimOrder/view/claimOrder.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/claimOrder/controller/claimOrder.js?" + new Date());
                        }]
                    }
                })
                //理赔管理-理赔订单-新增
                .state('claimOrderAdd', {
                    url: '/claimOrderAdd.html',
                    templateUrl: 'modules/claimOrderAdd/view/claimOrderAdd.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/claimOrderAdd/controller/claimOrderAdd.js?" + new Date());
                        }]
                    }
                })
                //理赔管理-理赔订单-发起申诉
                .state('claimOrderEdit', {
                    url: '/claimOrderEdit.html',
                    templateUrl: 'modules/claimOrderEdit/view/claimOrderEdit.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/claimOrderEdit/controller/claimOrderEdit.js?" + new Date());
                        }]
                    }
                })
                //理赔管理-理赔订单-详情
                .state('claimOrderDetails', {
                    url: '/claimOrderDetails.html?id?applyProductId?ticketNo',
                    templateUrl: 'modules/claimOrderDetails/view/claimOrderDetails.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/claimOrderDetails/controller/claimOrderDetails.js?" + new Date());
                        }]
                    }
                })

                //理赔管理-理赔账单
                // .state('claimBill', {
                //     url: '/claimBill.html',
                //     templateUrl: 'modules/claimBill/view/claimBill.html'
                // })
                //结算中心-待审核账单
                // .state('auditedBillFront', {
                //     url: '/auditedBillFront.html',
                //     templateUrl: 'modules/auditedBillFront/view/auditedBillFront.html'
                // })
                //结算中心-结算记录
                // .state('settleRecordFront', {
                //     url: '/settleRecordFront.html',
                //     templateUrl: 'modules/settleRecordFront/view/settleRecordFront.html'
                // })


                //文档中心-文档中心
                .state('subDocCenter', {
                    url: '/subDocCenter.html',
                    templateUrl: 'modules/subDocCenter/view/subDocCenter.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/subDocCenter/controller/subDocCenter.js?" + new Date());
                        }]
                    }
                })
                // newDashboard
                .state('newDashboard', {
                    url: '/newDashboard.html',
                    templateUrl: 'modules/newDashboard/view/newDashboard.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/newDashboard/controller/newDashboard.js?" + new Date());
                        }]
                    }
                })
                //商户中心-商户中心
                .state('businessInform', {
                    url: '/businessInform.html',
                    templateUrl: 'modules/businessInform/view/businessInform.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/businessInform/controller/businessInform.js?" + new Date());
                        }]
                    }
                })
                //商户中心-产品详情
                .state('businessInformDetails', {
                    url: '/businessInformDetails.html?id?productId',
                    templateUrl: 'modules/businessInformDetails/view/businessInformDetails.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/businessInformDetails/controller/businessInformDetails.js?" + new Date());
                        }]
                    }
                })
                //账户中心-充值
                .state('recharge', {
                    url: '/recharge.html',
                    templateUrl: 'modules/recharge/view/recharge.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/recharge/controller/recharge.js?" + new Date());
                        }]
                    }
                })
                //账户中心-大额充值
                .state('largeRecharge', {
                    url: '/largeRecharge.html',
                    templateUrl: 'modules/largeRecharge/view/largeRecharge.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/largeRecharge/controller/largeRecharge.js?" + new Date());
                        }]
                    }
                })
                //账户中心-大额充值详情
                .state('largeRechargeDetails', {
                    url: '/largeRechargeDetails.html',
                    templateUrl: 'modules/largeRechargeDetails/view/largeRechargeDetails.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/largeRechargeDetails/controller/largeRechargeDetails.js?" + new Date());
                        }]
                    }
                })
                //账户中心-资金流水
                .state('capitalFlow', {
                    url: '/capitalFlow.html',
                    templateUrl: 'modules/capitalFlow/view/capitalFlow.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/capitalFlow/controller/capitalFlow.js?" + new Date());
                        }]
                    }
                })
                //充值-提现记录
                .state('rechargeWithList', {
                    url: '/rechargeWithList.html',
                    templateUrl: 'modules/rechargeWithList/view/rechargeWithList.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/rechargeWithList/controller/rechargeWithList.js?" + new Date());
                        }]
                    }
                })
                //------------------------------------------------------------ 后台路由 ----------------------------------------------------//
                // 订单管理-个人订单
                .state('personalOrder', {
                    url: '/personalOrder.html',
                    templateUrl: 'modules/personalOrder/view/personalOrder.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/personalOrder/controller/personalOrder.js?" + new Date());
                        }]
                    }
                })
                //订单管理-个人订单-个人订单详情
                // .state('personalOrderDetails', {
                //     url: '/personalOrderDetails.html',
                //     templateUrl: 'modules/personalOrderDetails/view/personalOrderDetails.html'
                // })


                //订单管理-商户订单
                .state('businessOrder', {
                    url: '/businessOrder.html',
                    templateUrl: 'modules/businessOrder/view/businessOrder.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/businessOrder/controller/businessOrder.js?" + new Date());
                        }]
                    }
                })
                //订单管理--新增投保
                .state('businessOrderAdd', {
                    url: '/businessOrderAdd.html',
                    templateUrl: 'modules/businessOrderAdd/view/businessOrderAdd.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/businessOrderAdd/controller/businessOrderAdd.js?" + new Date());
                        }]
                    }
                })
                //订单管理-商户订单-商户订单详情
                .state('businessOrderDetails', {
                    url: '/businessOrderDetails.html?id?productId',
                    templateUrl: 'modules/businessOrderDetails/view/businessOrderDetails.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/businessOrderDetails/controller/businessOrderDetails.js?" + new Date());
                        }]
                    }
                })
                //理赔管理-个人理赔
                // .state('personalClaim', {
                //     url: '/personalClaim.html',
                //     templateUrl: 'modules/personalClaim/view/personalClaim.html'
                // })
                //理赔管理-个人理赔-个人理赔详情
                // .state('personalClaimDetails', {
                //     url: '/personalClaimDetails.html',
                //     templateUrl: 'modules/personalClaimDetails/view/personalClaimDetails.html'
                // })


                //理赔管理-商户理赔
                .state('businessClaim', {
                    url: '/businessClaim.html',
                    templateUrl: 'modules/businessClaim/view/businessClaim.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/businessClaim/controller/businessClaim.js?" + new Date());
                        }]
                    }
                })
                //理赔管理-商户理赔-商户理赔详情
                .state('businessClaimDetails', {
                    url: '/businessClaimDetails.html?ticketNo?id?applyProductId',
                    templateUrl: 'modules/businessClaimDetails/view/businessClaimDetails.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/businessClaimDetails/controller/businessClaimDetails.js?" + new Date());
                        }]
                    }
                })
                //理赔管理-新增理赔
                .state('businessClaimAdd', {
                    url: '/businessClaimAdd.html',
                    templateUrl: 'modules/businessClaimAdd/view/businessClaimAdd.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/businessClaimAdd/controller/businessClaimAdd.js?" + new Date());
                        }]
                    }
                })


                //结算中心-待审核账单
                // .state('auditedBillBack', {
                //     url: '/auditedBillBack.html',
                //     templateUrl: 'modules/auditedBillBack/view/auditedBillBack.html'
                // })
                //结算中心-结算记录
                // .state('settleRecordBack', {
                //     url: '/settleRecordBack.html',
                //     templateUrl: 'modules/settleRecordBack/view/settleRecordBack.html'
                // })


                //信息维护-产品管理
                .state('productManage', {
                    url: '/productManage.html',
                    templateUrl: 'modules/productManage/view/productManage.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productManage/controller/productManage.js?" + new Date());
                        }]
                    }
                })
                //信息维护-产品包管理
                .state('productPackageManage', {
                    url: '/productPackageManage.html',
                    templateUrl: 'modules/productPackageManage/view/productPackageManage.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productPackageManage/controller/productPackageManage.js?" + new Date());
                        }]
                    }
                })
                //信息维护-产品包管理-新增
                .state('productPackageManageAdd', {
                    url: '/productPackageManageAdd.html',
                    templateUrl: 'modules/productPackageManageAdd/view/productPackageManageAdd.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productPackageManageAdd/controller/productPackageManageAdd.js?" + new Date());
                        }]
                    }
                })
                //信息维护-产品包管理-修改
                .state('productPackageManageEdit', {
                    url: '/productPackageManageEdit.html?id',
                    templateUrl: 'modules/productPackageManageEdit/view/productPackageManageEdit.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productPackageManageEdit/controller/productPackageManageEdit.js?" + new Date());
                        }]
                    }
                })
                //信息维护-默认产品包管理
                .state('productPackageManageDefault', {
                    url: '/productPackageManageDefault.html',
                    templateUrl: 'modules/productPackageManageDefault/view/productPackageManageDefault.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productPackageManageDefault/controller/productPackageManageDefault.js?" + new Date());
                        }]
                    }
                })
                //信息维护-默认产品管理
                .state('productManageDefault', {
                    url: '/productManageDefault.html',
                    templateUrl: 'modules/productManageDefault/view/productManageDefault.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productManageDefault/controller/productManageDefault.js?" + new Date());
                        }]
                    }
                })
                //信息维护-产品管理-新增
                .state('productManageAdd', {
                    url: '/productManageAdd.html',
                    templateUrl: 'modules/productManageAdd/view/productManageAdd.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productManageAdd/controller/productManageAdd.js?" + new Date());
                        }]
                    }
                })
                //信息维护-产品管理-修改
                .state('productManageEdit', {
                    url: '/productManageEdit.html?id?source',
                    templateUrl: 'modules/productManageEdit/view/productManageEdit.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productManageEdit/controller/productManageEdit.js?" + new Date());
                        }]
                    }
                })
                //商户产品管理
                .state('productManageCompany', {
                    url: '/productManageCompany.html',
                    templateUrl: 'modules/productManageCompany/view/productManageCompany.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/productManageCompany/controller/productManageCompany.js?" + new Date());
                        }]
                    }
                })

                //信息维护-2C产品管理
                // .state('twoCProductManage', {
                //     url: '/twoCProductManage.html',
                //     templateUrl: 'modules/twoCProductManage/view/twoCProductManage.html'
                // })
                //信息维护-保司接口管理
                // .state('interfaceManage', {
                //     url: '/interfaceManage.html',
                //     templateUrl: 'modules/interfaceManage/view/interfaceManage.html'
                // })
                //保单管理-所有保单
                // .state('allPolicies', {
                //     url: '/allPolicies.html',
                //     templateUrl: 'modules/allPolicies/view/allPolicies.html'
                // })


                //动态引擎-定价因子
                .state('pricingFactor', {
                    url: '/pricingFactor.html',
                    templateUrl: 'modules/pricingFactor/view/pricingFactor.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/pricingFactor/controller/pricingFactor.js?" + new Date());
                        }]
                    }
                })
                //动态引擎-产品包定价因子
                .state('pfPricingFactor', {
                    url: '/pfPricingFactor.html',
                    templateUrl: 'modules/pfPricingFactor/view/pfPricingFactor.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/pfPricingFactor/controller/pfPricingFactor.js?" + new Date());
                        }]
                    }
                })

                //返费管理-返费订单
                // .state('returnOrder', {
                //     url: '/returnOrder.html',
                //     templateUrl: 'modules/returnOrder/view/returnOrder.html'
                // })
                //返费管理-返费账单
                // .state('returnBill', {
                //     url: '/returnBill.html',
                //     templateUrl: 'modules/returnBill/view/returnBill.html'
                // })

                //------------------------------------------------------------ 后台顶部入口 ----------------------------------------------------//
                //商户管理
                .state('businessManage', {
                    url: '/businessManage.html',
                    templateUrl: 'modules/businessManage/view/businessManage.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/businessManage/controller/businessManage.js?" + new Date());
                        }]
                    }
                })
                //新增商户
                .state('businessAdd', {
                    url: '/businessAdd.html',
                    templateUrl: 'modules/businessAdd/view/businessAdd.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/businessAdd/controller/businessAdd.js?" + new Date());
                        }]
                    }
                })
                //修改商户
                .state('businessEdit', {
                    url: '/businessEdit.html?id',
                    templateUrl: 'modules/businessEdit/view/businessEdit.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/businessEdit/controller/businessEdit.js?" + new Date());
                        }]
                    }
                })
                //未完善信息商户
                .state('imperfectInfo', {
                    url: '/imperfectInfo.html',
                    templateUrl: 'modules/imperfectInfo/view/imperfectInfo.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/imperfectInfo/controller/imperfectInfo.js?" + new Date());
                        }]
                    }
                })

                //用户管理
                // .state('userManage', {
                //     url: '/userManage.html',
                //     templateUrl: 'modules/userManage/view/userManage.html'
                // })
                //用户详情-中国人
                // .state('userManageDetailsChina', {
                //     url: '/userManageDetailsChina.html',
                //     templateUrl: 'modules/userManageDetailsChina/view/userManageDetailsChina.html'
                // })
                //用户详情-外国人
                // .state('userManageDetailsForeigners', {
                //     url: '/userManageDetailsForeigners.html',
                //     templateUrl: 'modules/userManageDetailsForeigners/view/userManageDetailsForeigners.html'
                // })

                //账号管理-账号管理
                .state('accManage', {
                    url: '/accManage.html',
                    templateUrl: 'modules/accManage/view/accManage.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/accManage/controller/accManage.js?" + new Date());
                        }]
                    }
                })
                //提现记录
                .state('withdrawRecord', {
                    url: '/withdrawRecord.html',
                    templateUrl: 'modules/withdrawRecord/view/withdrawRecord.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/withdrawRecord/controller/withdrawRecord.js?" + new Date());
                        }]
                    }
                })
                //个人中心
                .state('personalCenter', {
                    url: '/personalCenter.html',
                    templateUrl: 'modules/personalCenter/view/personalCenter.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/personalCenter/controller/personalCenter.js?" + new Date());
                        }]
                    }
                })
                //404
                .state('notFound', {
                    url: '/notFound.html',
                    templateUrl: 'modules/notFound/view/notFound.html',
                    resolve: {
                        deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                            return $ocLazyLoad.load("modules/notFound/controller/notFoundController.js?" + new Date());
                        }]
                    }
                });
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