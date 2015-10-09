Ext.Loader.setPath('Ext.ux', '../ux');

Ext.define('Ext.chart.theme.CustomTheme',{
	extend : 'Ext.chart.theme.Base',
	constructor : function(config) {
		var colors = [ "#800080", "#000080", "#FF00FF",
				"#00FFFF", "#008080", "#0000FF", "#008000",
				"#808000", "#00FF00", "#FFFF00", "#800000",
				"#000000", "#FF0000", "#CC6666" ];

		var markerThemes = [], seriesThemes = [];
		for (var i = 0; i < colors.length; i++) {
			var color = colors[i], markerTheme = {}, seriesTheme = {};

			markerTheme.type = (i + 1) % 4 == 0 ? 'diamond'
					: (i + 1) % 3 == 0 ? 'cross'
							: (i + 1) % 2 == 0 ? 'plus'
									: 'circle';
			markerTheme.fill = seriesTheme.fill = markerTheme.stroke = seriesTheme.stroke = color;
			markerThemes[i] = markerTheme;
			seriesThemes[i] = seriesTheme;
		}

		this.callParent([ Ext.apply({
			colors : colors,
			markerThemes : markerThemes,
			seriesThemes : seriesThemes
		}, config) ]);
	}
});

Ext.chart.LegendItem.override({
	onMouseOver : function(e, t, eOpts) {
		//this.callParent(arguments);
		this.legend.chart.fireEvent('legendItemMouseOver', this.label.text, this.yFieldIndex, e, t, eOpts);
	}
});

Ext.application({
	name : 'ERecon',
	appFolder : 'app',

	autoCreateViewport : true,

	controllers : [ 'Chartcontroller' ]
});