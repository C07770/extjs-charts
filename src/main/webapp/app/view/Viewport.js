Ext.define('ERecon.view.Viewport', {
	extend : 'Ext.container.Viewport',

	requires : [ 'ERecon.view.Piechart', 'ERecon.view.Trendchart',
			'ERecon.view.CommonLegend', 'Ext.ux.chart.CommonLegendComponent' ],

	items : [ {
		itemId : 'chartcontainer',
		xtype : 'container',
		layout : {
			type : 'vbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'panel',
			layout : 'column',
			padding : '5 5 5 5',
			items : [ {
				xtype : 'piechart',
				columnWidth : .5,
				title : 'Pei Chart',
				margin : '0 5 0 0',
				widhth : 300,
				height : 600
			}, {
				xtype : 'trendchart',
				columnWidth : .5,
				title : 'Trend Chart',
				widhth : 300,
				height : 600
			} ],
			tbar : [ {
				xtype : 'button',
				text : 'Render Chart',
				action : 'renderChart'
			} ]
		}/*, {
			xtype : 'commonLegendComponent',
			id : 'commonlegend',
			legend : {
				position : 'top'
			},
			height : 200
		}, {
			itemId : 'commonlegend',
			xtype : 'commonlegend',
			data : [],
			padding : '5 150 20 200',
		} */]
	} ]
});