$(function() {
    var mapPlaceholder = $('<div></div>');
    $('body').append(mapPlaceholder);
    var map = new Civ.Map(mapPlaceholder);
		var gameManager = new Civ.GameManager();
    var loadMap = function(mapData) {
        map.setItems($.extend(mapData,{
            size: 72
        }));
    };
    $.post('map.json.js', {cacheBuster:Math.random()}, function(result) {
        gameManager.loadMap(result.tiles);
        var mapData = gameManager.render();
        loadMap(mapData);
    }, 'json');
    map.onTileClick = function(tileInfo) {
        gameManager.processCellClick(tileInfo);
        var mapData = gameManager.render();
        loadMap(mapData);
    };
});
