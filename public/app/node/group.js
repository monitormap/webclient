'use strict';

angular.module('monitormapApp')
	.controller('GroupCtrl', ['$scope','$rootScope','socket',function ($scope, $rootScope, socket) {
		$scope.list = [];
		$scope.glist = [];
		var emptyEntry = {new:false};
		$scope.obj = emptyEntry;


		$scope.setObj = function(item){
			item = JSON.parse(JSON.stringify(item));
			$scope.obj = item;
		};
		socket.emit('node:list',function(result){
			$scope.list = result.list;
		});
		var load = function(){
			socket.emit('node:group:list',function(result){
				$scope.glist = result.list;
			});
		};
		load();
		$scope.set = function(){
			socket.emit('node:group:set',$rootScope.passphrase,$scope.obj,function(result){
				if(result.s){
					$scope.setObj(emptyEntry);
				}
				load();
			});
		};
	}]);
