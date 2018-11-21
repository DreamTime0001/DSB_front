(function() {
  "use strict";
  angular
    .module("app.controllers", ["ngCookies", "angularFileUpload"])
    // 首页
    .controller("indexController", [
      "$state",
      "$cookies",
      "$timeout",
      "$api",
      "$defaultConfig",
      "$location",
      "$filter",
      "$http",
      "$layer",
      "$scope",
      function(
        $state,
        $cookies,
        $timeout,
        $api,
        $defaultConfig,
        $location,
        $filter,
        $http,
        $layer,
        $scope
      ) {
        var vm = this;
        vm.state = $state;
        vm.user = JSON.parse(localStorage.getItem("user"));
        // vm.user = $cookies.get('user');//获取用户名
        // vm.isFront = $cookies.get('isFront');//获取用户前台后台显示
        // vm.ePoints = $cookies.get('epoints');//获取ePoints
        // vm.isMerchantManagement = $cookies.get('isMerchantManagement');//商户管理是否显示
        // vm.isPandect = $cookies.get('isPandect');//总览是否显示
        // vm.isUserManagement = $cookies.get('isUserManagement');//用户管理是否显示
        // vm.isCenter = $cookies.get('isCenter');//后台管理中心是否显示
        // vm.isAdmin = $cookies.get('isAdmin');//是否是Admin
        var menuList = JSON.parse(localStorage.getItem("menuList"));
        //默认加载左侧导航
        vm.init = function() {
          vm.menuList = menuList;
          $timeout(function() {
            initMenu();
            menuClick();
          }, 100);
        };
        $api.post("/account/ssoService", function(result) {
          if (result.code == 0) {
            $scope.ticket = result.data.ticket;
            $api.post(
              "/account/info",
              angular.toJson({ t: $scope.ticket, withdrawCurrency: "156" }),
              function(res) {
                vm.subAccountBalance =
                  (res.data.info.subAccountInfos[0].subAccountBalance * 100 +
                    res.data.info.subAccountInfos[0].subAccountWithdrawBalance *
                      100) /
                  100; //余额
              }
            );
          }
        });

        //登出
        vm.logout = function() {
          $api.post("/user/logout", function(result) {
            localStorage.clear(); //清除缓存
            var getCookies = $cookies.getAll(); //获取所有cooikes的值
            //循环删除
            angular.forEach(getCookies, function(v, k) {
              $cookies.remove(k);
            });
            window.location.href = $defaultConfig.current_uri + "/login.html";
          });
        };
        //总览
        vm.toDashborad = function() {
          window.open($defaultConfig.current_uri + "/dashboard.html");
        };
        //后台管理
        vm.toSelf = function() {
          localStorage.removeItem("currentPage");
          window.location.href =
            $defaultConfig.current_uri +
            "/index.html#/" +
            vm.user.landingPage +
            ".html";
        };
        //路由跳转-并清除相应缓存
        vm.goUrl = function(url) {
          //清除相应的缓存
          localStorage.removeItem("businessManage");
          localStorage.removeItem("imperfectInfo");
          localStorage.removeItem("productManageCompany");
          localStorage.removeItem(url);
          //路由跳转
          $state.go(url);
        };
        //跳转用户管理
        vm.goBusinessManage = function() {
          localStorage.removeItem("imperfectInfo");
          localStorage.removeItem("productManageCompany");
          $state.go("businessManage");
        };
        // 移动端
        // 隐去侧边栏
        var flag = 1;
        vm.hideSliderBar = function() {
          if (flag == 1) {
            $(".aside").animate(
              {
                left: 0
              },
              600
            );
            flag = 0;
          } else if (flag == 0) {
            $(".aside").animate(
              {
                left: -230
              },
              600
            );
            flag = 1;
          }
        };
        window.onresize = function() {
          if (screen.width > 414) {
            $(".aside").animate(
              {
                left: 0
              },
              600
            );
          } else {
            $(".aside").animate(
              {
                left: -230
              },
              600
            );
          }
        };
        // if (vm.isFront == 0) {
        //     $(".applogo").addClass('newTestBg');
        //     $(".aside").addClass('blue');
        // } else {
        //     $(".applogo").addClass('red');
        //     $(".aside").addClass('red');
        // }
      }
    ]);
})();
