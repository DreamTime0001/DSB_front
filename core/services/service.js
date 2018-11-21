(function() {
  "use strict";
  angular
    .module("app.services", ["app.config", "ngCookies", "app.layer"])
    //http请求封装
    .factory("$api", [
      "$http",
      "$defaultConfig",
      "$cookies",
      "$layer",
      function($http, $defaultConfig, $cookies, $layer) {
        // 默认参数
        var _httpDefaultOpts = {
          method: "POST", // GET/DELETE/HEAD/JSONP/POST/PUT
          url: "",
          data: {},
          params: {},
          cache: false, // boolean or Cache object
          before: function() {}, // ajax 执行开始 执行函数
          end: function() {}, // ajax 执行结束 执行函数
          error: function() {}, // ajax 执行失败 执行函数
          success: function(data) {}, // ajax 执行成功 执行函数,
          headers: {}, //请求头信息,
          hasNext: false //判断是否强制执行回调方法
          // xhrFields: {
          //     withCredentials: true
          // }
        };

        // http请求之前执行函数
        var _httpBefore = function(opts) {
          $layer.loading();
          // layer.load(1, {shade: [0.1,'#fff']});
          if (angular.isFunction(opts.before)) {
            opts.before();
          }
          if ($defaultConfig.header_token_code) {
            var header = {};
            // header[$defaultConfig.header_token_code] = $cookies.get($defaultConfig.session_code);
            var user = JSON.parse(localStorage.getItem("user"));
            if (user) {
              header[$defaultConfig.header_token_code] = user.token;
              opts.headers = header;
            }
          }
        };

        // http请求之后执行函数
        var _httpEnd = function(opts) {
          if (angular.isFunction(opts.end)) {
            opts.end();
          }
        };

        // http 请求执行过程封装
        var _httpMin = function(opts) {
          _httpBefore(opts);
          $http({
            method: opts.method,
            url: opts.url,
            data: opts.data,
            cache: opts.cache,
            params: opts.params,
            headers: opts.headers
          })
            .success(function(data, header, config, status) {
              //响应成功
              $layer.close();
              if (data.code === $defaultConfig.session_timeout_code) {
                var getCookies = $cookies.getAll(); //获取所有cooikes的值
                //循环删除
                angular.forEach(getCookies, function(v, k) {
                  $cookies.remove(k);
                });
                window.location.href =
                  $defaultConfig.current_uri + "/login.html";
                return;
              }
              // 请求成功回调函数
              // if(typeof data == 'object' && data.code === 0) {
              if (typeof data == "object") {
                if (angular.isFunction(opts.success)) {
                  if (data.code === 0 || data.code === 1) {
                    opts.success(data, header, config, status);
                  }
                  if (data.code === 2 || data.code === 3) {
                    layer.msg(data.msg, { time: 1000 });
                    setTimeout(function() {
                      window.location.href =
                        $defaultConfig.current_uri + "/login.html";
                    }, 1200);
                  }
                }
              } else {
                if (
                  data.msg == "invalid operation : (业务异常[%s])" &&
                  data.info
                ) {
                  // $layer.tip(data.info);
                  layer.msg(data.info, { time: 1000 });
                } else {
                  // $layer.tip(data.msg);
                  // layer.msg(data.msg,{time:1000})
                }
                if (opts.hasNext && angular.isFunction(opts.success)) {
                  opts.success(data, header, config, status);
                }
              }
              _httpEnd(opts);
            })
            .error(function(data, status, headers, config) {
              //响应失败
              $layer.close();
              $layer.tip("服务器异常,请重新尝试");
            });
        };

        // http请求，内含节流等控制
        var _http = function(opts) {
          opts = angular.extend({}, _httpDefaultOpts, opts);
          var result = _httpMin(opts);
        };

        // http请求参数处理
        var _setHttpDate = function(params) {
          var data = {
            url: $defaultConfig.app_uri + params[0],
            params: {},
            success: function() {}
          };
          switch (params.length) {
            case 2:
              if (angular.isFunction(params[1])) {
                data.success = params[1];
              } else if (angular.isNumber(params[1])) {
                data.hasNext = params[1];
              }
              break;
            case 3:
              if (angular.isObject(params[1])) {
                data.params = params[1];
              }
              if (angular.fromJson(params[1])) {
                data.params = params[1];
              } else if (angular.isFunction(params[1])) {
                data.success = params[1];
              }
              if (angular.isFunction(params[2])) {
                data.success = params[2];
              } else if (angular.isNumber(params[2])) {
                data.hasNext = params[2];
              }
              break;
            case 4:
              data.params = params[1];
              data.success = params[2];
              data.hasNext = params[3];
              break;
          }
          return data;
        };

        return {
          /**
           * http get请求
           * @param opts
           */
          get: function() {
            var option = _setHttpDate(arguments);
            _http({
              url: option.url,
              params: option.params,
              success: option.success,
              method: "GET",
              hasNext: option.hasNext
            });
          },
          /**
           * http post请求
           * @param opts
           */
          post: function() {
            var option = _setHttpDate(arguments);
            _http({
              url: option.url,
              data: option.params,
              success: option.success,
              hasNext: option.hasNext
            });
          },
          /**
           * http put请求
           * @param opts
           */
          put: function() {
            var option = _setHttpDate(arguments);
            _http({
              url: option.url,
              data: option.params,
              success: option.success,
              method: "PUT",
              hasNext: option.hasNext
            });
          },
          /**
           * http delete请求
           * @param opts
           */
          delete: function() {
            var option = _setHttpDate(arguments);
            _http({
              url: option.url,
              data: option.params,
              success: option.success,
              method: "DELETE",
              hasNext: option.hasNext
            });
          }
        };
      }
    ]);
})();
