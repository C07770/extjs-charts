Ext.define('ERecon.theme.ChartTheme', {
	extend : 'Ext.chart.theme.Base',
	constructor : function(config) {
		this.callParent([ Ext.apply({
			colors : [ "#800080", "#000080", "#FF00FF", "#00FFFF", "#008080",
					"#0000FF", "#008000", "#808000", "#00FF00", "#FFFF00",
					"#800000", "#000000", "#FF0000" ]
		}, config) ]);
	}
});