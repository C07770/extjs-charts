Ext.define('ERecon.view.Piechart', {
	extend : 'Ext.chart.Chart',
	alias : 'widget.piechart',

	store : 'Piestore',
	shadow : true,
	animate : true,
	legend : false,
	insetPadding : 60,
	theme : 'CustomTheme',

	series : [ {
		type : 'pie',
		field : 'fkcount',
		showInLegend : true,
		donut : false,
		tips : {
			trackMouse : true,
			renderer : function(storeItem, item) {
				var total = 0;
				for (var i = 0; i < item.series.items.length; i++) {
					total += item.series.items[i].slice.value;
				}

				this.update(storeItem.get('description') + ' ('
						+ Math.round(storeItem.get('fkcount') / total * 100)
						+ '%)');
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