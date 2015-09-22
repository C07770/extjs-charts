Ext.define('ERecon.view.Piechart', {
	extend : 'Ext.chart.Chart',
	alias : 'widget.piechart',

	store : 'Piestore',
	shadow : true,
	animate : true,
	legend : {
		position : 'left'
	},
	insetPadding : 60,
	theme : 'CustomTheme',

	series : [ {
		type : 'pie',
		field : 'fkcount',
		showInLegend : true,
		donut : true,
		tips : {
			trackMouse : true,
			renderer : function(storeItem, item) {

			}
		},
		highlight : {
			segment : {
				margin : 20
			}
		},
		label : {
			field : 'description',
			display : 'rotate',
			contrast : true,
			font : '11px Arial'
		}
	} ]
});