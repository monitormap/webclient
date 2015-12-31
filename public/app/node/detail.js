'use strict';

angular.module('monitormapApp')
	.controller('DetailCtrl', ['$scope','$stateParams','$rootScope','socket',function ($scope, $stateParams,$rootScope,socket) {
		$scope.obj = {};
		var load = function(){
			socket.emit('node:list',function(result){
				if(result.list){
					for(var i=0; i< result.list.length;i++){
						if(result.list[i].mac===$stateParams.mac){
							$scope.obj = result.list[i];
						}
					}
				}
			});
		};
		load();
		$scope.set = function(){
			socket.emit('node:set',$rootScope.passphrase,$scope.obj,function(){
				load();
			});
		};
	}]);
