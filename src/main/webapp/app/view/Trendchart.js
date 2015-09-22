Ext.define('ERecon.view.Trendchart', {
	extend : 'Ext.chart.Chart',
	alias : 'widget.trendchart',

	store : 'Trendstore',
	shadow : true,
	animate : true,
	legend : {
		position : 'right'
	},
	insetPadding : 60,
	theme : 'CustomTheme',

	axes : [ {
		type : 'Numeric',
		minimum : 0,
		position : 'left',
		fields : [],
		grid : {
			odd : {
				opacity : 1,
				fill : '#ddd',
				stroke : '#bbb',
				'stroke-width' : 0.5
			}
		}
	}, {
		type : 'Category',
		position : 'bottom',
		fields : [ 'reconperiod' ],
		title : 'Recon Period'
	} ]
});