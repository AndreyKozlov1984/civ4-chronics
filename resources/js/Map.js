//The map class should just generate a set of hex items
window.Civ = window.Civ || {};
Civ.Map = function(el) {
  this.onTileClick = function() {};
  this.el = el;
  this.createMarkup();
};
Civ.Map.prototype.createMarkup = function() {
  var me = this;
  this.el.addClass('map-container');
  this.el.click(function(event) {});
};
Civ.Map.prototype.setItems = function(config) {
  var me = this;
  this.itemsConfig = config;
  this.el.html('');
  var container = $('<div></div>').css('position', 'relative').css('overflow', 'hidden');
  container.width(config.size * config.cols * 0.75 + config.size * 0.25);
  container.height(config.size * config.rows + config.size * 0.5);
  this.el.append(container);
  var x, y;
  for (x = -1; x < config.cols + 1; x++) {
    for (y = -1; y < config.rows + 1; y++) {
      var tileDivInner = $('<div class="hex-inner"></div>');
      var tileDivMiddle = $('<div class="hex-middle"></div>');
      var tileDiv = $('<div class="hex-outer"></div>');
      tileDivMiddle.append(tileDivInner);
      tileDiv.append(tileDivMiddle);
      var isBorderTile = (x === -1 || x === config.cols || y === -1 || y === config.rows);
      if (isBorderTile) {
        tileDiv.css('z-index', 2);
        tileDivInner.addClass('tile-empty');
      } else {
        tileDiv.css('z-index', 1);
        tileDiv.addClass('cell-' + x + '-' + y);
        //tileDivInner.addClass('tile-hills');
        (function() {
          var tileInfo = {
            x: x,
            y: y
          };
          tileDiv.click(function() {
            me.onTileClick(tileInfo);
          });
        })();
      }
      tileDiv.css('left', x * config.size * 0.75 - config.size / 2 + 'px').css('top', y * config.size + (x % 2) * 0.5 * config.size + 'px');
      tileDiv.css('width', config.size * 2 + 'px').css('height', config.size + 'px');
      container.append(tileDiv);
    }
  }
};
Civ.Map.prototype.loadTiles = function(tiles) {
  var me = this;
  tiles.forEach(function(row, y) {
    row.forEach(function(cell, x) {
      me.setCellTile(x, y, cell.tile);
    });
  });
};
Civ.Map.prototype.setCellTile = function(x, y, tile) {
  var cell = $('.cell-' + x + '-' + y, this.el);
  var cellDivInner = $('.hex-inner', cell);
  cellDivInner.addClass('tile-' + tile);
};
