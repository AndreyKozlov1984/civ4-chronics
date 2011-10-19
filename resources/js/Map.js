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
        this.itemsConfig = config;
        this.el.html('');
        var container = $('<div></div>').css('position', 'relative').css('overflow', 'hidden').addClass('no-select');
        container.width(config.size * config.cols * 0.75 + config.size * 0.25);
        container.height(config.size * config.rows + config.size * 0.5);
        container.svg(function(svg) {
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
            var x, y;
            for (x = 0; x < config.cols; x++) {
                for (y = 0; y < config.rows; y++) {
                    var tile = config.map[y][x];
                    var tileEl = me.createTile(svg, {
                        x: x,
                        y: y,
                        size: config.size,
                        cellInfo: tile
                    });
                }
            }
        });
        this.el.append(container);
    }
});
