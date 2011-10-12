window.Civ = window.Civ || {};
Civ.CellCreator = function(config) {
    $.extend(this, config);
};
$.extend(Civ.CellCreator.prototype, {
    makeCellContent: function(cellInfo) {
        var layers = ['Tile', 'UnitSideIdentifier', 'Unit', 'CellSelection', 'Highlight'];
        return layers.map(function(layer) {
            return this['create' + layer](cellInfo);
        }, this).filter(function(svgElement) {
            return !!svgElement;
        });
    },
    getTileImage: function(tileType) {
        var prefix = "resources/images/wesnoth/terrain/";
        return prefix + {
            'hills': "hills-variation.png",
            'water': "water/ocean.png"
        }[tileType];
    },
    getUnitImage: function(unitType) {
        var prefix = "resources/images/wesnoth/units/human-loyalists/";
        return prefix + {
            'pikeman': "pikeman.png",
            'archer': "bowman.png",
            'maceman': "heavyinfantry.png"
        }[unitType];
    },
    getSideColor: function(side) {
        return {
            0: 'blue',
            1: 'black'
        }[side];
    },
    getActionColor: function(action) {
        return {
            attack: 'red',
            move: 'green'
        }[action];
    },
    createTile: function(cellInfo) {
        return this.svg.image(0, 0, this.size, this.size, this.getTileImage(cellInfo.tile));
    },
    createUnitSideIdentifier: function(cellInfo) {
        if (!cellInfo.unit) {
            return null;
        }
        if (cellInfo.selected) {
            var ellipse = this.svg.ellipse(this.size / 2, 3 / 4 * this.size, this.size / 4, this.size / 6, {
                stroke: this.getSideColor(cellInfo.unit.side),
                strokeWidth: 3,
                fill: 'none'
            });
            //it was planned to do an animation here but it doesnt work at all
            //$('<animate attributeName="stroke-width" to="5" dur="2s" repeatCount="indefinite"/>').appendTo(ellipse);
            return ellipse;
        } else {
            return this.svg.ellipse(this.size / 2, 3 / 4 * this.size, this.size / 4, this.size / 6, {
                stroke: this.getSideColor(cellInfo.unit.side),
                strokeWidth: 3,
                fill: 'none'
            });
        }
    },
    createUnit: function(cellInfo) {
        if (!cellInfo.unit) {
            return null;
        }
        return this.svg.image(0, 0, this.size, this.size, this.getUnitImage(cellInfo.unit.type));
    },
    createCellSelection: function(cellInfo) {
        if (!cellInfo.selected) {
            return null;
        }
        var s = this.size;
        return this.svg.polygon([
            [0, s / 2],
            [s / 4, 0],
            [3 * s / 4, 0],
            [s, s / 2],
            [3 * s / 4, s],
            [s / 4, s]
        ], {
            strokeWidth: 5,
            stroke: 'yellow',
            fill: 'none'
        });
    },
    createHighlight: function(cellInfo) {
        if (cellInfo.highlightAction) {
            var color = this.getActionColor(cellInfo.highlightAction);
            return this.svg.rect(0, 0, this.size, this.size, {
                fill: color,
                opacity: 0.4
            });
        }
    }
});
