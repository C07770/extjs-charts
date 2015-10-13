Ext.define('Ext.ux.chart.CommonLegendComponent', {
	alias : 'widget.commonlegend',
	extend : 'Ext.draw.Component',

	requires : [ 'Ext.ux.chart.CommonLegend' ],

	viewBox : false,
	animate : false,
	legend : false,
	insetPadding : 10,
	background : false,
	enginePriority : [ 'Svg', 'Vml' ],

	constructor : function(config) {
		var me = this, defaultAnim;

		config = Ext.apply({}, config);
		if (me.gradients) {
			Ext.apply(config, {
				gradients : me.gradients
			});
		}
		if (me.background) {
			Ext.apply(config, {
				background : me.background
			});
		}
		if (config.animate) {
			defaultAnim = {
				easing : 'ease',
				duration : 500
			};
			if (Ext.isObject(config.animate)) {
				config.animate = Ext.applyIf(config.animate, defaultAnim);
			} else {
				config.animate = defaultAnim;
			}
		}

		me.mixins.observable.constructor.call(me, config);
		me.callParent([ config ]);
	},

	initComponent : function() {
		var me = this;
		if (!me.height)
			me.height = 40;
		me.callParent();
	},

	drawLegend : function(chart, groupedCharts) {
		var me = this;
		me.chart = chart;
		me.groupedCharts = groupedCharts;

		// TODO: Different type of series might not support.. Check & Add fn
		// Steps might be needed: 1) destroy, 2) create new, 3) redraw/refresh
		if (me.legend !== false) {
			me.legend = new Ext.ux.chart.CommonLegend(Ext.applyIf({
				comLegendComp : me
			}, me.legend));
		}
		me.refresh();
	},

	refresh : function() {
		var me = this;

		if (me.rendered && me.curWidth !== undefined
				&& me.curHeight !== undefined) {
			if (!me.isVisible(true) && !me.refreshPending) {
				me.setShowListeners('mon');
				me.refreshPending = true;
				return;
			}
			if (me.fireEvent('beforerefresh', me) !== false) {
				me.redraw();
				me.fireEvent('refresh', me);
			}
		}
	},

	afterComponentLayout : function(width, height) {
		var me = this;
		if (Ext.isNumber(width) && Ext.isNumber(height)) {
			if (width !== me.curWidth || height !== me.curHeight) {
				me.curWidth = width;
				me.curHeight = height;
				me.redraw();
			} else if (me.needsRedraw) {
				delete me.needsRedraw;
				me.redraw();
			}
		}
		this.callParent(arguments);
	},

	redraw : function() {
		var me = this, comLegendCompBBox = me.comLegendCompBBox = {
			x : 0,
			y : 0,
			height : me.curHeight,
			width : me.curWidth
		}, legend = me.legend;
		me.surface.setSize(comLegendCompBBox.width, comLegendCompBBox.height);

		if (legend !== false && legend.visible) {
			if (legend.update || !legend.created) {
				legend.create(me.chart, me.groupedCharts);
			}
		}
		if (legend !== false && legend.visible) {
			legend.updatePosition();
		}
	},

	afterRender : function() {
		console.log('after render called..');
		var ref, me = this;
		this.callParent();

		if (me.surface.engine === 'Vml') {
			me.on('added', me.onAddedVml, me);
			me.mon(Ext.container.Container.hierarchyEventSource, 'added',
					me.onContainerAddedVml, me);
		}
	},

	// When using a vml surface we need to redraw when this component or one of
	// its ancestors is moved to a new container after render, because moving
	// the vml component causes the vml elements to go haywire, some displaing
	// incorrectly or not displaying at all.
	// This appears to be caused by the component being moved to the detached
	// body element before being added to the new container.
	onAddedVml : function() {
		this.needsRedraw = true;
	},

	onContainerAddedVml : function(container) {
		if (this.isDescendantOf(container)) {
			this.needsRedraw = true;
		}
	},

});