'use strict';

angular.module('monitormapApp')
	.controller('ListCtrl', ['$scope','$rootScope','socket','config',function ($scope, $rootScope,socket,config) {
		$scope.list = [];
		var load = function(){
			socket.emit('node:list',function(result){
				$scope.list = result.list;
			});
		};
		load();
		$scope.status = function(a){
			if(new Date(a).getTime() > new Date(new Date().getTime() - config.offlineTime).getTime()){
				return true;
			}
			return false;
		};
		$scope.count = function(a){
			var c=0;
			if($scope.list){
				for(var i=0; i< $scope.list.length;i++){
					c+=$scope.list[i][a];
				}
			}
			return c;
		};
		$scope.set = function(obj){
			socket.emit('node:set',$rootScope.passphrase,obj,function(){
				load();
			});
		};
	}]);
