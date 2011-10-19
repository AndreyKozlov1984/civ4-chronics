//The map class should just generate a set of hex items
window.Civ = window.Civ || {};
Civ.Map = function(el) {
    this.onTileClick = function() {};
    this.el = el;
    this.createMarkup();
};
$.extend(Civ.Map.prototype, {
    createMarkup: function() {
        var me = this;
        this.el.addClass('map-container');
        this.el.addClass('no-select');
        this.el.click(function(event) {});
    },
    createTile: function(svg, tile) {
        var me = this;
        var s = tile.size;
        var tileX = tile.x * tile.size * 0.75;
        var tileY = tile.y * tile.size + (tile.x % 2) * 0.5 * tile.size;
        var groupEl = svg.group(null, {
            'clip-path': 'url(#hex-clip)',
            'cursor': 'pointer',
            'transform': 'translate($x,$y)'.replace('$x', tileX).replace('$y', tileY)
        });
        var cellCreator = new Civ.CellCreator({
            svg: svg,
            size: s
        });
        var cellElements = cellCreator.makeCellContent(tile.cellInfo);
        cellElements.forEach(function(cellElement) {
            $(groupEl).append(cellElement);
        });
        $(groupEl).click(function() {
            me.onTileClick(tile);
        });
        return groupEl;
    },
    setItems: function(config) {
        window.console && window.console.info(config);
        var me = this;
        var s = config.size;
        var canUseExistingMarkup = this.itemsConfig && this.itemsConfig.size === config.size && this.itemsConfig.cols === config.cols && this.itemsConfig.rows === config.rows;
        this.previousItemsConfig = this.itemsConfig;
        this.itemsConfig = config;
        if (!canUseExistingMarkup) {
            this.tileCache = {};
            this.el.html('');
            var container = $('<div></div>').css('position', 'relative').css('overflow', 'hidden').addClass('no-select');
            this.container = container;
            container.width(config.size * config.cols * 0.75 + config.size * 0.25);
            container.height(config.size * config.rows + config.size * 0.5);
            container.svg(function(svg) {
                me.svg = svg;
                var defs = svg.defs();
                var clipMask = svg.clipPath('hex-clip', null);
                $(defs).append(clipMask);
                $(clipMask).append(svg.polygon([
                    [0, s / 2],
                    [s / 4, 0],
                    [3 * s / 4, 0],
                    [s, s / 2],
                    [3 * s / 4, s],
                    [s / 4, s]
                ], {
                    strokeWidth: 5
                }));
                me.updateTiles();
            });
        } else {
            me.updateTiles();
        }
        this.el.append(container);
    },
    updateTiles: function() {
        var config = this.itemsConfig;
        var x, y;
        for (x = 0; x < config.cols; x++) {
            for (y = 0; y < config.rows; y++) {
                var tile = config.map[y][x];
                this.updateTile(this.svg,{
                    x: x,
                    y: y,
                    size: config.size,
                    cellInfo: tile
                });
            }
        }
    },
    updateTile: function(svg, cell) {
        var key = cell.x + ':' + cell.y;
        var previousValue = this.tileCache[key];
        if (previousValue) {
            if (JSON.stringify(cell) === this.tileCache[key].cell) {
                return;
            }
            $(previousValue.el).remove();
        }
        var el = this.createTile(svg, cell);
        this.tileCache[key] = {
            cell: JSON.stringify(cell),
            el: el
        };
    }
});
