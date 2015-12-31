'use strict';

angular.module('monitormapApp')
.directive('dropdown', function ($timeout) {
	return {
		restrict: 'C',
		link: function (scope, elm, attr) {
			if( (attr.class).indexOf('ui') >= 0 ){
				$timeout(function () {
					$(elm).dropdown().dropdown('setting', {
						onChange: function (value) {
							scope.$parent[attr.ngModel] = value;
							scope.$parent.$apply();
						}
					});
				}, 0);
			}
		}
	};
});
