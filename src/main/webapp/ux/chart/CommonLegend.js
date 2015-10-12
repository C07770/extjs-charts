Ext.define('Ext.ux.chart.CommonLegend', {
    requires: ['Ext.ux.chart.CommonLegendItem'],

    visible: true,
    update: true,
    position: 'bottom',
    x: 0,
    y: 0,
    labelColor: '#000',
    labelFont: '12px Helvetica, sans-serif',
    boxStroke: '#000',
    boxStrokeWidth: 1,
    boxFill: '#FFF',
    itemSpacing: 10,
    padding: 5,
    width: 0,
    height: 0,
    boxZIndex: 100,

    constructor: function(config) {
        var me = this;
        if (config) {
            Ext.apply(me, config);
        }
        me.items = [];
 
        me.isVertical = ("left|right|float".indexOf(me.position) !== -1);

        // cache these here since they may get modified later on
        me.origX = me.x;
        me.origY = me.y;
    },

    create: function(chart) {
        var me = this, i, ln, series;
	        me.chart = chart;
            seriesItems = me.chart.series.items;

        me.createBox();
        
        if (me.rebuild !== false) {
            me.createItems();
        }
    },


    isDisplayed: function() {
    	return this.visible;
    },

    createItems: function() {
        var me = this,
            chart = me.chart,
            comLegendComp = me.comLegendComp,
            seriesItems = chart.series.items,
            ln, series,
            surface = chart.surface,
            items = me.items,
            padding = me.padding,
            itemSpacing = me.itemSpacing,
            spacingOffset = 2,
            maxWidth = 0,
            maxHeight = 0,
            totalWidth = 0,
            totalHeight = 0,
            vertical = me.isVertical,
            math = Math,
            mfloor = math.floor,
            mmax = math.max,
            index = 0,
            i = 0,
            len = items ? items.length : 0,
            x, y, spacing, item, bbox, height, width,
            fields, field, nFields, j;

        //remove all legend items
        if (len) {
            for (; i < len; i++) {
                items[i].destroy();
            }
        }
        //empty array
        items.length = [];
        
        // Create all the item labels, collecting their dimensions and positioning each one
        // properly in relation to the previous item
        for (i = 0, ln = seriesItems.length; i < ln; i++) {
            series = seriesItems[i];
            fields = [].concat(series.yField);
            for (j = 0, nFields = fields.length; j < nFields; j++) {
                field = fields[j];
                item = new Ext.ux.chart.CommonLegendItem({
                    legend: this,
                    series: series,
                    surface: comLegendComp.surface,
                    yFieldIndex: j
                });
                bbox = item.getBBox();

                //always measure from x=0, since not all markers go all the way to the left
                width = bbox.width;
                height = bbox.height;

                if (i + j === 0) {
                    spacing = vertical ? padding + height / 2 : padding;
                }
                else {
                    spacing = itemSpacing / (vertical ? 2 : 1);
                }
                // Set the item's position relative to the legend box
                item.x = mfloor(vertical ? padding : totalWidth + spacing);
                item.y = mfloor(vertical ? totalHeight + spacing : padding + height / 2);

                // Collect cumulative dimensions
                totalWidth += width + spacing;
                totalHeight += height + spacing;
                maxWidth = mmax(maxWidth, width);
                maxHeight = mmax(maxHeight, height);

                items.push(item);
            }
        }

        // Store the collected dimensions for later
        me.width = mfloor((vertical ? maxWidth : totalWidth) + padding * 2);
        if (vertical && items.length === 1) {
            spacingOffset = 1;
        }
        me.height = mfloor((vertical ? totalHeight - spacingOffset * spacing : maxHeight) + (padding * 2));
        me.itemHeight = maxHeight;
    },

    getBBox: function() {
        var me = this;
        return {
            x: Math.round(me.x) - me.boxStrokeWidth / 2,
            y: Math.round(me.y) - me.boxStrokeWidth / 2,
            width: me.width,
            height: me.height
        };
    },

    createBox: function() {
        var me = this,
            box, bbox;

        if (me.boxSprite) {
            me.boxSprite.destroy();
        }

        bbox = me.getBBox();
        //if some of the dimensions are NaN this means that we
        //cannot set a specific width/height for the legend
        //container. One possibility for this is that there are
        //actually no items to show in the legend, and the legend
        //should be hidden.
        if (isNaN(bbox.width) || isNaN(bbox.height)) {
            me.boxSprite = false;
            return;
        }
        
        box = me.boxSprite = me.comLegendComp.surface.add(Ext.apply({
            type: 'rect',
            stroke: me.boxStroke,
            "stroke-width": me.boxStrokeWidth,
            fill: me.boxFill,
            zIndex: me.boxZIndex
        }, bbox));

        box.redraw();
    },

    updatePosition: function() {
        var me = this,
            items = me.items,
            i, ln,
            x, y,
            legendWidth = me.width || 0,
            legendHeight = me.height || 0,
            padding = me.padding,
            comLegendComp = me.comLegendComp,
            comLegendCompBBox = comLegendComp.comLegendCompBBox,
            insets = comLegendComp.insetPadding,
            comLegendCompWidth = comLegendCompBBox.width - (insets * 2),
            comLegendCompHeight = comLegendCompBBox.height - (insets * 2),
            comLegendCompX = comLegendCompBBox.x + insets,
            comLegendCompY = comLegendCompBBox.y + insets,
            surface = comLegendComp.surface,
            mfloor = Math.floor,
            bbox;

        if (me.isDisplayed()) {
            // Find the position based on the dimensions
            switch(me.position) {
                case "left":
                    x = insets;
                    y = mfloor(comLegendCompY + comLegendCompHeight / 2 - legendHeight / 2);
                    break;
                case "right":
                    x = mfloor(surface.width - legendWidth) - insets;
                    y = mfloor(comLegendCompY + comLegendCompHeight / 2 - legendHeight / 2);
                    break;
                case "top":
                    x = mfloor(comLegendCompX + comLegendCompWidth / 2 - legendWidth / 2);
                    y = insets;
                    break;
                case "bottom":
                    x = mfloor(comLegendCompX + comLegendCompWidth / 2 - legendWidth / 2);
                    y = mfloor(surface.height - legendHeight) - insets;
                    break;
                default:
                    x = mfloor(me.origX) + insets;
                    y = mfloor(me.origY) + insets;
            }
            me.x = x;
            me.y = y;

            // Update the position of each item
            for (i = 0, ln = items.length; i < ln; i++) {
                items[i].updatePosition();
            }

            bbox = me.getBBox();

            //if some of the dimensions are NaN this means that we
            //cannot set a specific width/height for the legend
            //container. One possibility for this is that there are
            //actually no items to show in the legend, and the legend
            //should be hidden.
            if (isNaN(bbox.width) || isNaN(bbox.height)) {
                if (me.boxSprite) {
                    me.boxSprite.hide(true);
                }
            } else {
                if (!me.boxSprite) {
                    me.createBox();
                }
                // Update the position of the outer box
                me.boxSprite.setAttributes(bbox, true);
                me.boxSprite.show(true);
            }
        }
    },
    
    toggle: function(show) {
      var me = this,
          i = 0,
          items = me.items,
          len = items.length;

      if (me.boxSprite) {
          if (show) {
              me.boxSprite.show(true);
          } else {
              me.boxSprite.hide(true);
          }
      }

      for (; i < len; ++i) {
          if (show) {
            items[i].show(true);
          } else {
              items[i].hide(true);
          }
      }

      me.visible = show;
    }
});