'use strict';

angular.module('monitormapApp')
	.controller('PassphraseCtrl', ['$scope','$rootScope',function ($scope,$rootScope) {
		$scope.newPassphrase = '*';

		$scope.set = function(){
			$rootScope.passphrase = $scope.newPassphrase;
		};
	}]);
