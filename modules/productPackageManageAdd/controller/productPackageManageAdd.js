(function() {
  "use strict";
  angular
    .module("app.controllers")
    .controller("productPackageManageAddController", [
      "$api",
      "$timeout",
      "$upload",
      "$http",
      "$state",
      "$scope",
      "$defaultConfig",
      "$layer",
      "$location",
      "$anchorScroll",
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
        $location,
        $anchorScroll,
        $cookies
      ) {
        var vm = this;
        localStorage.removeItem("productManageCompany");
        vm.user = JSON.parse(localStorage.getItem("user"));
        vm.allChecked = false;
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
          },
          {
            id: 4,
            name: "组合费率"
          }
        ];
        //产品线数据
        vm.productLineList = [
          {
            id: 1,
            name: "物流保障类"
          },
          {
            id: 2,
            name: "产品保障类"
          },
          {
            id: 3,
            name: "售后保障类"
          },
          {
            id: 4,
            name: "信用保障类"
          },
          {
            id: 5,
            name: "场景定制类"
          },
          {
            id: 6,
            name: "卖家保障类"
          },
          {
            id: 7,
            name: "其他产品线类"
          }
        ];
        //投保方式数据
        vm.insuranceInformation = [
          {
            type: "webApply",
            name: "网页投保",
            checked: false
          },
          {
            type: "excelApply",
            name: "Excel",
            checked: false
          },
          {
            type: "apiApply",
            name: "API",
            checked: false
          },
          {
            type: "wxApply",
            name: "小程序",
            checked: false
          }
        ];
        //投保必填项
        vm.insureItems = [
          {
            type: "手机号",
            checked: false
          },
          {
            type: "身份证号码",
            checked: false
          },
          {
            type: "物流单号",
            checked: false
          },
          {
            type: "物流发货日期",
            checked: false
          },
          {
            type: "收货地址",
            checked: false
          },
          {
            type: "购物网站订单号/海淘商品订单号",
            checked: false
          },
          {
            type: "购物网站",
            checked: false
          },
          {
            type: "商品列表",
            checked: false
          },
          {
            type: "保费",
            checked: false
          },
          {
            type: "姓名",
            checked: false
          },
          {
            type: "购买日期",
            checked: false
          },
          {
            type: "起运地",
            checked: false
          },
          {
            type: "目的口岸",
            checked: false
          },
          {
            type: "运输方式",
            checked: false
          },
          {
            type: "商品价值明细",
            checked: false
          },
          {
            type: "商品价值",
            checked: false
          },
          {
            type: "商品种类",
            checked: false
          },
          {
            type: "性别",
            checked: false
          },
          {
            type: "货物数量",
            checked: false
          },
          {
            type: "物流公司名称",
            checked: false
          },
          {
            type: "收件人信息",
            checked: false
          },
          {
            type: "寄件人信息",
            checked: false
          },
          {
            type: "收件人地址",
            checked: false
          },
          {
            type: "寄件人地址",
            checked: false
          },
          {
            type: "卖家账号或登录名",
            checked: false
          },
          {
            type: "买家账号或登录名",
            checked: false
          }
        ];
        //理赔信息数据
        vm.claimInforList = [
          {
            id: 0,
            name: "立即生效"
          },
          {
            id: 1,
            name: "第二天0点生效"
          },
          {
            id: 2,
            name: "第三天0点生效"
          },
          {
            id: 3,
            name: "第四天0点生效"
          },
          {
            id: 4,
            name: "第五天0点生效"
          },
          {
            id: 5,
            name: "第六天0点生效"
          }
        ];
        //产品责任数据
        vm.productDutyList = [
          {
            id: "BSB",
            name: "通关责任"
          },
          {
            id: "HSB",
            name: "货损"
          },
          {
            id: "YSB",
            name: "延时"
          },
          {
            id: "DJB",
            name: "丢件"
          },
          {
            id: "TYB",
            name: "退运"
          },
          {
            id: "THB",
            name: "退货"
          },
          {
            id: "ZPB",
            name: "正品"
          },
          {
            id: "CDB",
            name: "产地"
          },
          {
            id: "YXQB",
            name: "有效期险"
          },
          {
            id: "CPZRX",
            name: "产品责任险"
          },
          {
            id: "CKHS",
            name: "出口货损"
          },
          {
            id: "CKDJ",
            name: "出口丢件"
          },
          {
            id: "CKCF",
            name: "出口错发"
          },
          {
            id: "CKYS",
            name: "出口延时"
          },
          {
            id: "CKTH",
            name: "出口退货"
          }
        ];
        //商品类别
        vm.goodKindList = [
          {
            id: 9998,
            name: "宠物用品",
            checked: false
          },
          {
            id: 9999,
            name: "宠物玩具",
            checked: false
          },
          {
            id: 10000,
            name: "宠物食品",
            checked: false
          },
          {
            id: 10001,
            name: "服装配饰，鞋子箱包类",
            checked: false
          },
          {
            id: 10002,
            name: "其他",
            checked: false
          },
          {
            id: 10003,
            name: "数码/电子、家用电器类",
            checked: false
          },
          {
            id: 10004,
            name: "易碎、易漏品",
            checked: false
          },
          {
            id: 10005,
            name: "玻璃制品、陶瓷制品",
            checked: false
          }
        ];
        //所有互斥Id
        vm.mutexList = [];
        //理赔方式数据
        vm.claimList = [];
        //产品详情图片列表
        vm.productImgList = [];
        angular.copy(vm.insuranceInformation, vm.claimList);
        //理赔上传项数据
        $api.get("/product/getCompensation", function(result) {
          if (result.code == 0) {
            var tempList = result.data;
            vm.videoImgList = [];
            vm.fontList = [];
            for (var i = 0; i < tempList.length; i++) {
              if (tempList[i].type == 1) {
                vm.videoImgList.push({
                  docsId: tempList[i].id,
                  docName: tempList[i].docName
                });
              } else {
                vm.fontList.push({
                  docsId: tempList[i].id,
                  docName: tempList[i].docName
                });
              }
            }
          }
        });
        //提交数据
        vm.productData = {
          productName: "", //产品名称
          rate: "", //产品包费率
          anchorRatio: "", //锚点系数
          limitTimeReduce: "", //投保时间限制T-
          limitTimePlus: "", //投保时间限制T+
          officialPicUrl: "", //官网图片地址
          officialPicDesc: "", //产品官网图片描述
          saasPicUrl: "", //SaaS图片地址
          saasPicDesc: "", //产品SaaS图片描述
          productPeriod: "", //产品有效期
          monthCompensationAmount: "", //月累计补贴限额
          yearCompensationAmount: "", //年累计补贴限额
          monthCompensationAmountRest: "", //月累计补贴剩余额度
          yearCompensationAmountRest: "", //年累计补贴剩余额度
          prescription: "", //申诉时效
          mutex: "", //险种理赔互斥
          isCochain: 0, //是否上链
          //原子产品
          products: [
            {
              productTemplateId: "",
              mutex: "",
              productCompensationAmount: "",
              productPeriod: "",
              mutexedList: [],
              mutexed: ""
            }
          ],
          //产品包扩展信息
          tbProductWrapExtend: {
            orderWay: "", //投保方式
            orderInsurance: "", //投保必填项
            applyInsurance: "", //理赔方式
            applyInsurancePicVedio: "", //理赔必填项,图片和视频
            applyInsuranceDoc: "", //理赔必填项,文字描述
            customerOrderDate: "", //客户保单生效日期
            customerApplyDate: "", //客户理赔生效日期
            systemOrderDate: "", //系统保单生效日期
            systemApplyDate: "" //系统理赔生效日期
          },
          isAudit: 0, //是否小额快审
          salerLine: "", //产品线类别
          saleRatio: "", //销售系数
          goodKind: "", //商品类别
          goodKindIds: "", //商品类别Id
          goodKindChecked: [], //选中的商品类别
          goodKindIdsChecked: [], //选中的商品类别Id
          description: "", //html文本
          audit: {
            limitMoney: "", //小额快审单笔上限
            limitMoneyMonth: "", //小额快审月限额
            limitMoneyMonthRest: "" //小额快审月剩余额度
          }
        };
        vm.productTemplateIdList = []; //原子产品id列表
        //获取组合的互斥Id
        vm.getMutexList = function() {
          vm.mutexList = [];
          for (var i in vm.productData.products) {
            if (vm.productData.products[i].productTemplateId) {
              vm.mutexList.push(vm.productData.products[i].productTemplateId);
            }
          }
        };
        vm.addMutexedList = function(obj) {
          // debugger;
          var num = 0;
          if (obj.mutexedList.length == 0 && obj.mutexed != null) {
            return obj.mutexedList.push(obj.mutexed);
          }
          if (obj.mutexed == null) {
            return false;
          }
          for (var x in obj.mutexedList) {
            if (obj.mutexed == obj.mutexedList[x]) {
              num++;
            }
          }
          if (num == 0) {
            obj.mutexedList.push(obj.mutexed);
          }
        };
        vm.getInfo = function(obj) {
          for (var i = 0; i < vm.productData.products.length; i++) {
            vm.productData.products[i].mutexedList = [];
          }
          vm.mutexList = [];
          for (var i = 0; i < vm.productTemplateIdList.length; i++) {
            if (obj.productTemplateId == vm.productTemplateIdList[i].id) {
              obj.productPeriod = vm.productTemplateIdList[i].productPeriod;
              obj.combinationProductAmount =
                vm.productTemplateIdList[i].productCompensationAmount;
              obj.showName = vm.productTemplateIdList[i].showName;
            }
          }
          // for (var i=0 in vm.productData.products) {
          for (var i = 0; i < vm.productData.products.length; i++) {
            if (vm.productData.products[i].productTemplateId) {
              vm.mutexList.push({
                id: vm.productData.products[i].productTemplateId,
                showName: vm.productData.products[i].showName
              });
            }
          }
          vm.distinct = function(arr) {
            var i,
              j,
              len = arr.length;
            for (i = 0; i < len; i++) {
              for (j = i + 1; j < len; j++) {
                if (arr[i].showName == arr[j].showName) {
                  arr.splice(j, 1);
                  len--;
                  j--;
                }
              }
            }
            return arr;
          };
          vm.distinct(vm.mutexList);
        };
        //添加原子产品
        vm.addProduct = function() {
          if (vm.productData.products.length == 10) {
            return layer.msg("最多只能10条数据", { time: 1000 });
          } else {
            vm.productData.products.push({
              productTemplateId: "",
              mutex: "",
              productCompensationAmount: "",
              productPeriod: "",
              mutexedList: [],
              mutexed: ""
            });
          }
        };
        //删除原子产品
        vm.deleteProduct = function(index, productTemplateId) {
          vm.productData.products.splice(index, 1);
          vm.mutexedList = [];
          for (var i = 0; i < vm.mutexList.length; i++) {
            if (productTemplateId == vm.mutexList[i].id) {
              vm.mutexList.splice(i, 1);
            }
          }
        };
        //投保信息
        vm.insurance = {
          applyType: [], //投保方式
          insuranceList: [], //投保必填项
          claimType: [], //理赔方式
          imgV: [], //图片+视频
          doc: [] //文字描述
        };

        vm.testImg = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/;

        //图片上传
        vm.readExcel = function(file, type) {
          $layer.loading();
          var files = file[0];
          var name = file[0].name;
          // obj.url = files[0].name;

          if (files) {
            $upload
              .upload({
                url: $defaultConfig.app_uri + "/tb/productWrap/pic",
                headers: {
                  token: vm.user.token
                },
                file: files
              })
              .progress(function(evt) {
                //上传进度
              })
              .success(function(data, status, headers, config) {
                if (data.code == 0) {
                  $layer.close();
                  if (type == "dowsure") {
                    vm.productData.officialPicUrl = data.data;
                    vm.dowsureName = name;
                  } else if (type == "saas") {
                    vm.productData.saasPicUrl = data.data;
                    vm.saasName = name;
                  } else if (type == "product") {
                    vm.productImgList.push({ url: data.data });
                  }
                } else {
                  layer.msg(data.msg, { time: 1000 });
                }
              })
              .error(function(data, status, headers, config) {
                $layer.close();
                layer.msg("服务器异常，请重新尝试", { time: 1000 });
              });
          }
        };

        //原子产品id列表
        $api.get("/tb/productWrap/productTemplateList", function(result) {
          if (result.code == 0) {
            for (var i = 0; i < vm.productData.products.length; i++) {
              vm.productTemplateIdList = result.data;
              for (var i = 0; i < vm.productTemplateIdList.length; i++) {
                vm.productTemplateIdList[i].showName =
                  vm.productTemplateIdList[i].id +
                  "-" +
                  vm.productTemplateIdList[i].product_name;
              }
            }
          }
        });
        //配置wangEditor
        var E, editor;
        E = window.wangEditor;
        editor = new E("#editor"); //id一定要一致
        editor.customConfig.menus = [
          "head", // 标题
          "bold", // 粗体
          "fontSize", // 字号
          "fontName", // 字体
          "italic", // 斜体
          "underline", // 下划线
          "foreColor", // 文字颜色
          "backColor", // 背景颜色
          "link", // 插入链接
          "list", // 列表
          "justify", // 对齐方式
          "image", // 插入图片
          "table", // 表格
          "video", // 插入视频
          "code", // 插入代码
          "undo" // 撤销
        ];
        //如果需要使用 base64 编码直接将图片插入到内容中，可参考一下示例配置
        editor.customConfig.uploadImgShowBase64 = false;
        // 将图片大小限制为 10M
        editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024;
        // 关闭粘贴样式的过滤
        editor.customConfig.pasteFilterStyle = false;
        // 忽略粘贴内容中的图片
        editor.customConfig.pasteIgnoreImg = true;
        editor.create();

        //---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//

        vm.testInteger = /^\d+$/;
        //清除复选框
        vm.clearGrounp = function() {
          vm.insurance.applyType = [];
          vm.insurance.insuranceList = [];
          vm.insurance.claimType = [];
          vm.insurance.imgV = [];
          vm.insurance.doc = [];
        };
        // 验证必填项
        vm.testRequired = function(obj) {
          //产品信息
          if (obj.productName === "") {
            layer.msg("产品包名称不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.rate === "") {
            layer.msg("产品包费率不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.anchorRatio === "") {
            layer.msg("锚点系数不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.productType != 0) {
            if (obj.highestNum === "") {
              layer.msg("单次最高购买分数不能为空！", { time: 1000 });
              vm.clearGrounp();
              return false;
            }
          }
          if (obj.limitTimeReduce === "" || obj.limitTimePlus === "") {
            layer.msg("使用时间限制不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          } else if (
            !vm.testInteger.test(obj.limitTimeReduce) ||
            !vm.testInteger.test(obj.limitTimePlus)
          ) {
            layer.msg("使用时间限制应为整数！", { time: 1000 });
            vm.clearGrounp();
            return false;
          } else if (obj.limitTimeReduce < 0) {
            layer.msg("使用时间限制T-不能小于0！", { time: 1000 });
            vm.clearGrounp();
            return false;
          } else if (obj.limitTimePlus > 30) {
            layer.msg("使用时间限制T+不能大于30！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.anchorRatio === "") {
            layer.msg("锚点系数不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (
            /^([1-9]|10)$/.test(obj.anchorRatio) == false ||
            parseInt(obj.anchorRatio) < 1 ||
            parseInt(obj.anchorRatio) > 10
          ) {
            layer.msg("锚点系数应为1-10之间的整数！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.productPeriod === "") {
            layer.msg("产品有效期不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.monthCompensationAmount === "") {
            layer.msg("月累计补贴限额不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (
            /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(
              obj.monthCompensationAmount
            ) == false
          ) {
            layer.msg("请正确输入月累计补贴限额", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.yearCompensationAmount === "") {
            layer.msg("年累计补贴限额不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (
            /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(
              obj.yearCompensationAmount
            ) == false
          ) {
            layer.msg("请正确输入年累计补贴限额", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.monthCompensationAmountRest === "") {
            layer.msg("月剩余补贴限额不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (
            /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(
              obj.monthCompensationAmountRest
            ) == false
          ) {
            layer.msg("请正确输入月剩余补贴限额", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.yearCompensationAmountRest === "") {
            layer.msg("年剩余补贴限额不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (
            /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(
              obj.yearCompensationAmountRest
            ) == false
          ) {
            layer.msg("请正确输入年剩余补贴限额", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.salerLine == "") {
            layer.msg("请选择产品线", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.saleRatio == "") {
            layer.msg("售价系数不能为空", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (
            /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(obj.saleRatio) == false
          ) {
            layer.msg("请正确输入售价系数", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          // if (obj.mutex === "") {
          //     layer.msg("险种理赔互斥不能为空！", {time: 1000});
          //     vm.clearGrounp();
          //     return false;
          // }
          if (obj.prescription === "") {
            layer.msg("申诉时效不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (
            /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(obj.prescription) ==
            false
          ) {
            layer.msg("请正确输入申诉时效", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          vm.kindCheck = false;
          //商品类别
          for (var i in vm.goodKindList) {
            if (vm.goodKindList[i].checked === true) {
              vm.kindCheck = true;
            }
          }
          if (vm.kindCheck === false) {
            layer.msg("至少选择一种商品类别！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          //产品详情
          if (editor.txt.html() == "<p><br></p>") {
            layer.msg("产品详情不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          //投保信息
          vm.checkNum01 = false;
          vm.checkNum02 = false;
          for (var i in vm.insuranceInformation) {
            if (vm.insuranceInformation[i].checked === true) {
              vm.checkNum01 = true;
            }
          }
          if (vm.checkNum01 === false) {
            layer.msg("至少选择一种投保方式！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }

          for (var i in vm.insureItems) {
            if (vm.insureItems[i].checked === true) {
              vm.checkNum02 = true;
            }
          }
          if (vm.checkNum02 === false) {
            layer.msg("至少选择一种投保必填项！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          //理赔方式
          vm.checkNum03 = false;
          for (var i in vm.claimList) {
            if (vm.claimList[i].checked === true) {
              vm.checkNum03 = true;
            }
          }
          if (vm.checkNum03 === false) {
            layer.msg("至少选择一种理赔方式！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          //理赔上传项
          // 图片+视频
          vm.checkNum04 = false;
          for (var i in vm.videoImgList) {
            if (vm.videoImgList[i].checked === true) {
              vm.checkNum04 = true;
            }
          }
          if (vm.checkNum04 === false) {
            layer.msg("至少选择一种图片或视频！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          // 文字
          vm.checkNum05 = false;
          for (var i in vm.fontList) {
            if (vm.fontList[i].checked === true) {
              vm.checkNum05 = true;
            }
          }
          if (vm.checkNum05 === false) {
            layer.msg("至少选择一种文字介绍！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          //理赔信息
          if (obj.tbProductWrapExtend.customerOrderDate === "") {
            layer.msg("客户保单生效日期不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.tbProductWrapExtend.customerApplyDate === "") {
            layer.msg("客户理赔生效日期不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.tbProductWrapExtend.sysOrderDate === "") {
            layer.msg("系统保单生效日期不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          if (obj.tbProductWrapExtend.sysApplyDate === "") {
            layer.msg("系统理赔生效日期不能为空！", { time: 1000 });
            vm.clearGrounp();
            return false;
          }
          //小额快审
          if (obj.isAudit === 1) {
            if (obj.audit.limitMoney === "") {
              layer.msg("小额快审单笔上限不能为空！", { time: 1000 });
              vm.clearGrounp();
              return false;
            }
            if (obj.audit.limitMoneyMonth === "") {
              layer.msg("小额快审月限额不能为空！", { time: 1000 });
              vm.clearGrounp();
              return false;
            }
            if (obj.audit.limitMoneyMonthRest === "") {
              layer.msg("小额快审月剩余额度不能为空！", { time: 1000 });
              vm.clearGrounp();
              return false;
            }
            if (obj.leastPay === "") {
              layer.msg("最低收费不能为空！", { time: 1000 });
              vm.clearGrounp();
              return false;
            }
          }
          return true;
        };
        //产品名是否重复
        vm.isNameRepeat = function(productName) {
          if (productName != "") {
            $api.post(
              "/product/is_name_repeat",
              angular.toJson({ productName: productName }),
              function(result) {
                if (result.code == 1) {
                  return layer.msg(result.msg, { time: 1000 });
                }
              }
            );
          }
        };
        //获取产品Id
        vm.getRate = function(type) {
          $api.get("/product/rate_list?productType=" + type, function(result) {
            if (result.code == 0) {
              vm.productIdList = result.data;
              for (var i = 0; i < vm.productIdList.length; i++) {
                var showName =
                  vm.productIdList[i].id +
                  "-" +
                  vm.productIdList[i].productName;
                vm.productIdList[i].showName = showName;
              }
            }
          });
        };
        //删除理赔互斥id
        vm.deleteMutexed = function(list, index) {
          list.splice(index, 1);
        };
        //提交
        vm.submit = function() {
          vm.productData.goodKindChecked = [];
          vm.productData.goodKindIdsChecked = [];
          //获取投保方式的id
          for (var i = 0; i < vm.insuranceInformation.length; i++) {
            if (vm.insuranceInformation[i].checked) {
              vm.insurance.applyType.push(vm.insuranceInformation[i].type);
              vm.productData.tbProductWrapExtend.orderWay = vm.insurance.applyType.join(
                ","
              );
            }
          }
          //获取投保必填id
          for (var i = 0; i < vm.insureItems.length; i++) {
            if (vm.insureItems[i].checked) {
              vm.insurance.insuranceList.push(vm.insureItems[i].type);
              vm.productData.tbProductWrapExtend.orderInsurance = vm.insurance.insuranceList.join(
                ","
              );
            }
          }
          //获取理赔方式的id
          for (var i = 0; i < vm.claimList.length; i++) {
            if (vm.claimList[i].checked) {
              vm.insurance.claimType.push(vm.claimList[i].type);
              vm.productData.tbProductWrapExtend.applyInsurance = vm.insurance.claimType.join(
                ","
              );
            }
          }
          //获取理赔上传
          //图片+视频
          for (var i = 0; i < vm.videoImgList.length; i++) {
            if (vm.videoImgList[i].checked) {
              vm.insurance.imgV.push(vm.videoImgList[i].docName);
              vm.productData.tbProductWrapExtend.applyInsurancePicVedio = vm.insurance.imgV.join(
                ","
              );
            }
          }
          //文字介绍
          for (var i = 0; i < vm.fontList.length; i++) {
            if (vm.fontList[i].checked) {
              vm.insurance.doc.push(vm.fontList[i].docName);
              vm.productData.tbProductWrapExtend.applyInsuranceDoc = vm.insurance.doc.join(
                ","
              );
            }
          }
          for (var i = 0; i < vm.productData.products.length; i++) {
            vm.productData.products[i].mutex = vm.productData.products[
              i
            ].mutexedList.join(",");
          }
          //商品类别
          for (var i = 0; i < vm.goodKindList.length; i++) {
            if (vm.goodKindList[i].checked) {
              vm.productData.goodKindChecked.push(vm.goodKindList[i].name);
              vm.productData.goodKindIdsChecked.push(vm.goodKindList[i].id);
              
            }
          }
          vm.productData.goodKind = vm.productData.goodKindChecked.join(
            ","
          );
          vm.productData.goodKindIds = vm.productData.goodKindIdsChecked.join(
            ","
          );
          if (vm.testRequired(vm.productData)) {
            vm.productData.description = editor.txt.html();
            $api.post(
              "/tb/productWrap/add",
              angular.toJson(vm.productData),
              function(result) {
                if (result.code == 0) {
                  layer.msg(result.msg, { time: 1000 });
                  $timeout(function() {
                    $state.go("productPackageManage");
                  }, 1200);
                } else {
                  vm.insurance.applyType = [];
                  vm.insurance.insuranceList = [];
                  vm.insurance.claimType = [];
                  vm.insurance.imgV = [];
                  vm.insurance.doc = [];
                  vm.productData.goodKindChecked = [];
                  vm.productData.goodKind = "";
                  vm.productData.goodKindIds = "";
                  return layer.msg(result.msg, { time: 1000 });
                }
              }
            );
          }
        };
        //返回
        vm.back = function() {
          $timeout(function() {
            $state.go("productPackageManage");
          }, 1200);
        };
        //监听产品类型选择
        $scope.$watch(
          "vm.productData.productType",
          function(newValue, oldValue, scope) {
            if (newValue == 0 || newValue == 4) {
              vm.productData.highestNum = 1;
            }
            if (newValue == 3) {
              vm.currentProductId = "";
            }
            if (newValue == 4) {
              vm.currentProductId = 0;
              vm.getRate(0);
            }
          },
          true
        );
        //全选
        vm.checkAll = function() {
          if (vm.allChecked) {
            for (var i = 0; i < vm.goodKindList.length; i++) {
              vm.goodKindList[i].checked = true;
            }
          }else{
            for (var i = 0; i < vm.goodKindList.length; i++) {
              vm.goodKindList[i].checked = false;
            }
          }
        };
        //单选
        vm.singleCheck = function(){
          var num = 0;
          for (var i = 0; i < vm.goodKindList.length; i++) {
              if (vm.goodKindList[i].checked) {
                  num++;
              }
          }
          if (num == vm.goodKindList.length) {
              vm.allChecked = true;
          } else {
              vm.allChecked = false;
          }
        }
      }
    ]);
})();
