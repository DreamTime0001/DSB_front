(function() {
  "use strict";
  angular.module("app.controllers").controller("personalOrderController", [
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
      //订单号查询
      vm.getMore = function(obj, event) {
        YQV5.trackSingleF2({
          //必须，指定悬浮位置的元素ID。
          YQ_ElementId: event.target.id,
          //可选，指定查询结果宽度，最小为260px，默认为470px。
          YQ_Width: 770,
          //可选，指定查询结果高度，最大为800px，默认为560px。
          YQ_Height: 560,
          //可选，指定运输商，默认为自动识别。
          YQ_Fc: "0",
          //可选，指定UI语言，默认根据浏览器自动识别。
          YQ_Lang: "zh-CN",
          //必须，指定要查询的单号。
          YQ_Num: obj.expressNo
        });
      };
      vm.user = JSON.parse(localStorage.getItem("user"));
      var toDay = new Date().format("yyyy-MM-dd");
      vm.localQuery = JSON.parse(localStorage.getItem("personalOrder"));
      //获取查询条件
      if (vm.localQuery) {
        vm.query = vm.localQuery;
      } else {
        vm.query = {
          pageNum: 1,
          pageSize: 10,
          ticketNo: "",
          expressNo: "",
          applyStartTime: toDay,
          applyEndTime: toDay
        };
      }
      //0-未生效 1-已生效 2-作废
      //获取列表
      vm.getPagedDataAsync = function() {
        $api.post("/order/findOrdersFromC", angular.toJson(vm.query), function(
          result
        ) {
          if (result.code === 0) {
            vm.list = result.data.list;
            vm.downloadList = result.data.list;
            vm.paymoney = result.data.paymoney / 100; //总支付金额
            vm.billsum = result.data.total;

            for (var i = 0; i < vm.list.length; i++) {
              if (vm.list[i].status == 0) {
                vm.list[i].statusText = "未生效";
              } else if (vm.list[i].status == 1) {
                vm.list[i].statusText = "已生效";
              } else if (vm.list[i].status == 3) {
                vm.list[i].statusText = "未支付";
              } else if (vm.list[i].status == 4) {
                vm.list[i].statusText = "已失效";
              }
              vm.list[i].prodAmount = vm.list[i].prodAmount / 100;
            }
            vm.query.pages = result.data.pages;
          } else {
            layer.msg(result.msg, { time: 1000 });
          }
        });
      };
      //日期初始化
      //   var toDay = new Date();
      //开始时间
      initDate("#applyStartTime", "yyyy-mm-dd", 2, function(date) {
        $("#applyEndTime").datetimepicker("setStartDate", date);
      });
      //结束时间
      initDate("#applyEndTime", "yyyy-mm-dd", 2, function(date) {
        $("#applyStartTime").datetimepicker("setEndDate", date);
      });
      //---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
      //查询
      vm.search = function() {
        if (vm.query.applyStartTime == "") {
          return layer.msg("请选择开始时间", { time: 1000 });
        }
        if (vm.query.applyEndTime == "") {
          return layer.msg("请选择结束时间", { time: 1000 });
        }
        vm.query.pageNum = 1;
        vm.getPagedDataAsync();
      };
      //重置
      vm.clear = function() {
        vm.query.ticketNo = null;
        vm.query.expressNo = null;
        vm.query.applyStartTime = toDay;
        vm.query.applyEndTime = toDay;
        vm.query.pageSize = 10;
        vm.query.source = "";
      };
    }
  ]);
})();
