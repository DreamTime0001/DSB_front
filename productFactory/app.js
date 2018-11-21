(function() {
	'use strict';
	//'app.directives', 'app.services', 'app.controllers', 'app.config', 'app.filters', 'app.util'
	var app = angular.module('app', ['ui.bootstrap', 'ngCookies', 'ui.router', 'app.config', 'app.services', 'app.directives', 'app.controllers', 'app.util', 'app.layer','oc.lazyLoad','ngSanitize'], function($httpProvider) {
		$httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
		$httpProvider.defaults.withCredentials = true;
		// Override $http service's default transformRequest
		$httpProvider.defaults.transformRequest = [function(data) {
			/**
			 * The workhorse; converts an object to x-www-form-urlencoded serialization.
			 * @param {Object} obj
			 * @return {String}
			 */
			var param = function(obj) {
				var query = '';
				var name, value, fullSubName, subName, subValue, innerObj, i;
				for(name in obj) {
					value = obj[name];
					if(value instanceof Array) {
						for(i = 0; i < value.length; ++i) {
							subValue = value[i];
							fullSubName = name + '[' + i + ']';
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += param(innerObj) + '&';
						}
					} else if(value instanceof Object) {
						for(subName in value) {
							subValue = value[subName];
//							fullSubName = name + '[' + subName + ']';
							fullSubName = name + '.' + subName;
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += param(innerObj) + '&';
						}
					} else if(value !== undefined && value !== null) {
						query += encodeURIComponent(name) + '=' +
							encodeURIComponent(value) + '&';
					}
				}
				return query.length ? query.substr(0, query.length - 1) : query;
			};
			return angular.isObject(data) && String(data) !== '[object File]' ?
				param(data) :
				data;
		}];
	});


	// 声名相应的模块
	angular.module('app.controllers', ['app.config', 'app.services', 'app.directives', 'ngCookies']);
}());