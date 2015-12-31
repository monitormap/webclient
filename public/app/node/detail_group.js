'use strict';

angular.module('monitormapApp')
	.controller('DetailGroupCtrl', ['$scope','$stateParams','$rootScope','socket',function ($scope, $stateParams,$rootScope,socket) {
		$scope.obj = {};
		$scope.list = [];
		if($stateParams.name === 'global'){
			$scope.obj.name = 'global';
		}
		socket.emit('node:group:list',function(result){
			if(result.list){
				for(var i=0; i< result.list.length;i++){
					if(result.list[i].name===$stateParams.name){
						$scope.obj = result.list[i];
					}
				}
			}
		});
		socket.emit('node:list',function(result){
			$scope.list = result.list;
		});
		$scope.set = function(){
			socket.emit('node:set',$rootScope.passphrase,$scope.obj,function(){
			});
		};
	}]);
