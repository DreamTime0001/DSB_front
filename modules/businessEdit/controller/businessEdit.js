(function() {
  "use strict";
  angular.module("app.controllers").controller("businessEditController", [
    "$api",
    "$timeout",
    "$upload",
    "$http",
    "$state",
    "$scope",
    "$defaultConfig",
    "$layer",
    "$stateParams",
    "$cookies",
    "$location",
    "$anchorScroll",
    function(
      $api,
      $timeout,
      $upload,
      $http,
      $state,
      $scope,
      $defaultConfig,
      $layer,
      $stateParams,
      $cookies,
      $location,
      $anchorScroll
    ) {
      var vm = this;
      vm.user = JSON.parse(localStorage.getItem("user"));
      vm.factorShow = false; //动态因子需调价弹框
      vm.importId = ""; //进口id
      vm.exportId = ""; //出口id
      vm.importList = [];
      vm.exportList = [];
      vm.completeCompany = {
        isImport: [],
        isExport: [],
        company: {
          id: "",
          source: "",
          companyName: "",
          contactName: "",
          contactPhone: "",
          email: "",
          hearDsb: 0,
          businessRefer: "",
          eChain: "",
          businessName: "",
          userId: "",
          isBatch: 0
        },
        isAddUser: {
          username: ""
          // password: ''
        }
      };
      if (vm.user) {
        if (vm.user.userId) {
          vm.completeCompany.company.userId = vm.user.userId;
        }
      }
      //得知豆沙包来源
      vm.hearDsbList = [
        {
          id: 0,
          name: "无"
        },
        {
          id: 1,
          name: "豆沙包商务人员推荐"
        },
        {
          id: 2,
          name: "第三方推荐"
        }
      ];
      //海外电商
      vm.companyTypeList = [
        {
          id: 0,
          name: "海外电商"
        },
        {
          id: 1,
          name: "跨境电商"
        },

        {
          id: 2,
          name: "转运公司"
        },

        {
          id: 3,
          name: "清关公司"
        },

        {
          id: 4,
          name: "物流公司"
        },

        {
          id: 5,
          name: "卖家"
        },

        {
          id: 6,
          name: "供应链服务"
        },

        {
          id: 7,
          name: "保税区"
        },

        {
          id: 8,
          name: "ERP、物流系统服务平台"
        },

        {
          id: 9,
          name: "三方支付"
        },
        {
          id: 10,
          name: "其他"
        }
      ];
      vm.regular = {
        phoneReg: /^[1][3,4,5,7,8][0-9]{9}$/,
        sourceReg: /^[A-Z]{6}$/g,
        emailReg: new RegExp(
          /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        ),
        password: /[\u4E00-\u9FA5]/g
      };
      vm.addProductObj = {
        productId: "",
        source: ""
      };
      vm.factorObj = {
        insureQuantityStableFactor: "", //F1
        sellerIndemnityFactor: "", //F2
        sellerLevelFactor: "", //F3
        sellerCreditLevelFactor: "", //F4
        rePurchaseMonthsFactor: "", //F5
        platformIndemnityFactor: "", //F6
        dsbIndemnityFactor: "", //F7
        totalFactor: ""
      };
      vm.username = "";
      vm.recorded = {
        chargeAmount: "",
        t: "",
        username: ""
      };
      //---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
      //数字四舍五入（保留n位小数）
      vm.getFloat = function(number, n) {
        n = n ? parseInt(n) : 0;
        if (n <= 0) return Math.round(number);
        number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n);
        return number;
      };

      //获得焦点
      vm.getFocus = function(id) {
        $location.hash(id);
        $anchorScroll();
        $("#" + id).focus();
      };

      //计算字符长度
      function sumChartCode(str) {
        if (str) {
          return str.replace(/[\u0391-\uFFE5]/g, "aa").length; //先把中文替换成两个字节的英文，在计算长度
        } else {
          return 0;
        }
      }

      /**
       * 加入商户类型id
       * @param type    0-进口 1-出口
       *@param id       所选中的id
       */
      vm.pushId = function(type, id) {
        for (var i = 0; i < vm.companyTypeList.length; i++) {
          if (id == vm.companyTypeList[i].id) {
            vm.temp = {
              id: vm.companyTypeList[i].id,
              name: vm.companyTypeList[i].name
            };
          }
        }
        if (type === 0) {
          if (vm.importList.length == 0) {
            vm.importList.push(vm.temp);
          } else {
            vm.importHasId = false;
            for (i in vm.importList) {
              if (vm.temp.id === vm.importList[i].id) {
                return (vm.importHasId = false);
              } else {
                vm.importHasId = true;
              }
            }
            if (vm.importHasId) {
              vm.importList.push(vm.temp);
            }
          }
        } else if (type === 1) {
          if (vm.exportList.length == 0) {
            vm.exportList.push(vm.temp);
          } else {
            vm.exportHasId = false;
            for (i in vm.exportList) {
              if (vm.temp.id === vm.exportList[i].id) {
                return (vm.exportHasId = false);
              } else {
                vm.exportHasId = true;
              }
            }
            if (vm.exportHasId) {
              vm.exportList.push(vm.temp);
            }
          }
        }
      };
      /**
       * 删除用户类型
       * @param type    0-进口 1-出口
       *@param index     数组下标
       */
      vm.deleteCompany = function(type, index) {
        if (type == 0) {
          vm.importList.splice(index, 1);
        } else if (type == 1) {
          vm.exportList.splice(index, 1);
        }
      };
      //绑定豆沙包商务
      $api.get("/company/getBusinessNameList/7", function(result) {
        if (result.code == 0) {
          vm.roleList = result.data;
        }
      });
      //获得商户信息
      $api.get("/company/getCompanyDetail/" + $stateParams.id, function(
        result
      ) {
        if (result.code === 0) {
          vm.completeCompany = angular.extend(
            {},
            vm.completeCompany,
            result.data
          );
          vm.completeCompany.company.businessRefer === "null"
            ? (vm.completeCompany.company.businessRefer = "")
            : null;
          vm.username = result.data.isAddUser.username;
          vm.list = result.data.productList;

          for (var i = 0; i < vm.list.length; i++) {
            if (
              vm.list[i].dynamicFactor < 0.8 ||
              vm.list[i].dynamicFactor > 2
            ) {
              vm.list[i].isNormal = false;
            } else {
              vm.list[i].isNormal = true;
            }
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
          for (var i = 0; i < vm.companyTypeList.length; i++) {
            //获取选中的出口标签
            for (var j = 0; j < vm.completeCompany.isImport.length; j++) {
              if (vm.companyTypeList[i].id == vm.completeCompany.isImport[j]) {
                vm.importList.push({
                  id: vm.companyTypeList[i].id,
                  name: vm.companyTypeList[i].name
                });
              }
            }
            //获取选中的进口标签
            for (var j = 0; j < vm.completeCompany.isExport.length; j++) {
              if (vm.companyTypeList[i].id == vm.completeCompany.isExport[j]) {
                vm.exportList.push({
                  id: vm.companyTypeList[i].id,
                  name: vm.companyTypeList[i].name
                });
              }
            }
          }
          $api.post(
            "/company/getBalance",
            angular.toJson({ username: vm.username }),
            function(res) {
              if (res.code == 0) {
                vm.ticket = res.data.ticket;
                $api.post(
                  "/account/info",
                  angular.toJson({ t: vm.ticket }),
                  function(res) {
                    if (res.code == 0) {
                      vm.subAccountBalance =
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
              }
            }
          );
        }
      });
      // 提交
      vm.submit = function() {
        if (vm.completeCompany.company.companyName == null) {
          return layer.msg("商户名称不能为空！", { time: 1000 });
        }
        if (vm.completeCompany.company.contactName == null) {
          return layer.msg("联系人不能为空！", { time: 1000 });
        }
        if (vm.completeCompany.company.contactPhone == null) {
          return layer.msg("联系电话不能为空！", { time: 1000 });
        }
        if (vm.completeCompany.company.email == "") {
          return layer.msg("邮箱不能为空！", { time: 1000 });
        } else if (
          !vm.regular.emailReg.test(vm.completeCompany.company.email)
        ) {
          return layer.msg("请输入正确的邮箱！", { time: 1000 });
        }
        if (vm.importList.length == 0 && vm.exportList.length == 0) {
          return layer.msg("请选择进口方式或出口方式！", { time: 1000 });
        }
        if (vm.completeCompany.company.hearDsb == 1) {
          if (vm.completeCompany.company.businessRefer == null) {
            return layer.msg("请填写豆沙包商务对接人！", { time: 1000 });
          }
        }
        if (vm.completeCompany.company.hearDsb == 2) {
          if (vm.completeCompany.company.businessRefer == null) {
            return layer.msg("请填写第三方来源 ！", { time: 1000 });
          }
        }
        if (vm.completeCompany.company.businessName == null) {
          return layer.msg("请绑定绑定豆沙包商务 ！", { time: 1000 });
        }
        if (vm.completeCompany.company.eChain == null) {
          return layer.msg("eChain地址不能为空 ！", { time: 1000 });
        }
        vm.completeCompany.isImport = [];
        vm.completeCompany.isExport = [];
        for (var i = 0; i < vm.importList.length; i++) {
          vm.completeCompany.isImport.push(vm.importList[i].id);
        }
        for (var i = 0; i < vm.exportList.length; i++) {
          vm.completeCompany.isExport.push(vm.exportList[i].id);
        }
        $api.post(
          "/company/companyProductOperate",
          angular.toJson(vm.completeCompany),
          function(result) {
            if (result.code === 0) {
              layer.msg(result.msg, { time: 1000 });
              $timeout(function() {
                $state.go("businessManage");
              }, 1200);
            } else if (result.code === 1) {
              return layer.msg(result.msg, { time: 1000 });
            }
          }
        );
      };
      // 新增产品提交
      vm.addNewProSubmit = function() {
        vm.addProductObj.source = vm.completeCompany.company.source;
        $api.post(
          "/company/bindCompanyProduct",
          angular.toJson(vm.addProductObj),
          function(result) {
            if (result.code == 0) {
              vm.addIdPop = false;
              vm.addProductObj.productId = null;
              layer.msg(result.msg, { time: 1000 });
              vm.list = result.data;
              for (var i = 0; i < vm.list.length; i++) {
                if (
                  vm.list[i].dynamicFactor < 0.8 ||
                  vm.list[i].dynamicFactor > 2
                ) {
                  vm.list[i].isNormal = false;
                } else {
                  vm.list[i].isNormal = true;
                }
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
            } else {
              return layer.msg(result.msg, { time: 1000 });
            }
          }
        );
      };
      //删除
      vm.deleteProduct = function(id, index) {
        layer.confirm(
          "确定要删除吗？",
          {
            btn: ["确定", "取消"] //按钮
          },
          function() {
            layer.closeAll();
            $api.post("/product/del_product/" + id, function(result) {
              if (result.code == 0) {
                vm.list.splice(index, 1);
                layer.msg(result.msg, {
                  time: 1000
                });
              }
            });
          }
        );
      };
      //显示需调价输入框
      vm.showFactor = function(id) {
        vm.factorShow = true;
        $api.post(
          "/price/queryDynamicFactor",
          angular.toJson({
            source: vm.completeCompany.company.source,
            productId: id
          }),
          function(result) {
            if (result.code == 0) {
              vm.factorObj = result.data;
              vm.getProduct();
            }
          }
        );
      };
      //因子移开检测
      vm.factorMover = function(val) {
        if (val == "") {
          return layer.msg("不能为空", { time: 1000 });
        }
        vm.getProduct();
      };
      //乘积
      vm.getProduct = function() {
        var num =
          vm.factorObj.insureQuantityStableFactor *
          vm.factorObj.sellerIndemnityFactor *
          vm.factorObj.sellerLevelFactor *
          vm.factorObj.sellerCreditLevelFactor *
          vm.factorObj.rePurchaseMonthsFactor *
          vm.factorObj.platformIndemnityFactor *
          vm.factorObj.dsbIndemnityFactor;
        vm.factorObj.totalFactor = vm.getFloat(num, 2);
      };
      //提交系数调整
      vm.apply = function() {
        if (vm.factorObj.insureQuantityStableFactor == "") {
          return layer.msg("F1不能为空", { time: 1000 });
        }
        if (vm.factorObj.sellerIndemnityFactor == "") {
          return layer.msg("F2不能为空", { time: 1000 });
        }
        if (vm.factorObj.sellerLevelFactor == "") {
          return layer.msg("F3不能为空", { time: 1000 });
        }
        if (vm.factorObj.sellerCreditLevelFactor == "") {
          return layer.msg("F4不能为空", { time: 1000 });
        }
        if (vm.factorObj.rePurchaseMonthsFactor == "") {
          return layer.msg("F5不能为空", { time: 1000 });
        }
        if (vm.factorObj.platformIndemnityFactor == "") {
          return layer.msg("F6不能为空", { time: 1000 });
        }
        if (vm.factorObj.dsbIndemnityFactor == "") {
          return layer.msg("F7不能为空", { time: 1000 });
        }

        $api.post(
          "/price/updateDynamicFactor",
          angular.toJson(vm.factorObj),
          function(result) {
            if (result.code == 0) {
              layer.msg(result.msg, { time: 1000 });
              $api.get("/company/getCompanyDetail/" + $stateParams.id, function(
                result
              ) {
                if (result.code === 0) {
                  vm.list = result.data.productList;
                  for (var i = 0; i < vm.list.length; i++) {
                    if (
                      vm.list[i].dynamicFactor < 0.8 ||
                      vm.list[i].dynamicFactor > 2
                    ) {
                      vm.list[i].isNormal = false;
                    } else {
                      vm.list[i].isNormal = true;
                    }
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
                }
              });
              vm.factorShow = false;
            }
          }
        );
      };
      //编辑产品
      vm.editProduct = function(id) {
        // console.log(vm.completeCompany.company.source);
        localStorage.setItem("backId", $stateParams.id);
        $state.go("productManageEdit", {
          id: id,
          source: vm.completeCompany.company.source
        });
      };
      //手工入账
      vm.chargeAmount = function() {
        if (vm.recorded.chargeAmount == "") {
          return layer.msg("请输入金额", { time: 1000 });
        }
        vm.recorded.t = vm.ticket;
        vm.recorded.username = vm.user.username;
        $api.post("/account/recorded", angular.toJson(vm.recorded), function(
          result
        ) {
          vm.recorded.chargeAmount = "";
          layer.msg(result.msg, { time: 1000 });
        });
      };
    }
  ]);
})();
