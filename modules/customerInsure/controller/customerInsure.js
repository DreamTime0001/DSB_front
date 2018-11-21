(function() {
  "use strict";
  angular.module("app.controllers").controller("customerInsureController", [
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
      vm.user = JSON.parse(localStorage.getItem("user"));
      $timeout(function() {
        initMenu();
      }, 100);
      vm.popToPay = false;
      vm.popToRecharge = false;
      vm.payInfo = {
        ticketNo: "",
        source: "",
        productName: "",
        discountAmount: "",
        balance: ""
      };
      var toDay = new Date().format("yyyy-MM-dd");
      //查询条件
      vm.localQuery = JSON.parse(localStorage.getItem("customerInsure"));
      if (vm.localQuery) {
        vm.query = vm.localQuery;
      } else {
        vm.query = {
          ticketNo: '',
          expressNo: '',
          clientName: "",
          telephone: "",
          status: null,
          applyStartTime: toDay,
          applyEndTime: toDay,
          source: "",
          pageNum: 1,
          pageSize: 10,
          url: "customerInsure"
        };
        if (vm.user) {
          if (vm.user.source) {
            vm.query.source = vm.user.source;
          }
        }
      }
      //excel认证数据
      vm.excelData = {
        productIdList: [],
        source: ""
      };
      //获取列表
      //0-未生效 1-已生效
      vm.getPagedDataAsync = function() {
        $api.post(
          "/order/ordersByCondition",
          angular.toJson(vm.query),
          function(result) {
            if (result.code === 0) {
              vm.downloadList = result.data.list;
              vm.billsum = result.data.total;
              vm.list = [];
              vm.list = result.data.list.map(function(item) {
                item.prodAmount = item.prodAmount / 100;
                if (item.status == 0) {
                  item.statusText = "未生效";
                } else if (item.status == 1) {
                  item.statusText = "已生效";
                } else if (item.status == 3) {
                  item.statusText = "未支付";
                } else if (item.status == 4) {
                  item.statusText = "失效";
                }
                return item;
              });
              if (vm.list.length > 0) {
                vm.paymoney = vm.list[0].paymoney / 100; //总支付金额
              }
              vm.query.pages = result.data.pages;
            } else {
              layer.msg(result.msg, { time: 1000 });
            }
          }
        );
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
      //判断是否可以批量投保
      if (vm.user) {
        if (vm.user.source) {
          $api.post(
            "/order/batch",
            angular.toJson({ source: vm.user.source }),
            function(result) {
              if (result.code == 0) {
                vm.isBatch = result.data.isBatch;
              }
            }
          );
        }
      }
      //---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
      //查询
      vm.search = function() {
        localStorage.setItem("customerInsure", JSON.stringify(vm.query));
        vm.query.pageNum = 1;
        vm.getPagedDataAsync();
      };
      //重置
      vm.clear = function() {
        vm.query.ticketNo = "";
        vm.query.channelOrderNo = "";
        vm.query.clientName = "";
        vm.query.telephone = "";
        vm.query.status = null;
        vm.query.applyStartTime = toDay;
        vm.query.applyEndTime = toDay;
        vm.query.source = vm.user.source;
      };
      //附件上传-选择excel
      vm.readExcel = function(obj) {
        $layer.loading();
        var files = obj;
        vm.file = files[0];
        vm.fileName = files[0].name;
        if (vm.fileName.indexOf("+") > -1 || vm.fileName.indexOf(" ") > -1) {
          $layer.close();
          return layer.msg("文件名不能含有空格或者+", { time: 1000 });
        }
        var fileReader = new FileReader();
        fileReader.onload = function(ev) {
          try {
            var data = ev.target.result,
              workbook = XLSX.read(data, {
                type: "binary"
              }), // 以二进制流方式读取得到整份excel表格对象
              persons = []; // 存储获取到的数据
          } catch (e) {
            return layer.msg("文件类型不正确", { time: 1000 });
          }
          // 表格的表格范围，可用于判断表头是否数量是否正确
          var fromTo = "";
          // 遍历每张表读取
          for (var sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              fromTo = workbook.Sheets[sheet]["!ref"];
              // console.log(fromTo);
              persons = persons.concat(
                XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
              );
              break; // 如果只取第一张表，就取消注释这行
            }
          }
          var str = "";
          vm.excelData.source = persons[0]["商户标识"];
          for (var key in persons[0]) {
            if (key.indexOf("_") != -1) {
              var firstStr = key.indexOf("_");
              var id = key.substring(0, firstStr);
              var name = key.match(/_(\S*)/)[1];
              vm.excelData.productIdList.push(id);
            }
          }
          if (vm.user.source == vm.excelData.source) {
            $api.post(
              "/order/productIdListBySource",
              angular.toJson(vm.excelData),
              function(result) {
                if (result.code === 0) {
                  $layer.close();
                  vm.canUpload = true;
                  vm.excelData.productIdList = [];
                  return layer.msg(result.msg, { time: 1000 });
                } else {
                  $layer.close();
                  vm.canUpload = false;
                  vm.file = "";
                  vm.excelData.productIdList = [];
                  return layer.msg(result.msg, { time: 1000 });
                }
              }
            );
          } else {
            $layer.close();
            layer.msg("商户标识不一致,请重新上传", { time: 1000 });
            $scope.$apply(function() {
              vm.fileName = "";
              vm.file = "";
              vm.excelData.productIdList = [];
            });
          }
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
        // body...
      };
      //附件上传-提交
      vm.uploadExcel = function() {
        $layer.loading();
        $upload
          .upload({
            url: $defaultConfig.app_uri + "/order/uploadOrderExcel",
            headers: {
              token: vm.user.token
            },
            file: vm.file
          })
          .progress(function(evt) {
            //上传进度
          })
          .success(function(data, status, headers, config) {
            if (data.code == 0) {
              $layer.close();
              vm.fileName = "";
              vm.file = "";
              vm.excelData.productIdList = [];
              if (data.data.message == "error") {
                vm.canUpload = false;
                layer.alert(data.data.sb, {
                  area: ["380px", "280px"]
                });
              } else if (data.data.message == "payError") {
                vm.canUpload = false;
                vm.popAnnex = false;
                layer.alert(data.data.sb, {
                  area: ["380px", "280px"],
                  yes: function() {
                    layer.closeAll();
                    vm.query.pageNum = 1;
                    vm.getPagedDataAsync();
                  },
                  end: function() {
                    layer.closeAll();
                    vm.query.pageNum = 1;
                    vm.getPagedDataAsync();
                  }
                });
              } else {
                vm.popAnnex = false;
                vm.canUpload = false;
                layer.msg(data.msg, { time: 1000 });
                $timeout(function() {
                  vm.query.pageNum = 1;
                  vm.getPagedDataAsync();
                }, 1200);
              }
            } else {
              vm.fileName = "";
              vm.file = "";
              vm.excelData.productIdList = [];
              layer.msg(data.msg, { time: 1000 });
            }
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
      //导出Excel
      vm.downloadExcel = function() {
        if (vm.list && vm.list.length > 0) {
          $layer.loading();
          $("#tableInfo").table2excel({
            exclude: ".noExl",
            name: "Excel Document Name",
            filename:
              "我的保单" +
              new Date().toISOString().replace(/[\-\:\.]/g, "") +
              ".xls",
            fileext: ".xls",
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true
          });
          $timeout(function() {
            $layer.close();
          }, 1500);
        } else {
          layer.msg("请先查询出结果", { time: 1000 });
        }
      };
      // 下载Excel模板
      vm.downloadExcelList = function() {
        $api.get(
          "/company/getCompanyIdListAndApplyCompensation/" + vm.user.source,
          function(result) {
            if (result.code === 0) {
              $layer.close();
              vm.oneList = result.data.list;
              vm.twoList = result.data.defaultValueList;
              if (vm.oneList.length > 0) {
                vm.oneList.unshift("商户标识");
                vm.twoList.unshift(vm.user.source);
                $timeout(function() {
                  $(".tableInfo02").table2excel({
                    exclude: ".noExl",
                    name: "Excel Document Name",
                    filename:
                      "投保信息模板" +
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
      //充值框显示
      vm.popPayShow = function(obj) {
        vm.popToPay = true;
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
                  vm.payInfo.balance =
                    (res.data.info.subAccountInfos[0].subAccountBalance * 100 +
                      res.data.info.subAccountInfos[0]
                        .subAccountWithdrawBalance *
                        100) /
                    100; //余额
                }
              );
            }
          }
        );
        vm.payInfo.productName = obj.productName;
        vm.payInfo.source = vm.user.source;
        vm.payInfo.ticketNo = obj.ticketNo;
        vm.payInfo.discountAmount = obj.discountAmount;
      };
      //确认支付
      vm.confirmToPay = function() {
        $api.get(
          "/order/updateOrderById/" +
            vm.payInfo.ticketNo +
            "/" +
            vm.payInfo.source,
          function(result) {
            if (result.code == 0) {
              vm.popToPay = false;
              layer.msg(result.msg, { time: 1000 });
              $timeout(function() {
                vm.getPagedDataAsync();
              }, 1200);
            } else {
              vm.popToPay = false;
              if (result.msg == "可支付余额不足") {
                vm.popToRecharge = true;
              } else {
                layer.msg(result.msg, { time: 1000 });
              }
            }
          }
        );
      };
      //去充值
      vm.toRecharge = function() {
        vm.popToRecharge = false;
        $state.go("recharge");
      };
      //发起理赔
      vm.getClaimInfo = function(obj) {
        localStorage.removeItem("infor"); //先清除再获取
        vm.infor = {
          id: obj.id,
          applyProductId: obj.productId,
          expressNo: obj.expressNo,
          ticketNo: obj.ticketNo,
          applyProductCombinationId: obj.applyProductCombinationId,
          applyProductName: obj.productName,
          name: obj.companyName,
          parentProductId: obj.parentProductId
        };
        localStorage.setItem("infor", JSON.stringify(vm.infor));
        $state.go("claimOrderAdd");
      };
    }
  ]);
})();
