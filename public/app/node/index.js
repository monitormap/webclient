'use strict';

angular.module('monitormapApp')
	.config(['$stateProvider',function ($stateProvider) {
		$stateProvider
			.state('node', {
				url:'/node',
				templateUrl: 'app/node/index.html'
			})
			.state('node.list', {
				url:'/list',
				templateUrl: 'app/node/list.html',
				controller:'ListCtrl'
			})
			.state('node.detail', {
				url:'/detail/:mac',
				templateUrl: 'app/node/detail.html',
				controller:'DetailCtrl'
			})
			.state('node.group', {
				url:'/group',
				templateUrl: 'app/node/list_group.html',
				controller:'GroupCtrl'
			})
			.state('node.detailgroup', {
				url:'/group/:name',
				templateUrl: 'app/node/detail_group.html',
				controller:'DetailGroupCtrl'
			})
			.state('node.new', {
				url:'/new',
				templateUrl: 'app/node/list.html',
				controller:'NewCtrl'
			});
	}]);
