angular.module('config', [])
	.factory('config',function(){
		return {
			"HOST":"http://localhost:8080",
			"RRD":"http://localhost:8081/data",
			"offlineTime":5*60*1000
			}
	})
