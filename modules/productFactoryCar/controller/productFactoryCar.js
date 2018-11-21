(function() {
  "use strict";
  angular.module("app.controllers").controller("productFactoryCarController", [
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
      vm.settle = {
        price: 0,
        shopList: []
      };
      vm.shop = {
        allChecked: true,
        shopList: []
      };
      vm.user = JSON.parse(localStorage.getItem("user"));
      vm.payInfo = {
        userName: vm.user.username,
        orderNo: "",
        orderAmount: ""
      };
      vm.settle.priceText = "0.00";
      vm.toPayPop = false;
      //获取购物车
      vm.getList = function() {
        $api.post("/tbcard/list", function(result) {
          if (result.code == 0) {
            vm.shop.shopList = vm.shop.shopList.concat(result.data.shopList);
            vm.shop.allChecked = result.data.allChecked;
            for (var i = 0; i < vm.shop.shopList.length; i++) {
              vm.shop.shopList[i].priceSum = (
                vm.shop.shopList[i].num * vm.shop.shopList[i].price
              ).toFixed(2);
              vm.settle.price += Number(vm.shop.shopList[i].priceSum);
            }
            vm.settle.price = vm.settle.price.toFixed(2);
          }
        });
      };

      //---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//

      vm.icoDisabled = false; //协议按钮默认不可点
      vm.checkBox = true; //同意默认
      vm.popShow = false; //弹出层默认
      // 协议弹出框监听滚动条
      $(".protocolPop").scroll(function() {
        var viewH = $(this).get(0).offsetHeight, //可见高度
          contentH = $(this).get(0).scrollHeight, //内容高度
          scrollTop = $(this).scrollTop(); //滚动高度
        if (scrollTop >= contentH - viewH - 5) {
          //到达底部时,加载新内容
          vm.icoDisabled = false;
          $scope.$apply();
        }
      });
      vm.getStartTime = function() {
        vm.agree = false;
        vm.popShow = true;
        // if (vm.checkBox) {
        //     vm.popShow = true;
        // }
        // else {
        //     vm.popShow = false;
        //     vm.checkBox = false;
        // }
      };
      //获取协议结束时间
      vm.getEndTime = function() {
        vm.popShow = false;
        vm.agree = true;
        vm.checkBox = true;
      };
      //判断是否点击同意
      vm.isAgree = function() {
        vm.popShow = false;
        vm.agree ? (vm.checkBox = false) : (vm.checkBox = true);
      };

      //前往产品工厂
      vm.toProductFactory = function() {
        window.location.href =
          $defaultConfig.current_uri +
          "/productFactory/pages.html#/productFactoryList.html";
      };
      //获取总价
      vm.getSum = function() {
        var sum = null;
        for (var i = 0; i < vm.shop.shopList.length; i++) {
          sum += Number(vm.shop.shopList[i].priceSum);
        }
        return sum;
      };
      //列表提交
      vm.submitList = function() {
        $api.post(
          "/productfactory/updateCard",
          angular.toJson(vm.shop),
          function(result) {
            if (result.code == 0) {
              vm.settle.price = 0;
              var num = 0;
              for (var i = 0; i < vm.shop.shopList.length; i++) {
                if (vm.shop.shopList[i].checked) {
                  vm.settle.price += Number(vm.shop.shopList[i].priceSum);
                  num++;
                }
              }
              if (num > 0) {
                if (num == vm.shop.shopList.length) {
                  vm.allChecked = true;
                }
              }
              vm.settle.price = vm.settle.price.toFixed(2);
            }
          }
        );
      };
      //加法
      vm.toPlus = function(obj) {
        obj.num += 1;
        obj.priceSum = (obj.price * obj.num).toFixed(2);
        vm.submitList();
      };
      //减法
      vm.toMinus = function(obj) {
        if (obj.num > 1) {
          obj.num -= 1;
          obj.priceSum = (obj.priceSum - obj.price).toFixed(2);
          vm.submitList();
        }
      };
      //删除
      vm.toDelete = function(index, obj) {
        vm.shop.shopList.splice(index, 1);
        if (vm.shop.shopList.length == 0) {
          vm.settle.price = 0;
        } else {
          vm.settle.price = vm.getSum().toFixed(2);
        }
        $api.post(
          "/productfactory/deleteShopCard",
          angular.toJson({ id: obj.id }),
          function(result) {
            if (result.code == 0) {
              layer.msg(result.msg, { time: 1000 });
            }
          }
        );
        var num = 0;
        vm.settle.price = 0;
        for (var i = 0; i < vm.shop.shopList.length; i++) {
          if (vm.shop.shopList[i].checked) {
            vm.settle.price += Number(vm.shop.shopList[i].priceSum);
            num++;
          }
        }
        vm.settle.price = vm.settle.price.toFixed(2);
        if (num == vm.shop.shopList.length) {
          vm.shop.allChecked = true;
        } else {
          vm.shop.allChecked = false;
        }
        //如果删除购物车中未选中的产品包,则全选按钮变为选中(参考单选)
        // var num = 0;
        // vm.settle.price = 0;
        // for (var i = 0; i < vm.shop.shopList.length; i++) {
        //   if (vm.shop.shopList[i].checked) {
        //     vm.settle.price += Number(vm.shop.shopList[i].priceSum);
        //     num++;
        //   }
        // }
        // vm.settle.price = vm.settle.price.toFixed(2);
        // if (num == vm.shop.shopList.length) {
        //   vm.shop.allChecked = true;
        // } else {
        //   vm.shop.allChecked = false;
        // }
      };
      //全选
      vm.selectAll = function() {
        if (vm.shop.allChecked) {
          for (var i = 0; i < vm.shop.shopList.length; i++) {
            vm.shop.shopList[i].checked = true;
          }
          vm.settle.price = vm.getSum().toFixed(2);
        } else {
          for (var i = 0; i < vm.shop.shopList.length; i++) {
            vm.shop.shopList[i].checked = false;
          }
          vm.settle.price = 0;
        }
        vm.submitList();
      };
      //单选
      vm.singleSelect = function() {
        var num = 0;
        vm.settle.price = 0;
        for (var i = 0; i < vm.shop.shopList.length; i++) {
          if (vm.shop.shopList[i].checked) {
            vm.settle.price += Number(vm.shop.shopList[i].priceSum);
            num++;
          }
        }
        vm.settle.price = vm.settle.price.toFixed(2);
        if (num == vm.shop.shopList.length) {
          vm.shop.allChecked = true;
        } else {
          vm.shop.allChecked = false;
        }
        vm.submitList();
      };

      //结算
      vm.toSettle = function() {
        var num = 0;
        for (var i = 0; i < vm.shop.shopList.length; i++) {
          if (vm.shop.shopList[i].checked) {
            vm.settle.shopList.push(vm.shop.shopList[i]);
            num++;
          }
        }
        if (vm.checkBox == false) {
          return layer.msg("请先同意用户服务购买协议！", { time: 1000 });
        }
        if (num == 0) {
          return layer.msg("请选择一个产品", { time: 1000 });
        } else {
          $api.post(
            "/productfactory/saveOrder",
            angular.toJson(vm.settle),
            function(result) {
              if (result.code == 0) {
                vm.settle.shopList = [];
                vm.settle.price = 0;
                vm.toPayPop = true;
                vm.payInfo.orderNo = result.data.orderNo;
                vm.payInfo.orderAmount = result.data.orderAmount;
                $api.post(
                  "/company/getBalance",
                  angular.toJson({ username: vm.payInfo.userName }),
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
            }
          );
        }
      };
      //确认支付
      vm.confirmToPay = function() {
        if (vm.payInfo.orderAmount > vm.payInfo.balance) {
          return layer.msg("余额不足，请充值！", { time: 1000 });
        }
        //支付
        $api.post("/tbpay/order", angular.toJson(vm.payInfo), function(result) {
          if (result.code == 0) {
            layer.msg(result.msg, { time: 1000 });
            vm.toPayPop = false;
            $state.go("productFactoryPackage");
          }
        });
      };
      //取消支付
      vm.cancelPay = function() {
        vm.toPayPop = false;
        vm.getList();
        layer.msg("选择的产品未支付，保单已经生成", { time: 1200 });
      };
    }
  ]);
})();
