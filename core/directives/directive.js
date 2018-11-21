(function () {
    'use strict';
    angular.module('app.directives', ['app.config']).directive('paging', function () {
        return {
            replace: true,
            scope: {
                page: '=pageObject',
                list: '=clickFunction'
            },
            controller: function ($scope, $element) {
                $scope.createHtml = function () {
                    if ($scope.page.pages > 1) {
                        var str = '<ul>';
                        if ($scope.page.pageNum > 1) {
                            str += '<li class="pre">' + '<a href="javascript:void(0)" style="margin-right:10px">首页</a></li>';
                            str += '<li class="pre">' + '<a href="javascript:void(0)">上一页</a></li>';
                        } else {
                            str += '<li class="pre prev-disabled"><span>上一页</span></li>';
                        }
                        if ($scope.page.pages < 5) {
                            for (var i = 1; i <= $scope.page.pages; i++) {
                                if ($scope.page.pageNum == i) {
                                    str += '<li class="active"><span>' + i + '</span></li>';
                                } else {
                                    str += '<li><a href="javascript:void(0);">' + i + '</a></li>';
                                }

                            }
                        } else {
                            if ($scope.page.pageNum <= 4) {
                                for (var i = 1; i <= 5; i++) {
                                    if ($scope.page.pageNum == i) {
                                        str += '<li class="active"><span>' + i + '</span></li>';
                                    } else {
                                        str += '<li><a href="javascript:void(0);">' + i + '</a></li>';
                                    }
                                }
                            } else {
                                if ($scope.page.pageNum > 4) {
                                    str += '<li><a href="javascript:void(0);">1</a></li>';
                                    // str += '<li><a href="javascript:void(0);">2</a></li>';
                                    str += '<li class="dot"><span>...</span></li>';
                                }
                                var maxNum = Number($scope.page.pageNum) + 2;
                                if (maxNum > $scope.page.pages) {
                                    maxNum = $scope.page.pages;
                                }
                                var minNum = Number($scope.page.pageNum) - 2;
                                for (var i = minNum; i <= maxNum; i++) {
                                    if ($scope.page.pageNum == i) {
                                        str += '<li class="active"><span>' + i + '</span></li>';
                                    } else {
                                        str += '<li><a href="javascript:void(0);">' + i + '</a></li>';
                                    }
                                }
                            }
                        }
                        if ($scope.page.pageNum < $scope.page.pages) {
                            str += '<li class="next"><a href="javascript:void(0)">下一页</a></li>';
                            str += '<li class="next"><a href="javascript:void(0)" style="margin-left:10px">末页</a></li>';
                        } else {
                            str += '<li class="next next-disabled"><span>下一页</span></li>';
                        }
                    } else {
                        var str = '';
                        $element.html(str);
                    }
                    str += '</ul>';
                    str += '<div class="totalPage" style="line-height:37px">共 <em>' + $scope.page.pages + '</em> 页</div>';
                    if ($scope.page.pageSize == 10) {
                        str += '<select class="form-control " style="display: inline-block;width:60px;vertical-align: top;margin:0 0 0 3px;height:34px;" ><option value="10" selected>10</option><option value="50">50</option><option value="100">100</option></select>';
                    } else if ($scope.page.pageSize == 50) {
                        str += '<select class="form-control " style="display: inline-block;width:60px;vertical-align: top;margin:0 0 0 3px;height:34px;" ><option value="10">10</option><option value="50" selected>50</option><option value="100">100</option></select>';
                    } else if ($scope.page.pageSize == 100) {
                        str += '<select class="form-control " style="display: inline-block;width:60px;vertical-align: top;margin:0 0 0 3px;height:34px;" ><option value="10">10</option><option value="50">50</option><option value="100" selected>100</option></select>';
                    }
                    $element.html(str);
                    $scope.bindEvent();
                    $scope.selectChange();
                };
                $scope.selectChange = function () {
                    $element.find('select').on('change', function () {
                        var pageSize = $(this).val();
                        $scope.page.pageNum = 1;
                        $scope.page.pageSize = pageSize;
                        $scope.list();
                        $scope.createHtml();
                    })
                };
                $scope.bindEvent = function () {
                    $element.find('a').parent().on('click', function () {
                        var text = $(this).children().html();
                        var pageNo = Number($scope.page.pageNum);
                        if ($.trim(text) == '上一页') {
                            $scope.page.pageNum = pageNo - 1;
                        } else if ($.trim(text) == '下一页') {
                            $scope.page.pageNum = pageNo + 1;
                        }
                        else if ($.trim(text) == '末页') {
                            $scope.page.pageNum = $scope.page.pages;
                        }
                        else if ($.trim(text) == '首页') {
                            $scope.page.pageNum = 1;
                        }
                        else {
                            $scope.page.pageNum = parseInt(text);
                        }
                        $scope.list();
                        $scope.createHtml();
                    });
                }
                $scope.$watch('page.pages', function (newVal, oldVal) {
                    if (newVal != oldVal) {
                        return $scope.createHtml();
                    }
                });
                $scope.$watch('page.pageNum', function (newVal, oldVal) {
                    var currentObj = $scope.page.url;
                    localStorage.setItem(currentObj, JSON.stringify($scope.page));
                    return $scope.createHtml();
                })
            }
        }
    }).directive('timerdown', ['$interval', function ($interval) {
        return {
            restrict: 'AE',
            transclude: true,
            replace: true,
            scope: {
                send: '=click',
                defaultSend: '='
            },
            link: function (scope, element, attrs) {
                scope.isClick = false;
                scope.timerText = '获取验证码';
                var time = null;
                scope.sendCode = function () {
                    if (!scope.isClick && scope.send()) {
                        var num = 60;
                        scope.isClick = true;
                        if (time) {
                            $interval.cancel(time);
                        }
                        time = $interval(function () {
                            num--;
                            if (num === 0) {
                                scope.timerText = '获取验证码';
                                $interval.cancel(time);
                                scope.isClick = false;
                            } else {
                                scope.timerText = num + '秒后获取';
                            }
                        }, 1000);
                    }
                };
                if (scope.defaultSend) {
                    scope.sendCode();
                }
            },
            template: '<div class="cell_ft"><button class="vcode_btn" type="button" ng-click="sendCode()" ng-disabled="isClick" ng-bind="timerText"></button></div>'
        }
    }]).directive('hideModal', function ($api) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                var vm = scope.vm;
                //submit
                vm.modifyPsd = function ($event) {
                    if (!vm.userPassword) {
                        layer.msg('请输入原密码');
                        return false;
                    }
                    if (!vm.userNewPassword) {
                        layer.msg('请输入新密码');
                        return false;
                    }
                    if (!vm.userNewPasswordConfirm) {
                        layer.msg('请再次输入新密码');
                        return false;
                    }
                    if (vm.userNewPasswordConfirm != vm.userNewPassword) {
                        layer.msg('两次输入的密码不一致');
                        return false;
                    }
                    var data = {
                        userPassword: hex_md5(vm.userPassword),
                        userNewPassword: hex_md5(vm.userNewPassword),
                        userNewPasswordConfirm: hex_md5(vm.userNewPasswordConfirm)
                    };
                    $api.post('/merchant/user/changePassword', data, function (res) {
                        if (res.result === 'success') {
                            $('#modifyPsd').modal('hide');
                            layer.msg('修改密码成功');
                        }
                    })
                };

                //当modal隐藏时清空输入框的值
                $('#modifyPsd').on('hidden.bs.modal', function () {
                    vm.userPassword = '';
                    vm.userNewPassword = '';
                    vm.userNewPasswordConfirm = '';
                    scope.$apply();
                })
            }
        }
    }).directive('showDelete', function () {
        return {
            restrict: 'AECM',
            replace: true,
            scope: true,
            link: function (scope, element, attrs) {
                element.bind("mouseenter", function (event) {
                    element.children('.deleteDiv').show();
                });
                element.bind('mouseleave', function () {
                    element.children('.deleteDiv').hide();
                })
            }
        }
    })
}());