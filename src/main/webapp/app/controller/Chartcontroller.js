Ext.define('ERecon.controller.Chartcontroller', {
	extend : 'Ext.app.Controller',
	requires : [ 'ERecon.store.Trendstore', 'ERecon.model.Trendmodel',
			'ERecon.model.Piemodel', 'ERecon.store.Piestore' ],

	views : [ 'Trendchart', 'Piechart', 'CustomeLegend'],

	models : [ 'Piemodel', 'Trendmodel' ],
	stores : [ 'Piestore', 'Trendstore' ],

	refs : [ {
		ref : 'piechart',
		selector : 'piechart',
	}, {
		ref : 'trendchart',
		selector : 'trendchart',
	} , {
		ref : 'customelegend',
		selector : 'customelegend',
	} ],

	init : function() {
		this.chartloaded = 0;
		this.control({
			'viewport > container > panel > toolbar > button[action=renderChart]' : {
				click : this.renderChart
			},
			'piechart' : {
				// legendItemMouseOver : this.onLegendItemMouseOver
			},
			'trendchart' : {
				// legendItemMouseOver : this.onLegendItemMouseOver
			},
			scope : this
		});
	},
	
	onLegendItemMouseOver : function(legendIndex, b, c) {
		debugger;
		var pieChart = this.getPiechart();
		var trendChart = this.getTrendchart();
		var pieChartLegend = pieChart.legend.items[legendIndex];
		var trendChartLegend = trendChart.legend.items[legendIndex];
		var pieChartSprite = pieChartLegend.items[0];
		var trendChartSprite = trendChartLegend.items[0];
		
		// var trendChartSeries = trendChart.series.items[legendIndex];
		// trendChartSeries.highlightItem();
		
		// pieChartSprite.fireEvent("mousedown");
		trendChartSprite.fireEvent("mouseover");
		// nextLegendItemsSprites[0].fireEvent("mouseover");
		// sprite.relayEvents(nextLegendItemsSprites[0], ['click', 'mousedown',
		// 'mouseout', 'mouseover', 'mouseup']);
	},

	renderChart : function() {
		this.renderPieChart();
		this.renderTrendChart();
	},
	
	renderLegends : function() {
		this.chartloaded = 0;
		var chartContainer  = Ext.ComponentQuery.query('viewport > container[itemId=chartcontainer]')[0];
		var legendContainer = Ext.ComponentQuery.query('viewport > container > container[itemId=commonlegend]')[0];
		chartContainer.remove(legendContainer);
		var pieChart = this.getPiechart();
		var trendChart = this.getTrendchart();
		var data = pieChart.series.items[0].yField;
		legendContainer = Ext.create('ERecon.view.CustomeLegend', {
			itemId : 'commonlegend',
			xtype : 'customelegend',
			data: data,
			multiSeries : [ pieChart.series, trendChart.series ],
			padding : '5 150 20 200', 
		});
		chartContainer.add(legendContainer);
	},

	renderPieChart : function() {
		var me = this;
		var pieChart = this.getPiechart();
		// pieChart.series.clear();
		// pieChart.surface.removeAll();
		
		var pieChartStore = this.getPiestoreStore();
		this.requestData('piedata', function(chartData) {
			chartData = Ext.Array.sort(chartData, function(o1, o2) {
				return o1.description < o2.description ? -1 : (o1.description > o2.description ? 1 : 0);
			});
		
			pieChartStore.loadData(chartData);
			pieChart.setLoading(false);
			pieChart.setVisible(true);
			me.chartloaded++;
			if(me.chartloaded === 2) 
				me.renderLegends();
		});
	},

	renderTrendChart : function() {
		var me = this;
		var trendChart = this.getTrendchart();
		trendChart.series.clear();
		trendChart.surface.removeAll();
		
		this.requestData('trenddata', function(chartData) {
			var trendLines = new Array();
			for (var i = 0; i < chartData.length; i++) {
				var chartDataKeys = Object.keys(chartData[i]).sort();
				for ( var e = 0; e < chartDataKeys.length; e++) {
					var entityName = chartDataKeys[e];
					if (entityName !== 'reconperiod') {
						var line = {
							type : 'line',
							axis : 'left',
							xField : 'reconperiod',
							yField : entityName,
							title : entityName,
							fill : false,
							style : {
								opacity : 1,
								'stroke-width' : 2
							},
							highlight : {
								size : 7,
								radius : 7
							},
							tips: {
								entityName: entityName,
				                trackMouse: true,
				                renderer: function(storeItem, item) {
				                    this.update(this.entityName +' (' + storeItem.get(this.entityName)+ ')');
				                }
				            },
						};

						if (!Ext.Array.contains(trendLines, entityName)) {
							trendChart.series.add(line)
							trendLines.push(entityName);
						}
						
						var modelFields = trendChart.getStore().getProxy().getModel().prototype.fields.keys;
						if(!Ext.Array.contains(modelFields, entityName)) {
							trendChart.getStore().getProxy().getModel().prototype.fields.add(Ext.create('Ext.data.Field', { name: entityName }));
						}
					}
				}
			}
			
			trendChart.getStore().loadData(chartData);
			trendChart.setLoading(false);
			me.chartloaded++;
			if(me.chartloaded === 2) 
				me.renderLegends();
		});
		trendChart.redraw();
	},

	requestData : function(requestedData, callback) {
		var me = this;
		Ext.Ajax.request({
			url : 'http://localhost:8080/sampledata/' + requestedData
					+ '.json',
			success : function(response, opts) {
				var data = Ext.decode(response.responseText);
				callback(data.result, me);
			},
			failure : function(response, opts) {
				console.log('server-side failure with status code '
						+ response.status);
			}
		});
	}
});
