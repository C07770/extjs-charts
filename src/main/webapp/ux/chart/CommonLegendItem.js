Ext.define('Ext.ux.chart.CommonLegendItem', {
    extend: 'Ext.draw.CompositeSprite',
    requires: ['Ext.chart.Shape'],

    x: 0,
    y: 0,
    zIndex: 500,

    boldRe: /bold\s\d{1,}.*/i,

    constructor: function(config) {
        this.callParent(arguments);
        this.createLegend(config);
    },

    createLegend: function(config) {
        var me = this,
            index = config.yFieldIndex,
            series = me.series,
            seriesType = series.type,
            idx = me.yFieldIndex,
            legend = me.legend,
            surface = me.surface,
            refX = legend.x + me.x,
            refY = legend.y + me.y,
            bbox, z = me.zIndex,
            markerConfig, label, mask,
            radius, toggle = false,
            seriesStyle = Ext.apply(series.seriesStyle, series.style);

        function getSeriesProp(name) {
            var val = series[name];
            return (Ext.isArray(val) ? val[idx] : val);
        }
        
        label = me.add('label', surface.add({
            type: 'text',
            x: 20,
            y: 0,
            zIndex: (z || 0) + 2,
            fill: legend.labelColor,
            font: legend.labelFont,
            text: getSeriesProp('title') || getSeriesProp('yField'),
            style: {
                'cursor': 'pointer'
            }
        }));

        me.add('box', surface.add({
            type: 'rect',
            zIndex: (z || 0) + 2,
            x: 0,
            y: 0,
            width: 12,
            height: 12,
            fill: series.getLegendColor(index),
            style: {
                cursor: 'pointer'
            }
        }));
        
        me.setAttributes({
            hidden: false
        }, true);
        
        bbox = me.getBBox();
        
        mask = me.add('mask', surface.add({
            type: 'rect',
            x: bbox.x,
            y: bbox.y,
            width: bbox.width || 20,
            height: bbox.height || 20,
            zIndex: (z || 0) + 1,
            fill: me.legend.boxFill,
            style: {
                'cursor': 'pointer'
            }
        }));

        me.on('mouseover', function() {
            label.setStyle({
                'font-weight': 'bold'
            });
            mask.setStyle({
                'cursor': 'pointer'
            });
            series._index = index;
            series.highlightItem();
            me.onGroupedChartMouseEvent("mouseover", index);
        }, me);

        me.on('mouseout', function() {
            label.setStyle({
                'font-weight': legend.labelFont && me.boldRe.test(legend.labelFont) ? 'bold' : 'normal'
            });
            series._index = index;
            series.unHighlightItem();
            me.onGroupedChartMouseEvent("mouseout", index);
        }, me);
        
        if (!series.visibleInLegend(index)) {
            toggle = true;
            label.setAttributes({
               opacity: 0.5
            }, true);
        }

        me.on('mousedown', function() {
            if (!toggle) {
                series.hideAll(index);
                label.setAttributes({
                    opacity: 0.5
                }, true);
            } else {
                series.showAll(index);
                label.setAttributes({
                    opacity: 1
                }, true);
            }
            toggle = !toggle;
            me.legend.chart.redraw();
            me.onGroupedChartMouseEvent("mousedown", index);
        }, me);
        me.updatePosition({x:0, y:0}); 
    },
    
    onGroupedChartMouseEvent : function(eventName, _index) {
    	var me = this;
    	if(me.legend.groupedCharts) {
        	for (var i = 0; i < me.legend.groupedCharts.length; i++) {
        		var gChartSprite = me.legend.groupedCharts[i].legend.items[_index].items[0]
        		gChartSprite.fireEvent(eventName);
			}
        }
    },

    updatePosition: function(relativeTo) {
        var me = this,
            items = me.items,
            ln = items.length,
            i = 0,
            item;
        if (!relativeTo) {
            relativeTo = me.legend;
        }
        for (; i < ln; i++) {
            item = items[i];
            switch (item.type) {
                case 'text':
                    item.setAttributes({
                        x: 20 + relativeTo.x + me.x,
                        y: relativeTo.y + me.y
                    }, true);
                    break;
                case 'rect':
                    item.setAttributes({
                        translate: {
                            x: relativeTo.x + me.x,
                            y: relativeTo.y + me.y - 6
                        }
                    }, true);
                    break;
                default:
                    item.setAttributes({
                        translate: {
                            x: relativeTo.x + me.x,
                            y: relativeTo.y + me.y
                        }
                    }, true);
            }
        }
    }
});