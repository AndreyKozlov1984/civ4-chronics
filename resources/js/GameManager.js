window.Civ = window.Civ || {};
Civ.GameManager = function(config) {
    $.extend(this, config);
    this.battleManager = this.battleManager || new Civ.BattleManager({});
};
$.extend(Civ.GameManager.prototype, {
    k: function(x, y) {
        if ($.isPlainObject(x)) {
            return this.k(x.x, x.y);
        }
        return x + '-' + y;
    },
    getNearestCells: function(x, y) {
        var me = this;
        if ($.isPlainObject(x)) {
            return this.getNearestCells(x.x, x.y);
        }
        var y1 = x % 2 ? y + 1 : y;
        var y2 = x % 2 ? y : y - 1;
        var array = [{
            x: x,
            y: y - 1
        },
        {
            x: x + 1,
            y: y1
        },
        {
            x: x + 1,
            y: y2
        },
        {
            x: x,
            y: y + 1
        },
        {
            x: x - 1,
            y: y2
        },
        {
            x: x - 1,
            y: y1
        }];
        return array.map(function(point) {
            return me.cells[me.k(point)];
        }).filter(function(cell) {
            return !!cell;
        });
    },
    clearSelection: function() {
        $.each(this.cells, function(key, cell) {
            cell.selected = false;
        });
        this.selectedCell = null;
    },
    clearHighlight: function() {
        $.each(this.cells, function(key, cell) {
            cell.highlightAction = false;
        });
        this.highlightedCells = null;
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
        if (!me.selectedCell) {
            me.clearSelection();
            me.clearHighlight();
            me.selectCell(selectedCell);
            var unit = me.selectedCell.unit;
            if (unit) {
                if (unit.side === me.playerSide) {
                    me.highlightedCells = me.getNearestCells(selectedCell).filter(function(neighbourCell) {
                        return me.unitCanDoAnyAction({
                            from: me.selectedCell,
                            unit: unit,
                            to: neighbourCell
                        });
                    });
                    $.each(me.highlightedCells, function(unused, cell) {
                        cell.highlightAction = me.unitGetCellAction({
                            from: me.selectedCell,
                            unit: unit,
                            to: cell
                        });
                    });
                }
            }
        }
        else {
            if (selectedCell.highlightAction) {
                window.console && window.console.info({
                    aboutTo: selectedCell.highlightAction
                });
                //do something
                this.unitMakeAction({
                    from: me.selectedCell,
                    to: selectedCell,
                    unit: me.selectedCell.unit,
                    action: selectedCell.highlightAction
                });
                //just select a new unit
                me.clearSelection();
                me.clearHighlight();
                me.processCellClick(selectedCell);
            } else {
                me.clearSelection();
                me.clearHighlight();
                me.processCellClick(tileInfo);
            }
        }
    },
    unitCanDoAnyAction: function(config) {
        var cellUnit = config.to.unit;
        if (cellUnit && config.unit.side === cellUnit.side) {
            return false; //can not attack ourselves and can not stack units
        }
        if (cellUnit && config.unit.side !== cellUnit.side) {
            return true; //can attack enemy
        }
        if (!cellUnit) {
            return true; //can always move
        }
    },
    unitGetCellAction: function(config) {
        var cellUnit = config.to.unit;
        if (cellUnit && config.unit.side === cellUnit.side) {
            return null; //can not attack ourselves and can not stack units
        }
        if (cellUnit && config.unit.side !== cellUnit.side) {
            return 'attack'; //can attack enemy
        }
        if (!cellUnit) {
            return 'move'; //can always move
        }
    },
    unitMakeAction: function(config) {
        var cellUnit = config.to.unit;
        if (config.action === 'move') {
            config.to.unit = config.from.unit;
            config.from.unit = null;
            this.selectedCell = null;
        }
        if (config.action === 'attack') {
            this.battleManager.simulateAttack({
                from: config.from,
                to: config.to,
                onComplete: function(battleResult) {
                    if (battleResult === 'attacker') {
                        config.to.unit = config.from.unit;
                        config.from.unit = null;
                        this.selectedCell = null;
                    } else {
                        config.from.unit = null;
                        this.selectedCell = null;
                    }
                },
                scope: this
            });
        }
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
