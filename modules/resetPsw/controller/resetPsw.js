var app = angular.module('resetPsw', ['ngCookies', 'app.config', 'app.services', 'app.layer', 'app.util']);
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    $httpProvider.defaults.withCredentials = true;
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' +
                        encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}]);
app.controller('resetPswController', ['$scope', '$cookies', '$cookieStore', '$defaultConfig', '$api', '$util', '$http', '$layer', '$timeout', '$location', '$anchorScroll', '$interval', function ($scope, $cookies, $cookieStore, $defaultConfig, $api, $util, $http, $layer, $timeout, $location, $anchorScroll, $interval) {
    var vm = this;
    vm.paracont = '获取验证码';
    vm.paraclass = 'but_null';
    vm.paraevent = true;
    vm.iconDis = true;
    vm.regular = {
        phone: /^[1][3,4,5,7,8][0-9]{9}$/,
        password: /[\u4E00-\u9FA5]/g
    };
    vm.reset = {
        username:'',
        password:'',
        confirmPassword:'',
        type:0,
        verifyCode:''
    };

    vm.errors = {
        username: false,
        usernameText: '',
        password: false,
        passwordText: '',
        cfmPassword: false,
        cfmPasswordText: '',
        photoCodeText: ''
    };


    //计算字符长度
    function sumChartCode(str) {
        if (str) {
            return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
        }
        else {
            return 0
        }
    }

    //获得焦点
    vm.getFocus = function (id) {
        $location.hash(id);
        $anchorScroll();
        $('#' + id).focus();
    };

    //判断手机号是否重复
    vm.isUsernameRegister = function() {
        if (vm.reset.username == "") {
          vm.errors.username = true;
          return layer.msg("手机号不能为空", { time: 1000 });
        } else if (!vm.regular.phone.test(vm.reset.username)) {
          vm.errors.username = true;
          return layer.msg("手机号不正确", { time: 1000 });
        }
        $api.post(
          "/user/isUsernameRegister",
          angular.toJson({ username: vm.reset.username }),
          function(result) {
            if (result.code === 1) {
                vm.iconDis = false;
            } else {
                vm.errors.username = true;
                return layer.msg('手机号未注册!', { time: 1000 });
            }
          }
        );
      };
    //判断密码
    vm.isPassword = function() {
        if (vm.reset.password == "") {
          vm.errors.password = true;
          return layer.msg("新密码不能为空", { time: 1000 });
        } else if (vm.regular.password.test(vm.reset.password)) {
          vm.errors.password = true;
          return layer.msg("不能输入中文", { time: 1000 });
        } else if (
          sumChartCode(vm.reset.password) < 8 ||
          sumChartCode(vm.reset.password) > 20
        ) {
          vm.errors.password = true;
          return layer.msg("不能少于8位或多于20位", { time: 1000 });
        } else if (vm.reset.confirmPassword != "") {
          if (vm.reset.password != vm.reset.confirmPassword) {
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
        if (vm.reset.password != "") {
          if (vm.reset.password != vm.reset.confirmPassword) {
            vm.errors.confirmPassword = true;
            return layer.msg("新密码与确认密码不一致", { time: 1000 });
          } else {
            vm.errors.confirmPassword = false;
            vm.errors.password = false;
          }
        }
      };
  //判断图形验证码
  vm.isPhotoCode = function() {
    if (vm.reset.photoCode == "") {
      vm.errors.photoCode = true;
      return layer.msg("图片验证码不能为空", { time: 1000 });
    }
  };
  //判断验证码
  vm.isVerifyCode = function() {
    if (vm.reset.verifyCode == "") {
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
      } else if (vm.reset.photoCode == "") {
        second = null;
        return layer.msg("验证码不能为空", { time: 1000 });
      } else {
        $api.post(
          "/code/getVerifyCode",
          angular.toJson({
            phoneNo: vm.reset.username,
            photoCode: vm.reset.photoCode
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
    
    //提交按钮
    vm.submit = function () {
        for (key in vm.errors) {
            if (vm.errors[key] == true) {
              vm.getFocus(key);
              return false;
            }
          }
          if (vm.reset.username == "") {
            vm.errors.username = true;
            return layer.msg("手机号不能为空", { time: 1000 });
          }
          if (vm.reset.password == "") {
            vm.errors.password = true;
            return layer.msg("密码不能为空", { time: 1000 });
          }
          if (vm.reset.confirmPassword == "") {
            vm.errors.confirmPassword = true;
            return layer.msg("确认密码不能为空", { time: 1000 });
          }else{
            $api.post('/user/findPassword', angular.toJson(vm.reset), function (result) {
                if (result.code === 0) {
                    layer.msg(result.msg, {time: 1000});
                    $timeout(function () {
                        window.location.href = $defaultConfig.current_uri + '/login.html';
                    }, 1200)
                } else {
                    return layer.msg(result.msg, {time: 1000});
                }
            });
          }
    }


}])
;