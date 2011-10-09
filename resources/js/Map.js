//The map class should just generate a set of hex items
window.Civ = window.Civ || {};
Civ.Map = function(el) {
  this.el = el;
  this.createMarkup();
};
Civ.Map.prototype.createMarkup = function() {
  var me = this;
  this.el.addClass('map-container');
  this.el.click(function(event) {
    me.processClickEvent(event);
  });
};
Civ.Map.prototype.setItems = function(config) {
  this.itemsConfig = config;
  this.el.html('');
	var container = $('<div></div>').css('position','relative').css('overflow','hidden');
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
				tileDiv.css('z-index',2);
        tileDivInner.addClass('tile-empty');
      } else {
				tileDiv.css('z-index',1);
        tileDivInner.addClass('tile-hills');
      }
      tileDiv.css('left', x * config.size * 0.75 - config.size / 2 + 'px').css('top', y * config.size + (x % 2) * 0.5 * config.size + 'px');
      tileDiv.css('width', config.size * 2 + 'px').css('height', config.size + 'px');
      container.append(tileDiv);
    }
  }
};
