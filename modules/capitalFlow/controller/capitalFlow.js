(function() {
  "use strict";
  angular.module("app.controllers").controller("capitalFlowController", [
    "$api",
    "$timeout",
    "$upload",
    "$http",
    "$state",
    "$scope",
    "$defaultConfig",
    "$layer",
    function(
      $api,
      $timeout,
      $upload,
      $http,
      $state,
      $scope,
      $defaultConfig,
      $layer
    ) {
      var vm = this;
      $timeout(function() {
        initMenu();
      }, 100);

      //---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
      vm.user = JSON.parse(localStorage.getItem("user"));
      //日期初始化
      var toDay = new Date();
      //开始时间
      initDate("#startDate", "yyyy-mm-dd", 2, function(date) {
        $("#endDate").datetimepicker("setStartDate", date);
      });
      //结束时间
      initDate("#endDate", "yyyy-mm-dd", 2, function(date) {
        $("#startDate").datetimepicker("setEndDate", date);
      });

      vm.query = {
        t: "",
        pageNum: 1,
        pageSize: 10,
        createMinDate: "",
        createMaxDate: ""
      };
      vm.getPagedDataAsync = function() {
        $api.post("/account/ssoService", function(result) {
          if (result.code == 0) {
            // 加载列表
            vm.query.t = result.data.ticket;
            $api.post(
              "/account/paymentBill",
              angular.toJson(vm.query),
              function(res) {
                if (res.code === 0) {
                  vm.list = res.data.records;
                  vm.query.pages = res.data.pages;
                  for (var i in vm.list) {
                    if (vm.list[i].billType == "10001") {
                      vm.list[i].billTypeTxt = "支付保费";
                    } else {
                      vm.list[i].billTypeTxt = "账户充值";
                    }
                    switch (vm.list[i].billStatus) {
                      case 0:
                        vm.list[i].billStatusTxt = "未付款";
                        break;
                      case 1:
                        vm.list[i].billStatusTxt = "申请成功";
                        break;
                      case 2:
                        vm.list[i].billStatusTxt = "转账过程中";
                        break;
                      case 97:
                        vm.list[i].billStatusTxt = "过期未支付";
                        break;
                      case 98:
                        vm.list[i].billStatusTxt = "交易取消";
                        break;
                      case 99:
                        vm.list[i].billStatusTxt = "交易失败";
                        break;
                      case 100:
                        vm.list[i].billStatusTxt = "交易成功";
                        break;
                      case 1000:
                        vm.list[i].billStatusTxt = "交易关闭";
                        break;
                    }
                  }
                }
              }
            );
          } else {
            layer.msg(result.data.message, { time: 1000 });
          }
        });
      };

      // 查询
      vm.search = function() {
        vm.query.pageNum = 1;
        vm.getPagedDataAsync();
      };
      //清除
      vm.clear = function() {
        $("#startDate").val("");
        $("#endDate").val("");
      };
      vm.toExl = function() {
        if (vm.query.createMinDate == "") {
          return layer.msg("请选择开始时间", { time: 1000 });
        }
        if (vm.query.createMaxDate == "") {
          return layer.msg("请选择结束时间", { time: 1000 });
        }
        var header = {};
        header[$defaultConfig.header_token_code] = vm.user.token;
        $layer.loading();
        $http
          .post(
            $defaultConfig.app_uri + "/account/exportExcel",
            angular.toJson(vm.query),
            { responseType: "arraybuffer", headers: header }
          )
          .then(
            function(response) {
              var blob = new Blob([response.data], {
                type: "application/vnd.ms-excel"
              });
              var fileName = "资金流水" + new Date().toISOString().replace(/[\-\:\.]/g, "") + ".xls";
              saveAs(blob, decodeURI(fileName));
              $layer.close();
            },
            function() {
              return layer.msg("服务器异常,请重新尝试", { time: 1000 });
            }
          );
      };

      //导出Excel
      // vm.downloadExcel = function () {
      //     if (vm.list && vm.list.length > 0) {
      //         $layer.loading();
      //         $(".tableInfo").table2excel({
      //             exclude: ".noExl",
      //             name: "Excel Document Name",
      //             filename: "资金流水" + new Date().toISOString().replace(/[\-\:\.]/g, "") + '.xls',
      //             fileext: ".xls",
      //             exclude_img: true,
      //             exclude_links: true,
      //             exclude_inputs: true
      //         });
      //         $timeout(function () {
      //             $layer.close();
      //         }, 1500)
      //     } else {
      //         layer.msg('请先查询出结果', {time: 1000});
      //     }
      // };
    }
  ]);
})();
