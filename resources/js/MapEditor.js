window.Civ = window.Civ || {};
Civ.MapEditor = function(config) {
    $.extend(this, config);
    this.battleManager = this.battleManager || new Civ.BattleManager({});
    this.activeTile = 'ocean';
};
$.extend(Civ.MapEditor.prototype, {
    k: function(x, y) {
        if ($.isPlainObject(x)) {
            return this.k(x.x, x.y);
        }
        return x + '-' + y;
    },
    clearSelection: function() {
        $.each(this.cells, function(key, cell) {
            cell.selected = false;
        });
        this.selectedCell = null;
    },
    selectCell: function(cell) {
        this.selectedCell = cell;
        cell.selected = true;
    },
    loadMap: function(mapData) {
        var me = this;
        $.extend(this, {
            width: mapData[0].length,
            height: mapData.length,
            cells: {},
            playerSide: 0,
            selectedCell: null,
            highlightedCells: []
        });
        $.each(mapData, function(y, row) {
            $.each(row, function(x, cell) {
                me.cells[me.k(x, y)] = {
                    tile: cell.tile,
                    improvement: cell.improvement,
                    unit: cell.unit,
                    x: x,
                    y: y
                };
            });
        });
    },
    processCellClick: function(tileInfo) {
        window.console && window.console.info({
            processingCell: tileInfo
        });
        var me = this;
        var selectedCell = me.cells[me.k(tileInfo)];
        selectedCell.tile = this.activeTile;
        me.clearSelection();
        me.selectCell(selectedCell);
    },
    render: function() {
        window.console && window.console.info('manager:rendering the map');
        var x, y;
        var result = {
            cols: this.width,
            rows: this.height,
            map: []
        };
        for (y = 0; y < this.height; y++) {
            result.map[y] = [];
            for (x = 0; x < this.width; x++) {
                result.map[y][x] = this.cells[this.k(x, y)];
            }
        }
        return result;
    }
});
