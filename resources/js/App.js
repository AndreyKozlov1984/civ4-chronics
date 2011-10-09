$(function() {
  var mapPlaceholder = $('<div></div>');
  $('body').append(mapPlaceholder);
  var map = new Civ.Map(mapPlaceholder);
  map.onTileClick = function(tileInfo) {
    window.console && window.console.info(tileInfo);
  };
  //lets create a small map
  map.setItems({
    size: 72,
    rows: 2,
    cols: 3
  });
  setInterval(function() {
    $.post('map.json', {}, function(result) {
      map.setItems({
        size: 72,
        rows: result.tiles.length,
        cols: result.tiles[0].length
      });
      map.loadTiles(result.tiles);
    },'json');
  }, 1000);
  //autoupdate tiles
});
