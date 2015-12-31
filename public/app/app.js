'use strict';

angular.module('monitormapApp', [
	'config',
	'ui.router',
	'btford.socket-io',
	'leaflet-directive',
	'tableSort'
])
	.config(['$urlRouterProvider',function ($urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
	}])
	.factory('socket', function (socketFactory,config) {
		return socketFactory({
			prefix: '',
			ioSocket: io.connect(config.HOST,{path:'/ws'})
		});
	});
