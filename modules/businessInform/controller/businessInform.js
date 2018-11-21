(function() {
  "use strict";
  angular.module("app.controllers").controller("businessInformController", [
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
      //校验
      (vm.phone = /^[1][3,4,5,7,8][0-9]{9}$/), (vm.completePop = false);
      vm.emailReg = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      vm.user = JSON.parse(localStorage.getItem("user"));
      vm.isComplete = vm.user.isComplete; //0-未完善 1-已完善
      vm.complete = {
        id: vm.user.companyId,
        contactName: "",
        contactPhone: "",
        email: "",
        businessRefer: ""
      };
      vm.userInfo = {
        id: vm.user.userId,
        password: "",
        oldPassword: ""
      };
      vm.query = {
        pageNum: 1,
        pageSize: 10,
        source: vm.user.source
      };
      vm.getPagedDataAsync = function() {
        $api.post(
          "/company/companyProductList",
          angular.toJson(vm.query),
          function(result) {
            if (result.code === 0) {
              vm.list = result.data.list;
              for (var i = 0; i < vm.list.length; i++) {
                if (vm.list[i].productType == 0) {
                  vm.list[i].productTypeText = "费率";
                } else if (vm.list[i].productType == 1) {
                  vm.list[i].productTypeText = "定价";
                } else if (vm.list[i].productType == 2) {
                  vm.list[i].productTypeText = "份数";
                } else if (vm.list[i].productType == 3) {
                  vm.list[i].productTypeText = "组合";
                } else if (vm.list[i].productType == 4) {
                  vm.list[i].productTypeText = "组合费率";
                }
              }
              vm.query.pages = result.data.pages;
            }
          }
        );
      };
      //---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
      //获取商户信息
      $api.get("/merchant/merchant_List?userId=" + vm.user.userId, function(
        result
      ) {
        vm.businessInfo = result.data[0];
        vm.businessInfo.ePoints == null ? (vm.businessInfo.ePoints = 0) : null;
      });
      //计算字符长度
      function sumChartCode(str) {
        if (str) {
          return str.replace(/[\u0391-\uFFE5]/g, "aa").length; //先把中文替换成两个字节的英文，在计算长度
        } else {
          return 0;
        }
      }
      //修改密码
      vm.changePassword = function() {
        vm.passwordReg = /[\u4E00-\u9FA5]/g;
        // 判断原密码
        if (vm.userInfo.oldPassword == "") {
          layer.msg("原密码不能为空！", { time: 1000 });
          return false;
        }
        // 判断新密码
        if (vm.userInfo.password == "") {
          layer.msg("新密码不能为空！", { time: 1000 });
          return false;
        } else if (vm.passwordReg.test(vm.userInfo.password)) {
          layer.msg("新密码不能输入中文！", { time: 1000 });
          return false;
        } else if (
          sumChartCode(vm.userInfo.password) < 8 ||
          sumChartCode(vm.userInfo.password) > 20
        ) {
          layer.msg("新密码不能少于8位或多于20位！", { time: 1000 });
          return false;
        }
        // 判断确认密码
        if (vm.userInfo.password != vm.userInfo.passwordAgain) {
          layer.msg("新密码与确认密码不一致！", { time: 1000 });
          return false;
        }
        $api.post(
          "/merchant/merchantPwd",
          angular.toJson(vm.userInfo),
          function(result) {
            if (result.code == 0) {
              layer.msg(result.msg, { time: 1000 });
              vm.popShow = false;
              $timeout(function() {
                vm.logout();
              }, 1500);
            } else {
              layer.msg(result.msg, { time: 1000 });
            }
          }
        );
      };
      //登出
      vm.logout = function() {
        $api.post("/user/logout", function(result) {
          localStorage.clear(); //清除缓存
          var getCookies = $cookies.getAll(); //获取所有cooikes的值
          //循环删除
          angular.forEach(getCookies, function(v, k) {
            $cookies.remove(k);
          });
          window.location.href = $defaultConfig.current_uri + "login.html";
        });
      };
      //详情
      vm.editProduct = function(o) {
        $state.go("businessInformDetails", {
          id: o.id,
          productId: o.productId
        });
      };

      //完善修改弹框
      vm.completePopShow = function(status) {
        if (status == 1) {
          vm.complete.contactName = vm.businessInfo.contactName;
          vm.complete.contactPhone = vm.businessInfo.contactPhone;
          vm.complete.email = vm.businessInfo.email;
          vm.complete.businessRefer = vm.businessInfo.businessRefer;
        }
        vm.completePop = true;
      };
      //完善信息
      vm.perfectCompany = function() {
        if (vm.complete.contactName == "") {
          return layer.msg("联系人不能为空", { time: 1000 });
        }
        if (vm.complete.contactPhone == "") {
          return layer.msg("手机号不能为空", { time: 1000 });
        } else if (!vm.phone.test(vm.complete.contactPhone)) {
          return layer.msg("手机号格式不正确", { time: 1000 });
        }
        if (vm.complete.email == "") {
          return layer.msg("邮箱不能为空", { time: 1000 });
        } else if (!vm.emailReg.test(vm.complete.email)) {
          return layer.msg("邮箱格式不正确", { time: 1000 });
        }
        if (vm.isComplete == 0) {
          if (vm.complete.businessRefer == "") {
            return layer.msg("豆沙包对接人不能为空", { time: 1000 });
          }
        }
        $api.post(
          "/company/perfectCompany",
          angular.toJson(vm.complete),
          function(result) {
            if (result.code == 0) {
              vm.isComplete = 1;
              vm.user.isComplete = 1;
              localStorage.setItem("user", JSON.stringify(vm.user));
              vm.completePop = false;
              $api.get(
                "/merchant/merchant_List?userId=" + vm.user.userId,
                function(result) {
                  vm.businessInfo = result.data[0];
                  vm.businessInfo.ePoints == null
                    ? (vm.businessInfo.ePoints = 0)
                    : null;
                }
              );
              layer.msg(result.msg, { time: 1000 });
            }
          }
        );
      };
    }
  ]);
})();
