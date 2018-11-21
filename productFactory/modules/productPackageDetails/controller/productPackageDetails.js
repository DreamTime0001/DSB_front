(function() {
  "use strict";
  angular
    .module("app.controllers")
    .controller("ProductPackageDetailsController", [
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
        $stateParams
      ) {
        var vm = this;
        vm.getChangePrice = 0;
        vm.positiveInteger = /^[1-9]\d*$/;
        vm.popProductData = {
          baseFactor: "",
          configV5Id: "",
          configV6Id: "",
          configV1Desc: "",
          configV2Desc: "",
          configV3Desc: "",
          officialPicUrl: "",
          price: "",
          productName: "",
          productPackageId: $stateParams.id,
          singlePrice: "",
          num: 1
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
          source: ""
        };
        vm.user = JSON.parse(localStorage.getItem("user"));
        // 智能推荐列表
        vm.imgList = {
          configV1Id: "",
          configV2Id: "",
          productLine: ""
        };
        //已登录
        if (vm.user) {
          if (vm.user.source) {
            vm.query.source = vm.user.source;
            $api.post("/tbcard/list", function(result) {
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
                  $scope.$parent.$parent.sumPrice = $scope.getSum().toFixed(2);
                }
              }
            });
          }
        } else {
          // vm.query.ids = vm.ids;
        }

        //获取筛选条件
        $api.get("/v1/tb/product/productShopList", function(result) {
          if (result.code == 0) {
            // vm.v1List = result.data.V1;
            // vm.v2List = result.data.V2;
            // vm.v3List = result.data.V3;
            vm.v5List = result.data.V5;
            vm.v6List = result.data.V6;
            // vm.subclassList = result.data.subclass;
          } else {
            layer.msg(result.msg, {
              time: 1000
            });
          }
        });
        //获取最终价格
        // debugger;
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
                // if (vm.packagesList.originalPrice) {
                vm.packagesList.originalPrice = result.data.price;
                vm.getChangePrice = Number(result.data.price); //计算时获取的价格

                // }
              }
            );
          }
        };
        //---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
        //加入购物车
        vm.addShop = function() {
          if (vm.popProductData.configV5Id == "") {
            return layer.msg("请选择起运地", {
              time: 1000
            });
          }
          if (vm.popProductData.configV6Id == "") {
            return layer.msg("请选择目的地", {
              time: 1000
            });
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
              vm.popProductData.num = 1;
              vm.packagesList.originalPrice = vm.onePrice;
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
            num: vm.popProductData.num,
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
                      layer.msg("加入购物车成功", { time: 1000 });
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
          vm.popProductData.num = 1;
          vm.packagesList.originalPrice = vm.onePrice;
        };
        //立即购买
        vm.toBuy = function() {
          if (vm.popProductData.configV5Id == "") {
            return layer.msg("请选择起运地", {
              time: 1000
            });
          }
          if (vm.popProductData.configV6Id == "") {
            return layer.msg("请选择目的地", {
              time: 1000
            });
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
                  num: vm.popProductData.num,
                  checked: true,
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
                      $scope.$parent.$parent.shop.shopList[i]
                        .productPackageId &&
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
        // 获取popProductData.num
        // debugger;
        vm.getNum = function(type) {
          if (
            vm.popProductData.configV5Id != "" &&
            vm.popProductData.configV6Id != ""
          ) {
            if (!vm.positiveInteger.test(vm.popProductData.num)) {
              vm.popProductData.num = 1;
            } else {
              if (type == 0) {
                vm.popProductData.num--;
                if (vm.popProductData.num <= 1) {
                  vm.popProductData.num = 1;
                }
              } else if (type == 1) {
                vm.popProductData.num++;
              }
            }
            vm.packagesList.originalPrice =
              vm.getChangePrice * vm.popProductData.num;
            vm.packagesList.originalPrice = vm.packagesList.originalPrice.toFixed(
              2
            );
          } else {
            vm.popProductData.num = 1;
            layer.msg("请先选择起运地和目的地！", { time: 1500 });
          }
        };
        //加法
        /*  $scope.toPlus = function (obj) {
                 obj.num += 1;
                 obj.priceSum = (obj.price * obj.num).toFixed(2);
                 $scope.sumPrice = $scope.getSum().toFixed(2);
                 if (vm.user) {
                     if (vm.user.token) {
                         $api.post('/productfactory/updateCard', angular.toJson($scope.shopList), function (result) {
                             if (result.code == 0) {
                                 $scope.shopList = result.data;
                                 if ($scope.shopList.length > 0) {
                                     for (var i = 0; i < $scope.shopList.length; i++) {
                                         $scope.shopList[i].priceSum = ($scope.shopList[i].price * $scope.shopList[i].num).toFixed(2);
                                     }
                                     $scope.sumPrice = $scope.getSum().toFixed(2);
                                 }
                             }
                         });
                     }
                 }
             }; */
        // 减法
        /*  $scope.toMinus = function (obj) {
                 if (obj.num > 1) {
                     obj.num -= 1;
                     obj.priceSum = (obj.priceSum - obj.price).toFixed(2);
                     $scope.sumPrice = $scope.getSum().toFixed(2);
                     if (vm.user) {
                         if (vm.user.token) {
                             $api.post('/productfactory/updateCard', angular.toJson($scope.shopList), function (result) {
                                 if (result.code == 0) {
                                     $scope.shopList = result.data;
                                     if ($scope.shopList.length > 0) {
                                         for (var i = 0; i < $scope.shopList.length; i++) {
                                             $scope.shopList[i].priceSum = ($scope.shopList[i].price * $scope.shopList[i].num).toFixed(2);
                                         }
                                         $scope.sumPrice = $scope.getSum().toFixed(2);
                                     }
                                 }
                             });
                         }
                     }
                 }
             }; */
        // 获取详情页内容
        $api.get(
          "/tb/productWrap/detail/" +
            $stateParams.productWrapId +
            "/" +
            $stateParams.id,
          function(result) {
            if (result.code == 0) {
              vm.conList = result.data;
              vm.packagesList = result.data.packages;
              vm.onePrice = result.data.packages.originalPrice; //获取的初始价格
              vm.productLine = result.data.salerLine;
              // vm.imgList.productLine = 0;
              switch (vm.productLine) {
                case 1:
                  vm.salerLine = "物流保障类";
                  break;
                case 2:
                  vm.salerLine = "产品保障类";
                  break;
                case 3:
                  vm.salerLine = "售后保障类";
                  break;
                case 4:
                  vm.salerLine = "信用保障类";
                  break;
                case 5:
                  vm.salerLine = "场景定制类";
                  break;
                case 6:
                  vm.salerLine = "卖家保障类";
                  break;
                case 7:
                  vm.salerLine = "其他产品线类";
                  break;
              }

              // 智能推荐
              vm.imgList.configV1Id = vm.packagesList.configV1Id;
              vm.imgList.configV2Id = vm.packagesList.configV2Id;
              vm.imgList.productLine = vm.productLine;
              $api.post(
                "/tb/productWrap/intelligence",
                angular.toJson(vm.imgList),
                function(res) {
                  if (res.code == 0) {
                    vm.picList = res.data;
                    $timeout(function() {
                      var mySwiper = new Swiper(".swiper-container", {
                        direction: "vertical",
                        loop: true,
                        navigation: {
                          nextEl: ".swiper-button-next",
                          prevEl: ".swiper-button-prev"
                        },
                        slidesPerView: 2,
                        speed: 1000,
                        observer: true, //修改swiper自己或子元素时，自动初始化swiper
                        observeParents: false, //修改swiper的父元素时，自动初始化swiper
                        onSlideChangeEnd: function(swiper) {
                          swiper.update();
                          mySwiper.startAutoplay();
                          mySwiper.reLoop();
                        }
                      });
                    }, 200);
                  }
                }
              );
              // 地点获取价格
              vm.popProductData.configV1Desc =
                result.data.packages.configV1Desc;
              vm.popProductData.configV2Desc =
                result.data.packages.configV2Desc;
              vm.popProductData.configV3Desc =
                result.data.packages.configV3Desc;
              vm.popProductData.officialPicUrl = result.data.officialPicUrl;
              vm.popProductData.productName = result.data.productName;
              vm.popProductData.productPackageId = $stateParams.id;
              vm.popProductData.singlePrice = result.data.packages.singlePrice;
              // baseFactor:'',

              // layer.msg(result.msg, {
              //     time: 1000
              // });
            } else {
              layer.msg(result.msg, {
                time: 1500
              });
            }
          }
        );

        //---------------------------------------------------------------------------------------分割线----------------------------------------------------------------------------------------//

        // 滚动
        vm.scrollPage = function() {
          // 滚动至详情页时
          if ($(".query-div03").length > 0) {
            var offsetTop = $(".query-div03").offset().top;
          }
          var wTop = $(document).scrollTop(),
            items_h2 = $(".conDiv").find("h2"),
            items_li = $(".navUl li");

          if (wTop >= offsetTop) {
            $(".navUl").addClass("top");
          } else {
            $(".navUl").removeClass("top");
          }

          // 滚动至详情页后

          for (var i = 0; i < items_h2.length; i++) {
            for (var j = 0; j < $(".navUl li").length; j++) {
              if (i == j) {
                var pHeight = items_h2
                  .eq(i)
                  .next("p")
                  .height();
                if (
                  wTop >= items_h2.eq(i).offset().top - 50 &&
                  wTop < items_h2.eq(i).offset().top + pHeight
                ) {
                  items_li
                    .eq(j)
                    .addClass("active")
                    .siblings()
                    .removeClass("active");
                }
              }
            }
          }
        };

        $(window).scroll(function() {
          vm.scrollPage();
        });

        // 伪锚点跳转
        $(".navUl li").click(function() {
          var $index = $(this).index();
          $(this)
            .addClass("active")
            .siblings()
            .removeClass("active");
          if ($(".conDiv").find("h2").length != 0) {
            $("html,body").animate(
              {
                scrollTop: $(".conDiv h2")
                  .eq($index)
                  .offset().top -50
              },
              1
            );
          }
        });
      }
    ]);
})();
