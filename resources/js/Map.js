//The map class should just generate a set of hex items
window.Civ = window.Civ || {};
Civ.Map = function(el) {
  this.el = el;
  this.createMarkup();
};
Civ.Map.prototype.createMarkup = function() {
  this.el.addClass('map-container');
};
Civ.Map.prototype.setItems = function(config) {
  var x, y;
  for (x = 0; x < config.cols; x++) {
    for (y = 0; y < config.rows; y++) {
      var img = $('<img></img>');
      img.addClass('hex');
			img.css('left', x * config.size * 0.75 + 'px').css('top', y * config.size + (x % 2) * 0.5 * config.size + 'px');
			img.css('width', config.size + 'px').css('height', config.size + 'px');
			img.attr('src','http://perludus.com/examples/hexmap/hills-variation3.png');
			this.el.append(img);
    }
  }
};
