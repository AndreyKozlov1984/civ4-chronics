window.Civ = window.Civ || {};
Civ.CellCreator = function(config) {
    $.extend(this, config);
};
$.extend(Civ.CellCreator.prototype, {
    makeCellContent: function(cellInfo) {
        var layers = ['Tile','Improvement', 'UnitSideIdentifier', 'Unit', 'CellSelection', 'Highlight'];
        return layers.map(function(layer) {
            return this['create' + layer](cellInfo);
        }, this).filter(function(svgElement) {
            return !!svgElement;
        });
    },
    getTileImage: function(tileType) {
        var prefix = "resources/images/wesnoth/terrain/";
        var image = Civ.TileDatabase[tileType].image + '.png';
        return prefix + image;
    },
    getImprovementImage: function(improvementType) {
        var prefix = "resources/images/wesnoth/terrain/";
        var image = Civ.ImprovementDatabase[improvementType].image + '.png';
        return prefix + image;
    },
    getUnitImage: function(unitType) {
        var prefix = "resources/images/wesnoth/units/human-loyalists/";
        var image = Civ.UnitDatabase[unitType].image + '.png';
        window.console.info(image);
        return prefix + image;
    },
    getSideColor: function(side) {
        return Civ.SideDatabase[side].backgroundColor; 
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
    createImprovement: function(cellInfo){
        if (!cellInfo.improvement){
            return null;
        }
        return this.svg.image(0, 0, this.size, this.size, this.getImprovementImage(cellInfo.improvement));
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
