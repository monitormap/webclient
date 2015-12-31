'use strict';

angular.module('monitormapApp')
.directive('rrd', function (config) {
	var uniqueId = 1;

	return {
		restrict: 'E',
		transclude: true,
		scope: {
			path:'@'
		},
		link:function(scope, element){
			var ID = 'rrd' + uniqueId++;
			element.attr('id' ,ID);
			var rrdData = null;
			
			function rrdHandler(bf) {
				var iRrdData = null;
				try {
					iRrdData = new RRDFile(bf);
				} catch (err) {
					alert('File is not a valid RRD archive!');
				}
				if (iRrdData !== null) {
					rrdData = iRrdData;
					renderGraph();
				}
			}

			try {
				FetchBinaryURLAsync(config.RRD+scope.path, rrdHandler);
			} catch (err) {
				alert('Failed loading rrd\n' + err);
				console.log(config.RRD+scope.path);
			}

			function renderGraph() {
				var f = new rrdFlot(ID, rrdData, {
					legend: { noColumns: 6 },
					lines: { show:true },
					yaxis: { autoscaleMargin: 0.20},
					tooltip: true,
					tooltipOpts: { content: '<h4>%s</h4> Value: %y.3 - %x' },
				},{}, {
					graph_only: false,
					num_cb_rows: 9,
					use_element_buttons: true,
					multi_ds: false,
					multi_rra: true,
					use_rra: false,
					rra: 0,
					use_checked_DSs: false,
					checked_DSs: [],
					use_windows: false,
					graph_width: '700px',
					graph_height: '300px',
					scale_width: '350px',
					scale_height: '200px'
				});
				$('#graph_time_sel').val('+2');
				f.callback_timezone_changed();
				f.scale.clearSelection();
			}
		}
	};
});
