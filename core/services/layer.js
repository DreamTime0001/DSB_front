(function() {
	var layer_loading_html, layer_html, layer_confirm_html, scope;
	'use strict';
	angular.module('app.layer', [])
		.factory('$layer', ['$timeout', '$compile', '$rootScope', function($timeout, $compile, $rootScope) {
			scope = $rootScope.$new();
			scope.showLoading = false;
			scope.showLayer = false;
			scope.showConfirm = false;
			scope.layerType = { text: false, success: false };

			layer_loading_html = $compile('<div class="mask_transparent" ng-show="showLoading"></div><div class="toast toast_loading toast_visible" ng-show="showLoading"><i class="icon_toast"></i><p class="toast_content">{{loadingMsg}}</p></div>')(scope);
			angular.element('body').append(layer_loading_html);

			layer_html = $compile('<div class="mask_transparent" ng-show="showLayer"></div><div ng-show="showLayer" class="toast toast_visible" ng-class="{toast_success: layerType.success, toast_text: layerType.text}"><i class="icon_toast"></i><p class="toast_content">{{layerMsg}}</p></div>')(scope);
			angular.element('body').append(layer_html);

			var html = '<div class="mask mask_visible" ng-show="showConfirm"></div>';
			html += '<div class="dialog dialog_visible" ng-show="showConfirm">';
			html += '<div class="dialog_hd">';
			html += '<strong class="dialog_title" ng-if="confirmOptions.title">{{confirmOptions.title}}</strong>';
			html += '</div>';
			html += '<div class="dialog_bd">{{confirmOptions.msg}}</div>';
			html += '<div class="dialog_ft">';
			html += '<a href="javascript:;" class="dialog_btn default" ng-click="$confirmCancel()" ng-if="confirmOptions.showCancel">取消</a>';
			html += '<a href="javascript:;" class="dialog_btn" ng-click="$confirmSuccess()">确定</a>';
			html += '</div></div>';
			layer_confirm_html = $compile(html)(scope);

            var confirmOptions = {
                title: '提示',
                showCancel: true,
                success: function () {
                },
                cancel: function () {
                },
                msg: ''
            };
            scope.$confirmSuccess = function () {
                if (confirmOptions.success && angular.isFunction(confirmOptions.success)) {
                    console.log(confirmOptions);
                    confirmOptions.success();
                }
                scope.showConfirm = false;
            };
            scope.$confirmCancel = function () {
                if (confirmOptions.cancel && angular.isFunction(confirmOptions.cancel)) {
                    confirmOptions.cancel();
                }
                scope.showConfirm = false;
            };
			angular.element('body').append(layer_confirm_html);

			return {
				loading: function(msg) {
					this.close();
					scope.showLoading = true;
					scope.loadingMsg = msg || '加载中...';
				},

				close: function() {
					scope.showLoading = false;
					scope.showLayer = false;
					scope.showConfirm = false;
					scope.layerType = { text: false, success: false };
				},

				tip: function(msg, delay) {
					var _this = this;
					_this.close();
					if(msg) {
						scope.layerMsg = msg;
						scope.showLayer = true;
                        scope.layerType = {text: true, success: false};
						$timeout(function() {
							_this.close();
						}, (delay || 1000))
					}
				},

				showSuccess: function(msg, delay) {
					var _this = this;
					_this.close();
					scope.layerMsg = msg;
					scope.showLayer = true;
                    scope.layerType = {text: false, success: true};
					$timeout(function() {
						_this.close();
					}, (delay || 1500))
				},

				confirm: function(opt) {
					var _this = this;
					_this.close();
					if(opt && opt.msg) {
						scope.confirmOptions = angular.extend({}, confirmOptions, opt);
						scope.showConfirm = true;
					}
				}
			}
		}])
}());