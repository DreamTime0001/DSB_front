var app = angular.module("register", [
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
app.controller("registerController", [
  "$scope",
  "$cookies",
  "$cookieStore",
  "$defaultConfig",
  "$api",
  "$util",
  "$http",
  "$layer",
  "$timeout",
  "$location",
  "$anchorScroll",
  "$interval",
  "$filter",
  function(
    $scope,
    $cookies,
    $cookieStore,
    $defaultConfig,
    $api,
    $util,
    $http,
    $layer,
    $timeout,
    $location,
    $anchorScroll,
    $interval,
    $filter
  ) {
    var vm = this;
    vm.paracont = "获取验证码";
    vm.paraclass = "but_null";
    vm.paraevent = true;
    vm.iconDis = true;
    vm.icoDisabled = true; //协议按钮默认不可点
    vm.checkBox = false; //同意默认
    vm.popShow = false; //弹出层默认
    vm.regular = {
      phone: /^[1][3,4,5,7,8][0-9]{9}$/,
      password: /[\u4E00-\u9FA5]/g
    };

    vm.register = {
      companyName: "", //企业名称
      username: "", //手机号
      password: "", //密码
      confirmPassword: "", //确认密码
      verifyCode: "", //验证码
      photoCode: "", //图片验证码
      productList: [], //产品类型
      companyList: [], //企业类型
      agreementStartTime: "", //协议阅读开始时间
      agreementEndTime: "" //协议阅读结束时间
    };
    vm.errors = {
      username: false,
      password: false,
      confirmPassword: false,
      companyName: false,
      photoCode: false,
      verifyCode: false
    };
    //产品类型
    vm.product = [
      {
        type: 0,
        name: "进口",
        checked: false
      },
      {
        type: 1,
        name: "出口",
        checked: false
      }
    ];
    // 企业类型
    vm.company = [];

    //计算字符长度
    function sumChartCode(str) {
      if (str) {
        return str.replace(/[\u0391-\uFFE5]/g, "aa").length; //先把中文替换成两个字节的英文，在计算长度
      } else {
        return 0;
      }
    }

    //获得焦点
    vm.getFocus = function(id) {
      $location.hash(id);
      $anchorScroll();
      $("#" + id).focus();
    };
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
    //获取协议开始时间
    vm.getStartTime = function() {
      vm.agree = false;
      if (vm.checkBox) {
        vm.popShow = true;
        vm.register.agreementStartTime = $filter("date")(
          new Date(),
          "yyyy-MM-dd HH:mm:ss"
        );
      } else {
        vm.popShow = false;
        vm.checkBox = false;
      }
    };
    //获取协议结束时间
    vm.getEndTime = function() {
      vm.popShow = false;
      vm.agree = true;
      vm.register.agreementEndTime = $filter("date")(
        new Date(),
        "yyyy-MM-dd HH:mm:ss"
      );
    };
    //判断是否点击同意
    vm.isAgree = function() {
      vm.popShow = false;
      vm.agree ? (vm.checkBox = true) : (vm.checkBox = false);
    };

    //判断手机号是否重复
    vm.isUsernameRegister = function() {
      if (vm.register.username == "") {
        vm.errors.username = true;
        return layer.msg("手机号不能为空", { time: 1000 });
      } else if (!vm.regular.phone.test(vm.register.username)) {
        vm.errors.username = true;
        return layer.msg("手机号不正确", { time: 1000 });
      }
      $api.post(
        "/user/isUsernameRegister",
        angular.toJson({ username: vm.register.username }),
        function(result) {
          if (result.code === 1) {
            vm.errors.username = true;
            return layer.msg(result.msg, { time: 1000 });
          } else {
            vm.iconDis = false;
          }
        }
      );
    };
    //判断密码
    vm.isPassword = function() {
      if (vm.register.password == "") {
        vm.errors.password = true;
        return layer.msg("密码不能为空", { time: 1000 });
      } else if (vm.regular.password.test(vm.register.password)) {
        vm.errors.password = true;
        return layer.msg("不能输入中文", { time: 1000 });
      } else if (
        sumChartCode(vm.register.password) < 8 ||
        sumChartCode(vm.register.password) > 20
      ) {
        vm.errors.password = true;
        return layer.msg("不能少于8位或多于20位", { time: 1000 });
      } else if (vm.register.confirmPassword != "") {
        if (vm.register.password != vm.register.confirmPassword) {
          vm.errors.password = true;
          return layer.msg("密码与确认密码不一致", { time: 1000 });
        } else {
          vm.errors.confirmPassword = false;
          vm.errors.password = false;
        }
      }
    };
    //确认密码匹配一致
    vm.isconfirmPassword = function() {
      if (vm.register.password != "") {
        if (vm.register.password != vm.register.confirmPassword) {
          vm.errors.confirmPassword = true;
          return layer.msg("密码与确认密码不一致", { time: 1000 });
        } else {
          vm.errors.confirmPassword = false;
          vm.errors.password = false;
        }
      }
    };
    //获取所有商户类型
    $api.get('/v1/tb/product/productIdCard', function (result) {
        if (result.code == 0) {
            vm.company = result.data;
            for (var i = 0; i < vm.company.length; i++) {
                vm.company[i].checked = false;
            }
        }
    });
    //判断企业名称
    vm.iscompanyName = function() {
      if (vm.register.companyName == "") {
        vm.errors.companyName = true;
        return layer.msg("企业名称不能为空", { time: 1000 });
      }
    };
    //判断图形验证码
    vm.isPhotoCode = function() {
      if (vm.register.photoCode == "") {
        vm.errors.photoCode = true;
        return layer.msg("图片验证码不能为空", { time: 1000 });
      }
    };
    //判断验证码
    vm.isVerifyCode = function() {
      if (vm.register.verifyCode == "") {
        vm.errors.verifyCode = true;
        return layer.msg("验证码不能为空", { time: 1000 });
      }
    };
    //获取图片验证码
    vm.changVerifyCodeImg = function() {
      vm.verifyCodeImg =
        $defaultConfig.app_uri + "/code/photoCode?" + new Date().getTime();
    };
    vm.changVerifyCodeImg();
    var second = null,
      timePromise = undefined;
    //获取验证码
    vm.getCode = function() {
      if (second === null) {
        second = 60;
        if (vm.errors.username == true) {
          vm.errors.usernameText = "";
          second = null;
          return layer.msg("手机号不正确", { time: 1000 });
        } else if (vm.register.photoCode == "") {
          second = null;
          return layer.msg("验证码不能为空", { time: 1000 });
        } else {
          $api.post(
            "/code/getVerifyCode",
            angular.toJson({
              phoneNo: vm.register.username,
              photoCode: vm.register.photoCode
            }),
            function(result) {
              if (result.code == 0) {
                vm.iconDis = true;
                timePromise = $interval(
                  function() {
                    if (second <= 0) {
                      $interval.cancel(timePromise);
                      timePromise = undefined;
                      second = null;
                      vm.paracont = "重发验证码";
                      vm.paraclass = "but_null";
                      vm.paraevent = true;
                      vm.iconDis = false;
                    } else {
                      vm.paracont = second + "s";
                      second--;
                    }
                  },
                  1000,
                  1000
                );
              } else {
                layer.msg(result.msg, { time: 1000 });
                vm.changVerifyCodeImg();
                second = null;
              }
            }
          );
        }
      } else {
        return false;
      }
    };
    //注册按钮
    vm.regiter = function() {
      for (key in vm.errors) {
        if (vm.errors[key] == true) {
          vm.getFocus(key);
          return false;
        }
      }
      if (vm.register.username == "") {
        vm.errors.username = true;
        return layer.msg("手机号不能为空", { time: 1000 });
      }
      if (vm.register.password == "") {
        vm.errors.password = true;
        return layer.msg("密码不能为空", { time: 1000 });
      }
      if (vm.register.confirmPassword == "") {
        vm.errors.confirmPassword = true;
        return layer.msg("确认密码不能为空", { time: 1000 });
      }
      if (vm.register.companyName == "") {
        vm.errors.companyName = true;
        return layer.msg("企业名称不能为空", { time: 1000 });
      }
      vm.register.productList = [];
      vm.register.companyList = [];
      for (var i = 0; i < vm.product.length; i++) {
        if (vm.product[i].checked) {
          vm.register.productList.push(vm.product[i].type);
        }
      }
      for (var i = 0; i < vm.company.length; i++) {
        if (vm.company[i].checked) {
          vm.register.companyList.push(vm.company[i].id);
        }
      }
      if (vm.register.productList.length == 0) {
        return layer.msg("请选择产品类型", { time: 1000 });
      }
      if (vm.register.companyList.length == 0) {
        return layer.msg("请选择企业类型", { time: 1000 });
      }
      if (vm.register.photoCode == "") {
        vm.errors.photoCode = true;
        return layer.msg("图片验证码不能为空", { time: 1000 });
      }
      if (vm.register.verifyCode == "") {
        vm.errors.verifyCode = true;
        return layer.msg("证码不能为空", { time: 1000 });
      }
      if (vm.checkBox == false) {
        return layer.msg("请先阅读并同意《豆沙包商户平台合作协议》", {
          time: 1000
        });
      }
      $api.post("/company/register", angular.toJson(vm.register), function(
        result
      ) {
        if (result.code === 0) {
          layer.msg(result.msg, { time: 1000 });
          localStorage.clear();
          $timeout(function() {
            window.location.href = $defaultConfig.current_uri + "/login.html";
          }, 1200);
        } else {
          return layer.msg(result.msg, { time: 1000 });
        }
      });
    };
  }
]);
