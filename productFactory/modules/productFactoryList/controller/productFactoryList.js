(function() {
  "use strict";
  angular.module("app.controllers").controller("productFactoryListController", [
    "$api",
    "$timeout",
    "$upload",
    "$http",
    "$state",
    "$scope",
    "$defaultConfig",
    "$layer",
    "$cookies",
    "$stateParams",
    "$location",
    function(
      $api,
      $timeout,
      $upload,
      $http,
      $state,
      $scope,
      $defaultConfig,
      $layer,
      $cookies,
      $stateParams,
      $location
    ) {
      var vm = this;
      vm.isSuspend = false;
      vm.queryList = [];
      vm.popProductData = {
        configV5Id: "",
        configV6Id: ""
      };
      //获取之前选择的内容
      vm.ids = JSON.parse(localStorage.getItem("ids"));
      vm.query = {
        pageNum: 1,
        pageSize: 20,
        ids: null,
        configV1Id: "",
        configV2Id: "",
        configV3Id: "",
        pages: 1,
        source: "",
        recommendId: 0
      };
      vm.user = JSON.parse(localStorage.getItem("user"));
      // console.log('shop.shopList===',$scope.$parent.$parent.shop.shopList);
      //点击显示购物车弹框
      vm.shopListS = function() {
        $scope.$parent.$parent.shopListShow = true;
      };
      //点击关闭购物车弹框
      vm.shopListH = function() {
        $scope.$parent.$parent.shopListShow = false;
      };
      //已登录
      if (vm.user) {
        if (vm.user.source) {
          vm.query.source = vm.user.source;
          $api.post("/tbcard/list", function(result) {
            if (result.code == 0) {
              $scope.$parent.$parent.shop.shopList = result.data.shopList;
              if ($scope.$parent.$parent.shop.shopList.length > 0) {
                for (
                  var i = 0;
                  i < $scope.$parent.$parent.shop.shopList.length;
                  i++
                ) {
                  $scope.$parent.$parent.shop.shopList[i].priceSum = (
                    $scope.$parent.$parent.shop.shopList[i].price *
                    $scope.$parent.$parent.shop.shopList[i].num
                  ).toFixed(2);
                }
                $scope.$parent.$parent.sumPrice = $scope.getSum().toFixed(2);
              }
            }
          });
        }
      } else {
        vm.query.ids = vm.ids;
      }
      vm.currentId = 0;
      //智能推荐
      vm.intelligent = [
        {
          id: 0,
          name: "智能推荐"
        },
        {
          id: 6,
          name: "卖家保障类"
        },
        {
          id: 1,
          name: "物流保障类"
        },
        // {
        //   id: 2,
        //   name: "产品保障类"
        // },
        // {
        //   id: 3,
        //   name: "售后保障类"
        // },
        // {
        //   id: 4,
        //   name: "信用保障类"
        // },
        // {
        //   id: 5,
        //   name: "场景定制类"
        // },
        // {
        //   id: 7,
        //   name: "其他产品线类"
        // }
      ];
      vm.getId = function(id) {
        vm.currentId = id;
        vm.query.recommendId = vm.currentId;
        vm.getPagedDataAsync();
      };
      //获取筛选条件
      $api.get("/v1/tb/product/productShopList", function(result) {
        if (result.code == 0) {
          vm.v1List = result.data.V1;
          vm.v2List = result.data.V2;
          vm.v3List = result.data.V3;
          vm.v5List = result.data.V5;
          vm.v6List = result.data.V6;
          vm.subclassList = result.data.subclass;
        } else {
          layer.msg(result.msg, { time: 1000 });
        }
      });
      // 获取悬浮框内容
      vm.suspend = function($event, key) {
        $event.currentTarget.children[1].style.display = "block";
        angular.forEach(vm.subclassList, function(v, k) {
          if (k == key) {
            vm.value = v;
            if (v == "") {
              $event.currentTarget.children[1].style.display = "none";
            }
          }
        });
      };
      vm.suspendHide = function($event) {
        $event.currentTarget.children[1].style.display = "none";
      };
      //监听父级登录之后获取的产品列表
      $scope.$on("shopList", function(event, data) {
        vm.list = data.list;
        if (vm.list.length > 0) {
          for (var i = 3; i < vm.list.length; i += 4) {
            vm.list[i].last = true;
          }
        }
        vm.query.pages = data.pages;
      });
      //获取产品包列表
      vm.getPagedDataAsync = function() {
        $api.post(
          "/v1/tb/product/productShop",
          angular.toJson(vm.query),
          function(result) {
            if (result.code == 0) {
              vm.list = result.data.list;
              if (vm.list.length > 0) {
                for (var i = 3; i < vm.list.length; i += 4) {
                  vm.list[i].last = true;
                }
              }
              vm.query.pages = result.data.pages;
            } else {
              layer.msg(result.msg, { time: 1000 });
            }
          }
        );
      };

      //---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
      //返回选择页
      vm.toMerchant = function() {
        $state.go("merchant");
      };
      //选择唯一
      vm.getOne = function(type, key, value) {
        if (vm.queryList.length == 0) {
          vm.queryList.push({ key: key, name: value, type: type });
        } else {
          for (var i = 0; i < vm.queryList.length; i++) {
            if (vm.queryList[i].type == type) {
              vm.queryList[i].key = key;
              vm.queryList[i].name = value;
              return false;
            }
          }
          vm.queryList.push({ key: key, name: value, type: type });
        }
      };
      //选取筛选条件
      vm.checkQuery = function(key, value, verb) {
        switch (verb) {
          case "v1":
            vm.v1CurrentKey = key;
            vm.getOne(1, key, value);
            vm.query.configV1Id = key;
            break;
          case "v2":
            vm.v2CurrentKey = key;
            vm.getOne(2, key, value);
            vm.query.configV2Id = key;
            break;
          case "v3":
            vm.v3CurrentKey = key;
            vm.getOne(3, key, value);
            vm.query.configV3Id = key;
            break;
        }
        vm.getPagedDataAsync();
      };
      //删除筛选条件
      vm.delete = function(index, type) {
        vm.queryList.splice(index, 1);
        switch (type) {
          case 1:
            vm.query.configV1Id = "";
            vm.v1CurrentKey = "";
            break;
          case 2:
            vm.query.configV2Id = "";
            vm.v2CurrentKey = "";
            break;
          case 3:
            vm.query.configV3Id = "";
            vm.v3CurrentKey = "";
            break;
        }
        vm.getPagedDataAsync();
      };
      //关闭
      vm.closeProductPop = function() {
        vm.productPop = false;
        vm.popProductData.configV5Id = "";
        vm.popProductData.configV6Id = "";
        vm.popProductData.price = "";
      };
      //弹出产品包详情
      vm.showProductPop = function(o) {
        vm.productPop = true;
        vm.popProductData.configV1Desc = o.configV1Desc;
        vm.popProductData.configV2Desc = o.configV2Desc;
        vm.popProductData.configV3Desc = o.configV3Desc;
        vm.popProductData.officialPicUrl = o.officialPicUrl;
        vm.popProductData.productPackageId = o.id;
        vm.popProductData.singlePrice = o.singlePrice;
        vm.popProductData.productName = o.productName;
      };
      //获取最终价格
      vm.getPrice = function() {
        if (
          vm.popProductData.configV5Id != "" &&
          vm.popProductData.configV6Id != ""
        ) {
          $api.post(
            "/v1/calculatePrice",
            angular.toJson(vm.popProductData),
            function(result) {
              vm.popProductData.price = result.data.price;
              vm.popProductData.baseFactor = result.data.baseFactor;
            }
          );
        }
      };
      //加入购物车
      vm.addShop = function() {
        if (vm.popProductData.configV5Id == "") {
          return layer.msg("请选择起运地", { time: 1000 });
        }
        if (vm.popProductData.configV6Id == "") {
          return layer.msg("请选择目的地", { time: 1000 });
        }
        for (var key in vm.v5List) {
          if (vm.popProductData.configV5Id == key) {
            vm.popProductData.configV5Desc = vm.v5List[key];
          }
        }
        for (var key in vm.v6List) {
          if (vm.popProductData.configV6Id == key) {
            vm.popProductData.configV6Desc = vm.v6List[key];
          }
        }
        //如果产品重复，数量加1
        for (var i = 0; i < $scope.$parent.$parent.shop.shopList.length; i++) {
          if (
            vm.popProductData.productPackageId ==
              $scope.$parent.$parent.shop.shopList[i].productPackageId &&
            vm.popProductData.configV5Desc ==
              $scope.$parent.$parent.shop.shopList[i].configV5Desc &&
            vm.popProductData.configV6Desc ==
              $scope.$parent.$parent.shop.shopList[i].configV6Desc
          ) {
            $scope.$parent.$parent.shop.shopList[i].num += 1;
            $scope.$parent.$parent.shop.shopList[i].priceSum = (
              $scope.$parent.$parent.shop.shopList[i].price *
              $scope.$parent.$parent.shop.shopList[i].num
            ).toFixed(2);
            $scope.$parent.$parent.shop.sumPrice = $scope.getSum().toFixed(2);
            //已登录
            if (vm.user) {
              if (vm.user.token) {
                $api.post(
                  "/productfactory/updateCard",
                  angular.toJson($scope.$parent.$parent.shop),
                  function(result) {
                    if (result.code == 0) {
                      $scope.$parent.$parent.shop = result.data;
                      if ($scope.$parent.$parent.shop.shopList.length > 0) {
                        for (
                          var i = 0;
                          i < $scope.$parent.$parent.shop.shopList.length;
                          i++
                        ) {
                          $scope.$parent.$parent.shop.shopList[i].priceSum = (
                            $scope.$parent.$parent.shop.shopList[i].price *
                            $scope.$parent.$parent.shop.shopList[i].num
                          ).toFixed(2);
                        }
                        $scope.$parent.$parent.shop.sumPrice = $scope
                          .getSum()
                          .toFixed(2);
                      }
                    }
                  }
                );
              }
            }
            vm.productPop = false;
            vm.popProductData.configV5Id = "";
            vm.popProductData.configV6Id = "";
            vm.popProductData.price = "";
            return false;
          }
        }
        //如果产品不重复，加入购物车
        $scope.$parent.$parent.shop.shopList.unshift({
          officialPicUrl: vm.popProductData.officialPicUrl,
          configV1Desc: vm.popProductData.configV1Desc,
          configV2Desc: vm.popProductData.configV2Desc,
          configV3Desc: vm.popProductData.configV3Desc,
          configV5Desc: vm.popProductData.configV5Desc,
          configV6Desc: vm.popProductData.configV6Desc,
          configV5Id: vm.popProductData.configV5Id,
          configV6Id: vm.popProductData.configV6Id,
          price: vm.popProductData.price,
          productPackageId: vm.popProductData.productPackageId,
          productName: vm.popProductData.productName,
          num: 1,
          checked: true,
          priceSum: vm.popProductData.price,
          id: null,
          baseFactor: vm.popProductData.baseFactor
        });
        $scope.$parent.$parent.sumPrice = $scope.getSum().toFixed(2);
        //已登录
        if (vm.user) {
          if (vm.user.token) {
            $api.post(
              "/productfactory/updateCard",
              angular.toJson($scope.$parent.$parent.shop),
              function(result) {
                if (result.code == 0) {
                  $scope.$parent.$parent.shop = result.data;
                  if ($scope.$parent.$parent.shop.shopList.length > 0) {
                    for (
                      var i = 0;
                      i < $scope.$parent.$parent.shop.shopList.length;
                      i++
                    ) {
                      $scope.$parent.$parent.shop.shopList[i].priceSum = (
                        $scope.$parent.$parent.shop.shopList[i].price *
                        $scope.$parent.$parent.shop.shopList[i].num
                      ).toFixed(2);
                    }
                    $scope.$parent.$parent.sumPrice = $scope
                      .getSum()
                      .toFixed(2);
                  }
                }
              }
            );
          }
        }
        vm.productPop = false;
        vm.popProductData.configV5Id = "";
        vm.popProductData.configV6Id = "";
        vm.popProductData.price = "";
      };
      //立即购买
      vm.toBuy = function() {
        if (vm.popProductData.configV5Id == "") {
          return layer.msg("请选择起运地", { time: 1000 });
        }
        if (vm.popProductData.configV6Id == "") {
          return layer.msg("请选择目的地", { time: 1000 });
        }
        for (var key in vm.v5List) {
          if (vm.popProductData.configV5Id == key) {
            vm.popProductData.configV5Desc = vm.v5List[key];
          }
        }
        for (var key in vm.v6List) {
          if (vm.popProductData.configV6Id == key) {
            vm.popProductData.configV6Desc = vm.v6List[key];
          }
        }
        //已经登录
        if (vm.user) {
          if (vm.user.token) {
            if ($scope.$parent.$parent.shop.shopList.length == 0) {
              $scope.$parent.$parent.shop.shopList.unshift({
                configV1Desc: vm.popProductData.configV1Desc,
                configV2Desc: vm.popProductData.configV2Desc,
                configV3Desc: vm.popProductData.configV3Desc,
                configV5Desc: vm.popProductData.configV5Desc,
                configV6Desc: vm.popProductData.configV6Desc,
                configV5Id: vm.popProductData.configV5Id,
                configV6Id: vm.popProductData.configV6Id,
                price: vm.popProductData.price,
                productPackageId: vm.popProductData.productPackageId,
                productName: vm.popProductData.productName,
                num: 1,
                priceSum: vm.popProductData.price,
                id: null,
                baseFactor: vm.popProductData.baseFactor
              });
              $scope.$parent.$parent.sumPrice = $scope.getSum().toFixed(2);
              $api.post(
                "/productfactory/updateCard",
                angular.toJson($scope.$parent.$parent.shop),
                function(result) {
                  if (result.code == 0) {
                    window.location.href =
                      $defaultConfig.outside_uri +
                      "/index.html#/productFactoryCar.html";
                  }
                }
              );
            } else {
              //如果产品重复，数量加1
              var num = 0;
              for (
                var i = 0;
                i < $scope.$parent.$parent.shop.shopList.length;
                i++
              ) {
                if (
                  vm.popProductData.productPackageId ==
                    $scope.$parent.$parent.shop.shopList[i].productPackageId &&
                  vm.popProductData.configV5Desc ==
                    $scope.$parent.$parent.shop.shopList[i].configV5Desc &&
                  vm.popProductData.configV6Desc ==
                    $scope.$parent.$parent.shop.shopList[i].configV6Desc
                ) {
                  $scope.$parent.$parent.shop.shopList[i].num += 1;
                  $scope.$parent.$parent.shop.shopList[i].priceSum = (
                    $scope.$parent.$parent.shop.shopList[i].price *
                    $scope.$parent.$parent.shop.shopList[i].num
                  ).toFixed(2);
                  $scope.$parent.$parent.shop.sumPrice = $scope
                    .getSum()
                    .toFixed(2);
                  num = 1;
                }
              }
              if (num == 1) {
                $api.post(
                  "/productfactory/updateCard",
                  angular.toJson($scope.$parent.$parent.shop),
                  function(result) {
                    window.location.href =
                      $defaultConfig.outside_uri +
                      "/index.html#/productFactoryCar.html";
                  }
                );
              } else {
                $scope.$parent.$parent.shop.shopList.unshift({
                  configV1Desc: vm.popProductData.configV1Desc,
                  configV2Desc: vm.popProductData.configV2Desc,
                  configV3Desc: vm.popProductData.configV3Desc,
                  configV5Desc: vm.popProductData.configV5Desc,
                  configV6Desc: vm.popProductData.configV6Desc,
                  configV5Id: vm.popProductData.configV5Id,
                  configV6Id: vm.popProductData.configV6Id,
                  price: vm.popProductData.price,
                  productPackageId: vm.popProductData.productPackageId,
                  productName: vm.popProductData.productName,
                  num: 1,
                  priceSum: vm.popProductData.price,
                  id: null,
                  baseFactor: vm.popProductData.baseFactor
                });
                $scope.$parent.$parent.sumPrice = $scope.getSum().toFixed(2);
                $api.post(
                  "/productfactory/updateCard",
                  angular.toJson($scope.$parent.$parent.shop),
                  function(result) {
                    if (result.code == 0) {
                      window.location.href =
                        $defaultConfig.outside_uri +
                        "/index.html#/productFactoryCar.html";
                    }
                  }
                );
              }
            }
          }
        }
        //未登录
        else {
          $scope.$parent.$parent.shop.shopList.unshift({
            configV1Desc: vm.popProductData.configV1Desc,
            configV2Desc: vm.popProductData.configV2Desc,
            configV3Desc: vm.popProductData.configV3Desc,
            configV5Desc: vm.popProductData.configV5Desc,
            configV6Desc: vm.popProductData.configV6Desc,
            configV5Id: vm.popProductData.configV5Id,
            configV6Id: vm.popProductData.configV6Id,
            price: vm.popProductData.price,
            productPackageId: vm.popProductData.productPackageId,
            productName: vm.popProductData.productName,
            num: 1,
            priceSum: vm.popProductData.price,
            id: null,
            baseFactor: vm.popProductData.baseFactor
          });
          $scope.$parent.$parent.loginPop = true;
          $scope.$parent.$parent.isSettle = true;
          vm.productPop = false;
          vm.popProductData.configV5Id = "";
          vm.popProductData.configV6Id = "";
          vm.popProductData.price = "";
        }
      };
      //跳转详情
      vm.toDetails = function(id, productWrapId) {
        window.open(
          $defaultConfig.current_uri +
            "/productFactory/pages.html#/productPackageDetails.html?id=" +
            id +
            "&productWrapId=" +
            productWrapId
        );
        // var url = $state.href("productPackageDetails", {
        //   id: id,
        //   productWrapId: productWrapId
        // });
        // window.open(url, "_blank");
      };
    }
  ]);
})();
