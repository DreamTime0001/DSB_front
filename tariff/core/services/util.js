(function () {
    'use strict';
    angular.module('app.util', ['app.config', 'app.layer'])
        .factory('$util', ['$rootScope', '$defaultConfig', '$layer', '$http', '$anchorScroll', '$location', function ($rootScope, $defaultConfig, $layer, $http, $anchorScroll, $location) {

            var validator = {
                required: {
                    regex: /[^(^\s*)|(\s*$)]/,
                    msg: "此项必填"
                },
                email: {
                    regex: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                    msg: "邮箱格式不正确。参考格式: wzp@upg.cn"
                },
                qq: {
                    regex: /^\d+$/,
                    msg: "qq号码必须是1位以上的数字"
                },
                money: {
                    regex: /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/,
                    msg: "金额格式不符，仅允许输入数字和小数点，并最多输入两位小数，如1000.00"
                },
                url: {
                    msg: "链接格式不正确。参考格式：http://www.ifsc.com.cn"
                },
                id: {
                    msg: "此项必填"
                },
                lengthRange: {
                    msg: "密码长度为 #0# 到 #1#"
                },
                notMatch: {
                    msg: "please enter a value differnt from '#0#'"
                },
                match: {
                    msg: "请保证两次输入一致"
                },
                realname: {
                    regex: /^[\u0391-\uFFE5A-Za-z0-9]+$/,
                    msg: "中文,英文, 0-9"
                },
                //安全问答的验证
                safeAnswer: {
                    regex: /^[\u0391-\uFFE5A-Za-z0-9\s]+$/,
                    msg: "答案只允许中文、英文、数字"
                },
                alphanumeric: {
                    regex: /^[A-Za-z0-9_-]+$/,
                    msg: "英文, 0-9, - and _"
                },
                idcard: {
                    regex: function (card) {
                        if (null == card)
                            return false;
                        var xx = [2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2, 4, 8, 5, 10, 9, 7];
                        var yy = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
                        var mm = 0;
                        if (card.length == 15) {
                            if (isBirthday(card)) {
                                return true;
                            } else {
                                return false;
                            }
                        } else if (card.length == 18) {
                            var gg = new Array;
                            for (var i = 1; i < 18; i++) {
                                var j = 17 - i;
                                gg[i - 1] = parseInt(card.substring(j, j + 1), 10);
                            }
                            for (var i = 0; i < 17; i++) {
                                mm += xx[i] * gg[i];
                            }
                            mm = mm % 11;
                            var c = card.charAt(17);
                            if (c.toUpperCase() == yy[mm] && isNewBirthday(card))
                                return true;
                            else
                                return false;
                        } else {
                            return false;
                        }

                        function isNewBirthday(card) {
                            var y = parseInt(card.substring(6, 10), 10);
                            var m = parseInt(card.substring(10, 12), 10);
                            var d = parseInt(card.substring(12, 14), 10);
                            if (y < 1900 || m < 1 || m > 12 || d < 1 || d > 31 ||
                                ((m == 4 || m == 6 || m == 9 || m == 11) && d > 30) ||
                                (m == 2 && ((y % 4 > 0 && d > 28) || d > 29))) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    },
                    msg: "身份证号码错误"
                },
                mobile: {
                    // regex: /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){10,12})+$/,
                    regex: /^[1][3,4,5,8,7]\d{9}$/,
                    msg: "手机号码格式错误"
                },
                phone: {
                    //regex: /^((\d{11,12})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/,
                    regex: /^((\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})$)$/,
                    msg: "请输入正确的座机号码，如:0571-88888888"
                },
                mobileOrPhone: {
                    msg: "此项格式为手机或座机号码"
                },
                // 验证座机区号
                areaPart: {
                    // 匹配区号0开头的3位或4位数字
                    regex: /^0\d{2}$|^0\d{3}$/,
                    msg: "区号格式错误"
                },
                // 验证座机号，不包括区号
                phonePart: {
                    // 匹配电话号码为7位或8位数字
                    regex: /^((\d{7,8})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})$)$/,
                    msg: "座机号码格式错误"
                },
                year: {
                    regex: /^[1,2][0,9]\d{2}$/,
                    msg: "年格式填写错误！"
                },
                month: {
                    regex: /^[0,1]\d{1}$|^\d{1}$/,
                    msg: "月格式填写错误！"
                },
                day: {
                    regex: /^[0,1,2,3]\d{1}$|^\d{1}$/,
                    msg: "日格式填写错误！"
                },
                number: {
                    regex: /^\d+$/,
                    msg: "此项为数字格式"
                },
                notAllNum: {
                    regex: /^\d+$/,
                    msg: "不能全为数字"
                },
                uploadImg: {
                    msg: "图片类型错误"
                },
                uploadFile: {
                    msg: "附件类型错误"
                },
                uploadFileImg: {
                    msg: "附件类型错误"
                },
                uploadSound: {
                    msg: "录音类型错误"
                },
                maxValue: {
                    msg: "请输入数字小于  #0#"
                },
                minValue: {
                    msg: "请输入数字大于  #0#"
                },
                maxDecimal: {
                    msg: "有效数字不多于 #0#"
                },
                integer: {
                    regex: /^[1-9]\d*$/,
                    msg: "请输入正整数"
                },
                // 利率判断 eg: 43 | 32. | 32.1 | 32.33
                rate: {
                    regex: /^\d{1,2}(\.\d{1,2}?)?$/,
                    msg: "请输入有效数字"
                },
                // 最小金额
                minNumber: {
                    regex: /^\d*(\.(\d{1,2})?)?$/,
                    msg: "请输入大于等于 #0# 数字"
                }
            };

            return {
                /**
                 * @func validForm
                 * @param selector
                 * @param isNoPreVerify
                 * @example
                 * selector 为选择器，可以不填写。默认为ion-view
                 * 验证表单中该填的是否已填
                 * ng-novalid不进行验证
                 * 提示字段为当前input的 required
                 *
                 * 支持自定类型判断,前面是类型，后面是报错文字
                 * valid="mobile:手机, money: 只保留两位"
                 */
                validForm: function (from_index) {
                    var result = true,
                        inputs, tipMsg, input, ionView;
                    from_index = from_index ? from_index : 0;
                    ionView = document.forms[from_index];

                    //临时
                    var errors = new Array();
                    // 筛选出当前页的表单进行验证
                    if (ionView) {
                        inputs = ionView.querySelectorAll('input, select, textarea');
                        for (var i = 0; i < inputs.length; i++) {
                            input = inputs[i];
                            var ngNovalid = (input.getAttribute('ng-novalid') || '').trim();
                            angular.element(input).parent().removeClass('has-error');
                            var val = angular.element(input).val(); // 表单值
                            var validType = input.getAttribute('valid'); // 有没有自定义验证
                            var hasRequired = input.hasAttribute('required');
                            //临时
                            var inputId = input.getAttribute('id');
                            // 如果有required 且 ng-novalid 为false
                            if ((ngNovalid === 'false' || !ngNovalid) && (hasRequired || validType)) {
                                if (hasRequired && !val) { // 表单没有值
                                    tipMsg = input.getAttribute('required') || "此项必填";
                                    result = false;
                                } else if (validType) { // 有自定义验证
                                    // 取出各组的k:v 例如valid="mobile:手机, money: 只保留两位"
                                    // ['mobile:手机', 'money:只保留两位']
                                    angular.forEach(validType.split(','), function (item) {
                                        // ['mobile', '手机']
                                        var validObj = item.split(':');
                                        var defaultRule = validator[validObj[0]]; // 默认规则里是否存在这条
                                        // forEach真2b，中间不能断开, 所以要加上 result 的判断
                                        if (defaultRule && result) {
                                            // 匹配失败，说明格式不对
                                            if (typeof defaultRule.regex === 'function') {
                                                result = defaultRule.regex(val);
                                            } else {
                                                if (!defaultRule.regex.test(val)) {
                                                    result = false;
                                                }
                                            }
                                            tipMsg = validObj[1] || defaultRule.msg; // 报错信息tipMsg = validObj[1] || defaultRule.msg; // 报错信息
                                        }
                                    });
                                }
                                // 对结果进行判断
                                if (!result) {
                                    errors.push({id: inputId, msg: tipMsg})
                                }
                            }
                        }
                    }
                    if (errors.length) {
                        $layer.tip(errors[0].msg);
                        var id = errors[0].id;
                        if (id) {
                            $anchorScroll.yOffset = 150;
                            $location.hash(id);
                            $anchorScroll();
                            angular.element('#' + id).focus().parent().addClass('has-error');
                        }
                        return false;
                    }
                    return true;
                },
                downLoad: function (url, fileName, params, headers) {
                    $layer.loading('下载中...');
                    $http.get(url, {
                        responseType: 'blob',
                        headers: headers || {},
                        params: params || {}
                    }).success(function (data, status, headers, config) {
                        console.log(data);
                        $layer.close();
                        if (data.size && data.type === 'application/octet-stream' || data.size && data.type === 'application/force-download') {
                            var blob = new Blob([data], {type: data.type});
                            var a = document.createElement("a");
                            a.download = fileName;
                            a.href = URL.createObjectURL(blob);
                            document.body.appendChild(a);
                            a.click();
                        } else {
                            $layer.tip('下载失败');
                        }
                    })
                },
                /**
                 * 获得焦点
                 * @param id    获得焦点的id
                 */
                inputFocus: function (id) {
                    // $anchorScroll.yOffset = 150;
                    $location.hash(id);
                    $anchorScroll();
                    angular.element('#' + id).focus().addClass('has-error');
                }
            }
        }])
}());