(function() {
  "use strict";
  angular.module("app.controllers").controller("businessOrderController", [
    "$ocLazyLoad",
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
      $ocLazyLoad,
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
      // $ocLazyLoad.load('modules/businessOrder/controller/businessOrder.js');
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
      vm.popToPay = false; //去支付
      vm.payInfo = {
        ticketNo: "",
        source: "",
        productName: "",
        discountAmount: "",
        balance: ""
      };
      // 存储商户信息
      vm.companyNameArr = [];
      //获取所有商户信息
      if (vm.user) {
        if (vm.user.token) {
          $http({
            method: "POST",
            url: $defaultConfig.app_uri + "/company/getCompanyListName",
            headers: { token: vm.user.token }
          })
            .success(function(result) {
              vm.businessArry = result.data;
              for (var i in vm.businessArry) {
                vm.companyNameArr.push(vm.businessArry[i].companyName);
              }
              var autoComplete = new AutoComplete(
                "input",
                "auto",
                vm.companyNameArr
              );
              document.getElementById("input").onkeyup = function(event) {
                autoComplete.start(event);
              };
            })
            .error(function(result) {});
        }
      }
      vm.localQuery = JSON.parse(localStorage.getItem("businessOrder"));
      //获取查询条件
      if (vm.localQuery) {
        vm.query = vm.localQuery;
      } else {
        vm.query = {
          ticketNo: '',
          expressNo: '',
          companyName: "",
          source: "",
          productType: null,
          applyStartTime: toDay,
          applyEndTime: toDay,
          clientName: "",
          pageNum: 1,
          pageSize: 10,
          userId: "",
          url: "businessOrder",
          status: ""
        };
        if (vm.user) {
          if (vm.user.userId) {
            vm.query.userId = vm.user.userId;
          }
        }
      }
      //excel认证数据
      vm.excelData = {
        productIdList: [],
        source: ""
      };
      //产品类型数据
      vm.productTypeList = [
        {
          id: 0,
          name: "费率"
        },
        {
          id: 1,
          name: "定价"
        },
        {
          id: 2,
          name: "份数"
        },
        {
          id: 3,
          name: "组合"
        }
      ];
      //0-未生效 1-已生效 2-作废
      //获取列表
      vm.getPagedDataAsync = function() {
        $api.post(
          "/order/ordersByCondition",
          angular.toJson(vm.query),
          function(result) {
            if (result.code === 0) {
              vm.list = result.data.list;
              vm.downloadList = result.data.list;
              if (vm.list.length > 0) {
                vm.paymoney = vm.list[0].paymoney / 100; //总支付金额
              }
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

      //---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
      //计算字符长度
      function sumChartCode(str) {
        if (str) {
          return str.replace(/[\u0391-\uFFE5]/g, "aa").length; //先把中文替换成两个字节的英文，在计算长度
        } else {
          return 0;
        }
      }

      //查询
      vm.search = function() {
        vm.query.companyName = $("#input").val();
        if (vm.query.companyName == "") {
          vm.query.source = "";
        } else if (!in_arr(vm.query.companyName, vm.companyNameArr)) {
          vm.list = [];
          return;
        } else {
          for (var i in vm.businessArry) {
            if (vm.query.companyName === vm.businessArry[i].companyName) {
              vm.query.source = vm.businessArry[i].source;
            }
          }
        }
        if (vm.query.ticketNo == "" && vm.query.expressNo == "" && vm.query.source == '') {
          if (vm.query.applyStartTime == "") {
            return layer.msg("请选择开始时间", { time: 1000 });
          }
          if (vm.query.applyEndTime == "") {
            return layer.msg("请选择结束时间", { time: 1000 });
          }
        }
        
        localStorage.setItem("businessOrder", JSON.stringify(vm.query));
        vm.query.pageNum = 1;
        vm.getPagedDataAsync();
      };
      //重置
      vm.clear = function() {
        vm.query.ticketNo = '';
        vm.query.expressNo = '';
        vm.query.companyName = "";
        vm.query.productType = null;
        vm.query.applyStartTime = toDay;
        vm.query.applyEndTime = toDay;
        vm.query.clientName = "";
        vm.query.pageNum = vm.currentPage;
        vm.query.pageSize = 10;
        vm.query.source = "";
      };
      // 下载Excel模板
      vm.downloadExcelList = function() {
        if (vm.isSource) {
          $api.get(
            "/company/getCompanyIdListAndApplyCompensation/" + vm.source,
            function(result) {
              if (result.code === 0) {
                vm.oneList = result.data.list;
                vm.twoList = result.data.defaultValueList;
                if (vm.oneList.length > 0) {
                  $layer.loading();
                  vm.oneList.unshift("商户标识");
                  vm.twoList.unshift(vm.source);
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
                  $timeout(function() {
                    $layer.close();
                  }, 1500);
                }
              } else {
                layer.msg(result.msg, { time: 1500 });
              }
            }
          );
        } else {
          layer.msg("请输入正确的商户标识", { time: 1000 });
        }
      };
      //获取商户标识
      vm.getSource = function(source) {
        if (sumChartCode(source) == 6) {
          $api.get("/order/findCompanyBySource/" + source, function(result) {
            if (result.code == 0) {
              if (result.data.company) {
                vm.companyName = result.data.company.companyName;
                vm.isSource = true;
              } else {
                vm.companyName = "";
                vm.isSource = false;
                layer.msg("没有查到相关商户,请重新输入", { time: 1000 });
              }
            } else {
              layer.msg(result.msg, { time: 1000 });
            }
          });
        }
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
          $api.post(
            "/order/productIdListBySource",
            angular.toJson(vm.excelData),
            function(result) {
              $layer.close();
              if (result.code == 0) {
                vm.canUpload = true;
                vm.excelData.productIdList = [];
                return layer.msg(result.msg, { time: 1000 });
              } else {
                vm.canUpload = false;
                vm.file = "";
                vm.excelData.productIdList = [];
                return layer.msg(result.msg, { time: 1000 });
              }
            }
          );
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
              "商户订单" +
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
      vm.showToPay = function(obj) {
        vm.popToPay = true;
        $api.post(
          "/company/sourceUserName",
          angular.toJson({ source: obj.source }),
          function(data) {
            if (data.code == 0) {
              vm.username = data.data;
            } else {
              layer.msg(data.msg, { time: 1000 });
            }
            $api.post(
              "/company/getBalance",
              angular.toJson({ username: vm.username }),
              function(result) {
                if (result.code == 0) {
                  vm.ticket = result.data.ticket;
                  $api.post(
                    "/account/info",
                    angular.toJson({ t: vm.ticket }),
                    function(res) {
                      if (res.code == 0) {
                        vm.payInfo.balance =
                          (res.data.info.subAccountInfos[0].subAccountBalance *
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
                } else {
                  layer.msg(result.msg, { time: 1000 });
                }
              }
            );
          }
        );

        vm.payInfo.ticketNo = obj.ticketNo;
        vm.payInfo.productName = obj.productName;
        vm.payInfo.discountAmount = obj.discountAmount / 100;
        vm.payInfo.source = obj.source;
        vm.payInfo.adjustPrice = obj.adjustPrice;
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
              layer.msg(result.msg, { time: 1000 });
            }
          }
        );
      };
      vm.toDetail = function(o) {
        $state.go("businessOrderDetails", { id: o.id, productId: o.productId });
      };
    }
  ]);
})();
