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
                if (cell.unit) {
                    cell.unit.speed = Civ.UnitDatabase[cell.unit.type].speed;
                    cell.unit.remaining = cell.unit.speed;
                }
            });
        });
    },
    doNextTurn: function() {
        var me = this;
        $.each(me.cells, function(key, cell) {
            if (cell.unit) {
                cell.unit.remaining = cell.unit.speed;
            }
        });
        this.checkUnitSelection();
    },
    processCellClick: function(tileInfo) {
        window.console && window.console.info({
            processingCell: tileInfo
        });
        var me = this;
        var selectedCell = me.cells[me.k(tileInfo)];
        var unit; 
        if (!me.selectedCell) {
            me.clearSelection();
            me.clearHighlight();
            me.selectCell(selectedCell);
            unit = selectedCell.unit;
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
                unit = me.selectedCell.unit;
                this.unitMakeAction({
                    from: me.selectedCell,
                    to: selectedCell,
                    unit: me.selectedCell.unit,
                    action: selectedCell.highlightAction
                });
                this.checkUnitSelection(unit);
            } else {
                me.clearSelection();
                me.clearHighlight();
                me.processCellClick(tileInfo);
            }
        }
    },
    unitCanDoAnyAction: function(config) {
        return !!this.unitGetCellAction(config);
    },
    unitGetCellAction: function(config) {
        var cellUnit = config.to.unit;
        if (cellUnit && this.unitCanMove(config) && config.unit.side !== cellUnit.side) {
            return 'attack'; //can attack enemy
        }
        if (!cellUnit && this.unitCanMove(config)) {
            return 'move'; //can always move
        }
        return null;
    },
    unitCanMove: function(config) {
        var unit = config.from.unit;
        var tileInfo = Civ.TileDatabase[config.to.tile];
        var unitInfo = Civ.UnitDatabase[config.from.unit.type];
        //unit should have at least 1 point
        if (unit.remaining === 0) {
            return false;
        }
        //tile should be accessible
        if (tileInfo.accessible_via.indexOf(unitInfo.type) === -1) {
            return false;
        }
        return true;
    },
    unitMakeAction: function(config) {
        var cellUnit = config.to.unit;
        var unit = config.from.unit;
        if (config.action === 'move') {
            config.to.unit = config.from.unit;
            config.from.unit = null;
            unit.remaining -= 1;
        }
        if (config.action === 'attack') {
            var sameSide = function(unit){
                return function(cell){
                    return cell.unit && cell.unit.side === unit.side;
                };
            };
            var differentSide = function(unit){
                return function(cell){
                    return cell.unit && cell.unit.side !== unit.side;
                };
            };
            this.battleManager.simulateAttack({
                from: config.from,
                to: config.to,
                fromFriends: this.getNearestCells(config.from).filter(sameSide(config.from.unit)),
                fromFoes: this.getNearestCells(config.from).filter(differentSide(config.from.unit)),
                toFriends: this.getNearestCells(config.to).filter(sameSide(config.to.unit)),
                toFoes: this.getNearestCells(config.to).filter(differentSide(config.to.unit)),
                onComplete: function(battleResult) {
                    var attacker = config.from.unit;
                    var defender = config.to.unit;
                    if (battleResult === 'attacker') {
                        config.to.unit = config.from.unit;
                        config.from.unit = null;
                        unit.remaining = 0;
                    } else {
                        config.from.unit = null;
                    }
                    Civ.broadcast({
                        type:'battle-finished',
                        attacker: attacker,
                        defender: defender,
                        result: battleResult
                    });
                },
                scope: this
            });
        }
    },
    getAvailableUnitCell: function(){
        var me = this;
        var currentCell = null;
        $.each(me.cells, function(key,cell){
            if (cell.unit && cell.unit.side === me.playerSide && cell.unit.remaining > 0){
                currentCell = cell;
            }
        });
        return currentCell;
    },
    checkUnitSelection: function(unit) {
        var me = this;
        var currentCell = null;
        //if we already have selected unit then we should check if it still has
        //some action points
        if (unit){
            $.each(me.cells,function(key,cell){
                if (cell.unit === unit){
                    currentCell = cell;
                }
            });
        }
        if (currentCell) {
            if (unit.remaining > 0) {
                me.selectedCell = null;
                me.processCellClick(currentCell);
                return;
            }
        }
        // that means we need to find first unit which have remaining actions
        currentCell = me.getAvailableUnitCell();
        if (currentCell) {
                me.selectedCell = null;
                me.processCellClick(currentCell);
                return;
        }
        //else we have nothing to do ...
        me.clearHighlight();
        me.clearSelection();
    },
    render: function() {
        window.console && window.console.info('manager:rendering the map');
        var x, y;
        var result = {
            cols: this.width,
            rows: this.height,
            map: [],
            endOfTurn: !this.getAvailableUnitCell()
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
