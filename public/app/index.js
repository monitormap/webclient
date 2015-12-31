'use strict';

angular.module('monitormapApp')
	.config(['$stateProvider',function ($stateProvider) {
		$stateProvider
			.state('passphrase', {
				url:'/passphrase',
				templateUrl: 'app/passphrase.html',
				controller:'PassphraseCtrl'
			});
	}]);
