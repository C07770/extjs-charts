Ext.define('ERecon.view.CustomeLegend', {
	extend : 'Ext.container.Container',
	alias : 'widget.customelegend',

	layout : 'column',

	defaults : {
		width : 150,
		height : 20
	},

	initComponent : function() {
		this.items = [];

		var data = this.data;
		var colors = [ "#800080", "#000080", "#FF00FF", "#00FFFF", "#008080",
				"#0000FF", "#008000", "#808000", "#00FF00", "#FFFF00",
				"#800000", "#000000", "#FF0000", "#CC6666" ];
		var c = 0;
		for (var i = 0; i < data.length; i++) {
			c = c <= i ? i : 0;
			this.items[i] = this.createLegendItem(i, data[i], colors[c], this)
		}

		this.callParent(arguments);
	},

	createLegendItem : function(legendIndex, label, color, me) {
		return {
			xtype : 'container',
			legendIndex : legendIndex,
			layout : 'hbox',
			items : [ {
				xtype : 'box',
				width : 12,
				height : 12,
				style : {
					color : color,
					backgroundColor : color,
					cursor: 'pointer'
				},
				listeners : {
					render : function(e) {
						me.addMouseEvents(e, legendIndex, me.multiSeries);
					},
					scope : this
				}
			}, {
				xtype : 'label',
				flex : 1,
				margin : '0 0 0 5',
				text : label,
				style : {
					'font-size' : '12px',
					cursor : 'pointer'
				},
				listeners : {
					render : function(e) {
						me.addMouseEvents(e, legendIndex, me.multiSeries);
					},
					scope : this
				}
			} ]
		};
	},

	addMouseEvents : function(e, legendIndex, multiSeries) {
		e.el.on('click', function(ev, ed, eo) {
			var label = this.next() ? this.next() : this;
			label.setStyle({
				'font-weight': 'normal'
			});

			var compo = null;
			var label = null;  
			if(this.next()) {
				compo = Ext.getCmp(this.id);
				label = Ext.getCmp(this.next().id);
			} else {
				compo = Ext.getCmp(this.prev().id);
				label = Ext.getCmp(this.id);
			}

			
			Ext.each(multiSeries, function(series) {
				var series = (series.items[0].type === 'pie') ? series.items[0].items[legendIndex].series : series.items[legendIndex];
				if (!this.toggle) {
					series.hideAll(legendIndex);
					compo.setDisabled(true);
					label.setDisabled(true);
				} else {
					series.showAll(legendIndex);
					compo.setDisabled(false);
					label.setDisabled(false);
				}
				this.toggle = !this.toggle;
			});
		});
		e.el.on('mouseover', function(ev, ed) {
			var label = this.next() ? this.next() : this;
			label.setStyle({
                'font-weight': 'bold'
            });
			Ext.each(multiSeries, function(series) {
				if(series.items[0].type === 'pie') {
					series.items[0].items[legendIndex].series._index = legendIndex;
					series.items[0].items[legendIndex].series.highlightItem();
				} else {
					series.items[legendIndex]._index = legendIndex;
					series.items[legendIndex].highlightItem();
				}
			});
		});
		e.el.on('mouseout', function(ev, ed) {
			var label = this.next() ? this.next() : this;
			label.setStyle({
                'font-weight': 'normal'
            });
			Ext.each(multiSeries, function(series) {
				if(series.items[0].type === 'pie') {
					series.items[0].items[legendIndex].series._index = legendIndex;
					series.items[0].items[legendIndex].series.unHighlightItem();
				} else {
					series.items[legendIndex]._index = legendIndex;
					series.items[legendIndex].unHighlightItem();
				}
			});
		});
	}
});
