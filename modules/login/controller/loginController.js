var app = angular.module("login", [
  "ngCookies",
  "app.config",
  "app.services",
  "app.layer",
  "app.util"
]);
app.config([
  "$httpProvider",
  function($httpProvider) {
    $httpProvider.defaults.headers.put["Content-Type"] =
      "application/json;charset=utf-8";
    $httpProvider.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    // x-www-form-urlencoded
    $httpProvider.defaults.withCredentials = true;
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [
      function(data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
          var query = "";
          var name, value, fullSubName, subName, subValue, innerObj, i;
          for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
              for (i = 0; i < value.length; ++i) {
                subValue = value[i];
                fullSubName = name + "[" + i + "]";
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + "&";
              }
            } else if (value instanceof Object) {
              for (subName in value) {
                subValue = value[subName];
                fullSubName = name + "[" + subName + "]";
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + "&";
              }
            } else if (value !== undefined && value !== null) {
              query +=
                encodeURIComponent(name) +
                "=" +
                encodeURIComponent(value) +
                "&";
            }
          }
          return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== "[object File]"
          ? param(data)
          : data;
      }
    ];
  }
]);
app.controller("loginController", [
  "$scope",
  "$cookies",
  "$cookieStore",
  "$defaultConfig",
  "$api",
  "$util",
  "$http",
  "$layer",
  "$timeout",
  function(
    $scope,
    $cookies,
    $cookieStore,
    $defaultConfig,
    $api,
    $util,
    $http,
    $layer,
    $timeout
  ) {
    var vm = this;
    //登录用户名密码
    vm.query = {
      telephone: "",
      password: ""
    };
    vm.errorMsgIsShow = false; //报错信息是否显示
    vm.errorMsg = ""; //报错内容
    //通知hover效果
    $(".marquee p").hover(
      function() {
        $(this).addClass("pause");
      },
      function() {
        $(this).removeClass("pause");
      }
    );
    //登录按钮
    vm.login = function() {
      if (!vm.query.telephone) {
        return layer.msg("请输入用户名", { time: 1000 });
      }
      if (!vm.query.password) {
        return layer.msg("请输入密码", { time: 1000 });
      }
      localStorage.clear();
      var getCookies = $cookies.getAll(); //获取所有cooikes的值
      //循环删除
      angular.forEach(getCookies, function(v, k) {
        $cookies.remove(k);
      });
      $api.post("/user/login", angular.toJson(vm.query), function(result) {
        if (result.code === 0) {
          vm.user = {
            token: result.token,
            isFront: result.isFront, //用户属于前台还是后台
            epoints: result.epoints, //用户的epotints金额
            userId: result.userId, //用户的userId
            isMerchantManagement: result.isMerchantManagement, //商户管理是否显示
            isPandect: result.isPandect, //总览是否显示
            isUserManagement: result.isUserManagement, //用户管理是否显示
            isCenter: result.isCenter, //后台管理中心是否显示
            isAdmin: result.isAdmin, //是否是Admin
            username: result.username, //登录名
            isComplete: result.isComplete, //是否完善良信息
            user:result.companyName,//登录后右上角显示的名字
            source:result.source,
            companyId:result.companyId
          };
          localStorage.clear(); //清除缓存
          localStorage.setItem("user", JSON.stringify(vm.user));
          vm.isComplete = result.isComplete; //是否完善良信息
          $api.get("/user/menus", function(result) {
            var menuList = result.data.menuList;
            var landingPage = menuList[0].list[0].url;
            // vm.user.user = result.user;
            // localStorage.setItem("user", JSON.stringify(vm.user)); //用户名
            vm.user.landingPage = landingPage;
            localStorage.setItem("menuList", JSON.stringify(menuList)); //当前第一页
            window.location.href =
              $defaultConfig.current_uri +
              "/index.html#/" +
              landingPage +
              ".html";
          });
        } else {
          layer.msg(result.msg, { time: 1000 });
        }
      });
    };
    //登录回车事件
    vm.loginKeyPress = function(event) {
      if (event.charCode == 13) {
        vm.login();
      }
    };
    //跳转注册页
    vm.toRegister = function() {
      window.location.href = $defaultConfig.current_uri + "/register.html";
    };
    // 跳转重置密码页
    vm.toReset = function() {
      window.location.href = $defaultConfig.current_uri + "/resetPsw.html";
    };
    //微信端输入框bug
    $("#telephone,#password").bind("focus", function() {
      $(".marquee").addClass("toBottom");
    });

    //获取地址
    function getRequest() {
      var url = window.location.search; //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    }

    var indexPhoneNum = getRequest().indexPhoneNum;
    localStorage.setItem("indexPhoneNum", indexPhoneNum);
  }
]);
