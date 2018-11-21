(function() {
  "use strict";
  angular
    .module("app.controllers")
    .controller("productFactoryPackageController", [
      "$api",
      "$timeout",
      "$upload",
      "$http",
      "$state",
      "$scope",
      "$defaultConfig",
      "$layer",
      "$cookies",
      function(
        $api,
        $timeout,
        $upload,
        $http,
        $state,
        $scope,
        $defaultConfig,
        $layer,
        $cookies
      ) {
        var vm = this;
        $timeout(function() {
          initMenu();
        }, 100);
        //excel认证数据
        vm.excelData = {
          productIdList: [],
          source: ""
        };
        vm.user = JSON.parse(localStorage.getItem("user"));
        vm.toPayPop = false;
        vm.payInfo = {
          userName: "",
          orderNo: "",
          orderAmount: ""
        };
        if (vm.user) {
          if (vm.user.username) {
            vm.payInfo.userName = vm.user.username;
          }
        }
        //查询条件
        vm.localQuery = JSON.parse(
          localStorage.getItem("productFactoryPackage")
        );
        if (vm.localQuery) {
          vm.query = vm.localQuery;
        } else {
          vm.query = {
            pageNum: 1,
            pageSize: 10,
            userId: "",
            url: "productFactoryPackage",
            isUse: 2
          };
          if (vm.user) {
            if (vm.user.userId) {
              vm.query.userId = vm.user.userId;
            }
            if (vm.user.payInfo) {
              vm.payInfo.payInfo = vm.user.payInfo;
            }
          }
        }
        //默认获取
        vm.getPagedDataAsync = function() {
          $api.post("/tb/product/shopList", angular.toJson(vm.query), function(
            result
          ) {
            if (result.code == 0) {
              vm.list = result.data.list;
              vm.query.pages = result.data.pages;
              for (var i = 0; i < vm.list.length; i++) {
                vm.list[i].isUse == 1
                  ? (vm.list[i].isUseText = "已使用")
                  : (vm.list[i].isUseText = "未使用");
              }
            }
          });
        };
        //前往产品工厂
        vm.toProductFactory = function() {
          window.location.href =
            $defaultConfig.current_uri +
            "/productFactory/pages.html#/productFactoryList.html";
        };
        //切换状态
        vm.getList = function(type) {
          vm.query.isUse = type;
          vm.getPagedDataAsync(type);
        };
        //立即使用
        vm.toUse = function(obj) {
          vm.packageUseData = {
            orderDetailNo: obj.orderDetailNos.split(",")[0],
            id: obj.ids.split(",")[0]
          };
          localStorage.setItem(
            "packageUseData",
            JSON.stringify(vm.packageUseData)
          );
          $state.go("productFactoryPackageUse");
        };
        //再次购买
        vm.payAgain = function(obj) {
          $api.get("/tb/order/onemore/" + obj.id, function(result) {
            if (result.code == 0) {
              vm.payInfo.orderAmount = obj.price;
              vm.payInfo.orderNo = result.msg;
              vm.toPayPop = true;
              $api.post(
                "/company/getBalance",
                angular.toJson({ username: vm.user.username }),
                function(res) {
                  if (res.code == 0) {
                    vm.ticket = res.data.ticket;
                    $api.post(
                      "/account/info",
                      angular.toJson({ t: vm.ticket }),
                      function(res) {
                        if (res.code == 0) {
                          vm.payInfo.balance =
                            (res.data.info.subAccountInfos[0]
                              .subAccountBalance *
                              100 +
                              res.data.info.subAccountInfos[0]
                                .subAccountWithdrawBalance *
                                100) /
                            100; //余额
                        } else {
                          layer.msg(res.msg, { time: 1000 });
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        };
        //再次购买一期优化
        vm.payAgainOptimize = function(obj) {
          $api.post("/tb/product/buyAgain", angular.toJson(obj), function(
            result
          ) {
            if (result.code == 0) {
              // console.log('result==', result);
              $state.go("productFactoryCar");
            } else {
              layer.msg(result.msg, { time: 2000 });
            }
          });
        };
        //确认支付
        vm.confirmToPay = function() {
          if (vm.payInfo.orderAmount > vm.payInfo.balance) {
            return layer.msg("余额不足，请充值！", { time: 1000 });
          }
          //支付
          $api.post("/tbpay/order", angular.toJson(vm.payInfo), function(
            result
          ) {
            if (result.code == 0) {
              layer.msg(result.msg, { time: 1000 });
              vm.toPayPop = false;
              vm.getPagedDataAsync();
            }
          });
        };
        //取消支付
        vm.cancelPay = function() {
          vm.toPayPop = false;
          layer.msg("选择的产品未支付，保单已经生成", { time: 1200 });
        };
        //批量弹框显示
        vm.popAnnexShow = function(productWrapId, ids, productName) {
          vm.popAnnex = true;
          vm.currentProductWrapId = productWrapId;
          vm.currentIds = ids;
          vm.currentProductName = productName;
        };
        // 下载Excel模板
        vm.downloadExcelList = function() {
          $layer.loading();
          $api.get(
            "/tb/productWrap/generateExcel/" + vm.currentProductWrapId,
            function(result) {
              if (result.code === 0) {
                // $layer.close();
                vm.oneList = result.data.list;
                vm.twoList = result.data.defaultValueList;
                if (vm.oneList.length > 0) {
                  $timeout(function() {
                    // $layer.close();
                    $(".tableInfo02").table2excel({
                      exclude: ".noExl",
                      name: "Excel Document Name",
                      filename:
                        "产品包批量" +
                        new Date().toISOString().replace(/[\-\:\.]/g, "") +
                        ".xls",
                      fileext: ".xls"
                    });
                  }, 1200);
                }
              } else {
                layer.msg(result.msg, { time: 1500 });
              }
            }
          );
        };
        //附件上传-选择excel
        vm.readExcel = function(obj) {
          var files = obj;
          vm.file = files[0];
          vm.fileName = files[0].name;
          vm.canUpload = true;
        };
        //附件上传-提交
        vm.uploadExcel = function() {
          $layer.loading();
          $upload
            .upload({
              url: $defaultConfig.app_uri + "/tb/productWrap/excelTbOrder",
              headers: {
                token: vm.user.token
              },
              file: vm.file,
              data: {
                source: vm.user.source,
                ids: vm.currentIds,
                productName: vm.currentProductName
              }
            })
            .progress(function(evt) {
              //上传进度
            })
            .success(function(data, status, headers, config) {
              if (data.code == 0) {
                $layer.close();
                vm.fileName = "";
                vm.file = "";
                vm.canUpload = false;
                vm.popAnnex = false;
                layer.msg(data.msg, { time: 1000 });
              } else {
                $layer.close();
                vm.fileName = "";
                vm.file = "";
                vm.canUpload = false;
                layer.alert(data.msg, {
                  icon: 2,
                  skin: "layer-ext-moon"
                });
              }
              vm.getPagedDataAsync();
            })
            .error(function(data, status, headers, config) {
              $layer.close();
              layer.msg("服务器异常，请重新尝试", { time: 1000 });
            });
        };
        //关闭层
        vm.closePopAnnex = function() {
          vm.popAnnex = false;
          vm.query.pageNum = 1;
          vm.getPagedDataAsync();
        };
      }
    ]);
})();
