(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('rechargeController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$defaultConfig', '$layer', '$cookies', '$compile', '$interval', function ($api, $timeout, $upload, $http, $state, $scope, $defaultConfig, $layer, $cookies, $compile, $interval) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.user = JSON.parse(localStorage.getItem('user'));
            vm.paracont = '获取验证码';
            vm.paraclass = 'but_null';
            vm.paraevent = true;
            vm.iconDis = false;
            vm.addBankPop = false;
            vm.passwordPop = false;
            vm.subAccountInfo = {
                t: "",
                chargeCurrency: 156,
                chargeAmount: "",
                paymentCategoryCode: "wxpay",
                outOrderID: ''
            };
            vm.withdraw = {
                paymentPassword: '',
                withdrawCurrency: 156,
                withdrawAmount: '',
                token: ''
            };
            //设置密码
            vm.resetPayPwd = {
                mobileNumber: vm.user.username,
                veriCode: '',
                newPaymentPassword: '',
                agaPassword: '',
                token: ''
            };
            vm.subAccountBalance = 0;//余额
            vm.popShow = false;
            vm.photoCode = '';

            //定义可选充值金额
            vm.chooseMoneyBox = [
                {
                    id: 500,
                    amount: "500元"
                },
                {
                    id: 1000,
                    amount: "1000元"
                },
                {
                    id: 1500,
                    amount: "1500元"
                },
                {
                    id: 2000,
                    amount: "2000元"
                },
                {
                    id: 2500,
                    amount: "2500元"
                },
                {
                    id: 3000,
                    amount: "3000元"
                }
            ];
            // 二维码转码大小设置
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width: 200,
                height: 200
            });
            //获取ticket
            $api.post('/account/ssoService', function (result) {
                if (result.code == 0) {
                    vm.ticket = result.data.ticket;
                    //余额
                    $api.post('/account/info', angular.toJson({t: vm.ticket, withdrawCurrency: '156'}), function (res) {
                        var addIcon = '<input class="btn btn-info f_l" type="submit" value="新增" ng-click="vm.addBankPopShow()"/>';
                        var editIco = '<input class="btn btn-info f_l" type="submit" value="编辑" ng-click="vm.addBankPopShow()"/>';
                        var clearIco = '<input class="btn btn-warning f_l" type="submit" value="解绑" ng-click="vm.clearBankPopShow()"/>';
                        var $addIcon = $compile(addIcon)($scope);
                        var $editIco = $compile(editIco)($scope);
                        var $clearIco = $compile(clearIco)($scope);
                        angular.element('#editIco').append($editIco);
                        angular.element('#clearIco').append($clearIco);
                        angular.element('#addIco').append($addIcon);
                        vm.subAccountBalance = (res.data.info.subAccountInfos[0].subAccountBalance * 100 + res.data.info.subAccountInfos[0].subAccountWithdrawBalance * 100 ) / 100;//余额
                        vm.subAccountWithdrawBalance = res.data.info.subAccountInfos[0].subAccountWithdrawBalance;
                        vm.subAccountFrozenWithdrawAmount = res.data.info.subAccountInfos[0].subAccountFrozenWithdrawAmount;//冻结余额
                        vm.canTakeAccount = vm.subAccountWithdrawBalance;//可提现金额
                        vm.passwordStatus = res.data.PayPwdStatus.passwordStatus;//是否设置支付密码 0-未设置 1-已设置
                        if (res.data.account == null) {
                            //新增绑卡字段
                            vm.account = {
                                withdrawAccountNo: '',//银行卡号
                                withdrawAccountUserName: '',//持卡人
                                withdrawAccountName: '',//别名
                                paymentPassword: '',//支付密码
                                depositBankNo: '',//提现账户开户银行代码
                                depositBankCityNo: '',//提现账户开户银行城市代码
                                depositBankBranchName: '',//提现账户开户银行支行名称
                                depositBankReserveMobileNum: '',//提现账户预留银行手机号
                                depositBankProvinceNo: '',//省code
                                token: ''//token
                            };
                            vm.popText = '绑定银行卡';
                            vm.isAdd = true;
                        } else {
                            vm.popText = '修改银行卡';
                            vm.isAdd = false;
                            vm.account = res.data.account;
                            vm.account.withdrawAccountNoShow = '**** **** **** **** ' + vm.account.withdrawAccountNo.substr(-4);
                            vm.account.depositBankBranchNameShow = vm.account.depositBankBranchName;
                            vm.getCity();
                            vm.getBankBranch();
                        }
                    });
                } else {
                    return layer.msg(result.msg, {time: 1000});
                }
            });
            vm.chooseMoneyBox.id = 500;//设置第一个元素的默认样式
            vm.regular = {
                phone: /^[1][3,4,5,7,8][0-9]{9}$/,
                password: /[\u4E00-\u9FA5]/g
            };
//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //绑定银行卡弹出层
            vm.addBankPopShow = function () {
                if (vm.passwordStatus == 0) {
                    vm.resetPasswordPop = true
                } else {
                    vm.addBankPop = true;
                    //获取银行总行
                    $api.get('/company/getBank', function (result) {
                        vm.bankList = result.data
                    });
                    //获取省份信息
                    $api.get('/company/getProvince', function (result) {
                        vm.provinceList = result.data
                    });
                }

            };
            // 充值
            vm.recharge = function () {
                if (vm.checkMoney()) {
                    vm.subAccountInfo.t = vm.ticket;
                    $api.post('/account/payment', angular.toJson(vm.subAccountInfo), function (res) {
                        if (res.code === 0) {
                            // 生成二维码
                            vm.subAccountInfo.outOrderID = res.data.billNo;
                            vm.imgUrl = qrcode.makeCode(res.data.paymentResponse);
                            vm.popShow = true;
                            // 扫描二维码
                            var n = 0;
                            var timeCyc = setInterval(function () {
                                $api.post("/account/callBack", angular.toJson({outOrderID: vm.subAccountInfo.outOrderID}), function (result) {
                                    if (result.code == 0) {
                                        clearInterval(timeCyc);
                                        vm.popShow = false;
                                        layer.msg('支付成功', {time: 1000});
                                        $api.post('/account/info', angular.toJson({t: vm.ticket}), function (res) {
                                            if (res.code == 0) {
                                                vm.subAccountBalance = (res.data.info.subAccountInfos[0].subAccountBalance * 100 + res.data.info.subAccountInfos[0].subAccountWithdrawBalance * 100 ) / 100;//余额
                                            } else {
                                                layer.msg(res.msg, {time: 1000});
                                            }
                                        });
                                    } else {
                                        n += 1;
                                        if (n == 60) {
                                            vm.popShow = false;
                                            clearInterval(timeCyc);
                                            layer.msg("支付失败，网络延迟等原因，请重新支付,如重复提交支付，我们会如数退还！", {time: 1000});
                                        }
                                    }
                                })
                            }, 5000);
                            // 点击弹框清除定时
                            vm.clearTimeout = function () {
                                vm.popShow = false;
                                clearInterval(timeCyc);
                            };
                        } else {
                            return layer.msg(result.data.msg, {time: 1000})
                        }
                    })
                }
            };
            // 点击选择充值金额
            vm.chooseMoney = function (id) {
                vm.chooseMoneyBox.id = id;
                vm.subAccountInfo.chargeAmount = vm.chooseMoneyBox.id;
            };
            // 验证充值金额
            vm.checkMoney = function () {
                vm.valueReg = /^(?:[\+\-]?\d+(?:\.\d+)?)?$/g;
                if (vm.subAccountInfo.chargeAmount == "") {
                    layer.msg("充值金额不能为空！", {time: 2000});
                    return false;
                } else if (vm.valueReg.test(vm.subAccountInfo.chargeAmount)) {
                    if (vm.subAccountInfo.chargeAmount <= 0) {
                        layer.msg("充值金额需大于0！", {time: 2000});
                        return false;
                    } else if (vm.subAccountInfo.chargeAmount > 3000) {
                        layer.msg("请转入大额充值页面进行充值！", {time: 2000});
                        return false;
                    }
                } else {
                    layer.msg("请输入正确的金额！", {time: 2000});
                    return false;
                }
                return true;
            };
            //绑定卡号
            vm.toBind = function () {
                vm.account.paymentPassword = '';
                if (vm.account.withdrawAccountUserName == '') {
                    return layer.msg('持卡人不能为空', {time: 1000});
                }
                if (vm.account.depositBankReserveMobileNum == '') {
                    return layer.msg('银行卡预留手机号不能为空', {time: 1000});
                } else if (!vm.regular.phone.test(vm.account.depositBankReserveMobileNum)) {
                    return layer.msg('银行卡预留手机号格式不正确', {time: 1000});
                }
                if (vm.account.withdrawAccountNo == '') {
                    return layer.msg('卡号不能为空', {time: 1000});
                }
                if (vm.account.depositBankNo == '' || vm.account.depositBankNo == null) {
                    return layer.msg('请选择开户银行', {time: 1000});
                }
                if (vm.account.depositBankProvinceNo == '' || vm.account.depositBankProvinceNo == null) {
                    return layer.msg('请选择开户银行所在地', {time: 1000});
                }
                if (vm.account.depositBankCityNo == '' || vm.account.depositBankCityNo == null) {
                    return layer.msg('请选择地区', {time: 1000});
                }
                if (vm.account.depositBankBranchName == '' || vm.account.depositBankBranchName == null) {
                    return layer.msg('请选择支行', {time: 1000});
                }
                vm.addBankPop = false;
                vm.passwordPop = true;

            };
            //获取城市
            vm.getCity = function () {
                if (vm.account.depositBankProvinceNo != '') {
                    $api.get('/company/getCity/' + vm.account.depositBankProvinceNo, function (result) {
                        vm.cityList = result.data;
                    });
                }
            };
            //获取开启银行
            vm.getBankBranch = function () {
                if (vm.account.depositBankNo == '') {
                    layer.msg('请选择开户银行', {time: 1000})
                }
                if (vm.account.depositBankNo != '' && vm.account.depositBankCityNo != '') {
                    $api.get('/company/getBankBranch/' + vm.account.depositBankNo + '/' + vm.account.depositBankCityNo, function (result) {
                        vm.BankBranchNameList = result.data;
                    });
                }
            };
            //新增、编辑关闭按钮
            vm.closePasswordPop = function () {
                vm.addBankPop = true;
                vm.passwordPop = false;
            };
            //确认添加
            vm.toAddBlank = function () {
                if (vm.account.paymentPassword == '') {
                    return layer.msg('请输入支付密码', {time: 1000});
                }
                vm.account.token = vm.ticket;
                vm.account.withdrawAccountName = vm.account.withdrawAccountUserName;
                console.log(vm.account);
                $api.post('/account/register', angular.toJson(vm.account), function (result) {
                    if (result.code == 0) {
                        vm.passwordPop = false;
                        vm.isAdd = false;
                        vm.account.depositBankBranchNameShow = vm.account.depositBankBranchName;
                        vm.account.withdrawAccountNoShow = '**** **** **** **** ' + vm.account.withdrawAccountNo.substr(-4);
                    }
                    layer.msg(result.msg, {time: 1000});
                });
            };
            //确认修改
            vm.toEditBlank = function () {
                if (vm.account.paymentPassword == '') {
                    return layer.msg('请输入支付密码', {time: 1000});
                }
                vm.account.token = vm.ticket;
                vm.account.withdrawAccountName = vm.account.withdrawAccountUserName;
                $api.post('/account/update', angular.toJson(vm.account), function (result) {
                    if (result.code == 0) {
                        vm.account.depositBankBranchNameShow = vm.account.depositBankBranchName;
                        vm.account.withdrawAccountNoShow = '**** **** **** **** ' + vm.account.withdrawAccountNo.substr(-4);
                        vm.passwordPop = false;
                        vm.account.paymentPassword = '';
                    }
                    layer.msg(result.msg, {time: 1000});
                });
            };
            //解绑
            vm.clearBankPopShow = function () {
                vm.clearBankPop = true;
            };
            //确认解绑
            vm.toClearBlank = function () {
                if (vm.account.paymentPassword == '') {
                    return layer.msg('请输入支付密码', {time: 1000});
                }
                $api.post('/account/delete', angular.toJson({
                    withdrawCurrency: '156',
                    paymentPassword: vm.account.paymentPassword,
                    token: vm.ticket
                }), function (result) {
                    if (result.code == 0) {
                        vm.clearBankPop = false;
                        vm.isAdd = true;
                        vm.account = {};
                    }
                    layer.msg(result.msg, {time: 1000});
                });
            };
            //提现
            vm.putForward = function () {
                if (vm.withdraw.withdrawAmount == '') {
                    return layer.msg('请输入提现金额', {time: 1000});
                }
                // if (vm.withdraw.withdrawAmount < 100) {
                //     return layer.msg('最低提现100元，请重新输入', {time: 1000});
                // }
                if (vm.withdraw.withdrawAmount > vm.subAccountWithdrawBalance) {
                    return layer.msg('输入提现金额不能超出可提金额', {time: 1000});
                }
                if (vm.isAdd) {
                    return layer.msg('请先绑定银行卡', {time: 1000});
                }
                if (vm.passwordStatus == 0) {
                    vm.resetPasswordPop = true;
                    return false;
                }
                vm.account.paymentPassword = '';
                vm.toPutForwardPop = true;
            };
            //确认提现
            vm.toPutForward = function () {
                if (vm.account.paymentPassword == '') {
                    return layer.msg('请输入支付密码', {time: 1000});
                }
                vm.withdraw.token = vm.ticket;
                vm.withdraw.paymentPassword = vm.account.paymentPassword;
                $api.post('/account/withdraw', angular.toJson(vm.withdraw), function (result) {
                    if (result.code == 0) {
                        $api.post('/account/info', angular.toJson({
                            t: vm.ticket,
                            withdrawCurrency: '156'
                        }), function (res) {
                            vm.subAccountBalance = (res.data.info.subAccountInfos[0].subAccountBalance * 100 + res.data.info.subAccountInfos[0].subAccountWithdrawBalance * 100 ) / 100;//余额
                            vm.subAccountWithdrawBalance = res.data.info.subAccountInfos[0].subAccountWithdrawBalance;
                            vm.subAccountFrozenWithdrawAmount = res.data.info.subAccountInfos[0].subAccountFrozenWithdrawAmount;//冻结余额
                            vm.canTakeAccount = vm.subAccountWithdrawBalance; //可提现金额
                            vm.passwordStatus = res.data.PayPwdStatus.passwordStatus;//是否设置支付密码 0-未设置 1-已设置
                        });
                        vm.toPutForwardPop = false;
                    }
                    layer.msg(result.msg, {time: 1000});
                });
            };
            //获取图片验证码
            vm.changVerifyCodeImg = function () {
                vm.verifyCodeImg = $defaultConfig.app_uri + '/code/photoCode?' + new Date().getTime();
            };
            vm.changVerifyCodeImg();
            var second = null, timePromise = undefined;
            //获取验证码
            vm.getCode = function () {
                if (second === null) {
                    second = 60;
                    if (vm.photoCode == '') {
                        layer.msg('图形验证码不能为空',{time:1000});
                        second = null;
                        return false;
                    } else {
                        $api.get('/account/getVerfyCode/' + vm.user.username +'/'+ vm.photoCode, function (result) {
                            if (result.code == 0) {
                                vm.iconDis = true;
                                timePromise = $interval(function () {
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
                                }, 1000, 1000);
                            } else {
                                layer.msg(result.msg,{time:1000});
                                vm.changVerifyCodeImg();
                                second = null;
                            }
                        });
                    }
                } else {
                    return false;
                }
            };
            vm.moneyTips = function () {
                layer.tips("商户每日可提现一次</br>每次最低提现100元</br>每次最高提现50000元", "#doubtIcon", {
                    tips: [1, '#000'],
                    time: null
                });
            };
            vm.tipClose = function () {
                layer.closeAll();
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

            //确认设置支付密码
            vm.toSetPassword = function () {
                if (vm.resetPayPwd.newPaymentPassword == '') {
                    return layer.msg('新密码不能为空', {time: 1000});
                }
                if (vm.resetPayPwd.agaPassword == '') {
                    return layer.msg('确认密码不能为空', {time: 1000});
                }
                if (vm.regular.password.test(vm.resetPayPwd.newPaymentPassword)) {
                    return layer.msg('确认密码不能为空', {time: 1000});
                }
                if (sumChartCode(vm.resetPayPwd.newPaymentPassword) < 8 || sumChartCode(vm.resetPayPwd.newPaymentPassword) > 20) {
                    return layer.msg('不能少于8位或多于20位', {time: 1000})
                }
                if (vm.resetPayPwd.newPaymentPassword != vm.resetPayPwd.agaPassword) {
                    return layer.msg('新密码与确认密码不一致', {time: 1000})
                }
                if (vm.resetPayPwd.veriCode == '') {
                    return layer.msg('请输入验证码', {time: 1000})
                }
                vm.resetPayPwd.token = vm.ticket;
                $api.post('/account/resetPayPwd', angular.toJson(vm.resetPayPwd), function (result) {
                    if (result.code == 0) {
                        vm.resetPasswordPop = false;
                        vm.resetPayPwd = {
                            mobileNumber: vm.user.username,
                            veriCode: '',
                            newPaymentPassword: '',
                            agaPassword: '',
                            token: ''
                        };
                        vm.passwordStatus = 1;
                    }
                    layer.msg(result.msg, {time: 1000});
                });
            }
        }])
}());