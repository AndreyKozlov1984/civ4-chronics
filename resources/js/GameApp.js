$(function() {
    var bottomSide = $('<div></div>').addClass('bottom-region');
    var centerSide = $('<div></div>').addClass('game-center-region');
    $('body').append(bottomSide).append(centerSide);
    var mapPlaceholder = $('<div></div>');
    centerSide.append(mapPlaceholder);
    var map = new Civ.Map(mapPlaceholder);
    var sidePanelPlaceHolder = $('<div></div>').appendTo(bottomSide);
    var sidePanel = new Civ.GamePanel(sidePanelPlaceHolder);
    var gameManager = new Civ.GameManager();
    var loadMap = function(mapData) {
        map.setItems($.extend(mapData, {
            size: 72
        }));
        sidePanel.setItems(mapData);
    };
    var mapName = (unescape(window.location.search.substring(1)) || 'default');
    var mapLoadUrl = 'load/' + mapName;
    if (window.location.hostname.match(/github/)) {
        mapLoadUrl = 'resources/maps' + mapName + '.js';
    }
    $.getJSON(mapLoadUrl, {
        cacheBuster: Math.random()
    }, function(result) {
        gameManager.loadMap(result.tiles);
        var mapData = gameManager.render();
        loadMap(mapData);
    }, 'json');
    map.onTileClick = function(tileInfo) {
        gameManager.processCellClick(tileInfo);
        var mapData = gameManager.render();
        loadMap(mapData);
    };
    sidePanel.onEndTurn = function() {
        gameManager.doNextTurn();
        var mapData = gameManager.render();
        loadMap(mapData);
    };
});
