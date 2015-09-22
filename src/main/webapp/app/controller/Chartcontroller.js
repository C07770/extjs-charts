Ext.define('ERecon.controller.Chartcontroller', {
	extend : 'Ext.app.Controller',
	requires : [ 'ERecon.store.Trendstore', 'ERecon.model.Trendmodel',
			'ERecon.model.Piemodel', 'ERecon.store.Piestore' ],

	views : [ 'Trendchart', 'Piechart' ],

	models : [ 'Piemodel', 'Trendmodel' ],
	stores : [ 'Piestore', 'Trendstore' ],

	refs : [ {
		ref : 'piechart',
		selector : 'piechart',
	}, {
		ref : 'trendchart',
		selector : 'trendchart',
	} ],

	init : function() {
		this.control({
			'viewport > panel > toolbar > button[action=renderChart]' : {
				click : this.renderChart
			},
			scope : this
		});
	},

	renderChart : function() {
		this.renderPieChart();
		this.renderTrendChart();
	},

	renderPieChart : function() {
		var pieChart = this.getTrendchart();
		pieChart.series.clear();
		pieChart.surface.removeAll();
		
		var pieChartStore = this.getPiestoreStore();
		this.requestData('piedata', function(chartData) {
			chartData = Ext.Array.sort(chartData, function(o1, o2) {
				return o1.description < o2.description ? -1 : (o1.description > o2.description ? 1 : 0);
			});
		
			pieChartStore.loadData(chartData);
			pieChart.setLoading(false);
			pieChart.setVisible(true);
		});
	},

	renderTrendChart : function() {
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
		});
		trendChart.redraw();
	},

	requestData : function(requestedData, callback) {
		Ext.Ajax.request({
			url : 'http://localhost:8080/sampledata/' + requestedData
					+ '.json',
			success : function(response, opts) {
				var data = Ext.decode(response.responseText);
				callback(data.result);
			},
			failure : function(response, opts) {
				console.log('server-side failure with status code '
						+ response.status);
			}
		});
	}
});
