(function() {
	'use strict';
	angular.module('app.controllers')
		.controller('notFoundController', ['$api','$timeout', function($api,$timeout) {
		    var vm = this;
            $timeout(function(){
                // homeMenu();
            },100)
        }])
}());