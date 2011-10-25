$(function() {
    $('body').addClass('editor');
    var currentMap;
    var rightSide = $('<div></div>').addClass('right-region');
    var centerSide = $('<div></div>').addClass('center-region');
    $('body').append(rightSide).append(centerSide);
    var mapPlaceholder = $('<div></div>');
    centerSide.append(mapPlaceholder);
    var map = new Civ.Map(mapPlaceholder);
    var mapEditor = new Civ.MapEditor();
    var sidePanelPlaceHolder = $('<div></div>').appendTo(rightSide);
    var sidePanel = new Civ.EditorPanel(sidePanelPlaceHolder);
    var loadMap = function(mapData) {
        map.setItems($.extend(mapData, {
            size: 72
        }));
    };
    var mapUrl = unescape(window.location.search.substring(1)) || 'default';
    $.getJSON('load/' + mapUrl, {
        cacheBuster: Math.random()
    }, function(result) {
        currentMap = result;
        mapEditor.loadMap(result.tiles);
        var mapData = mapEditor.render();
        loadMap(mapData);
    }, 'json');
    map.onTileClick = function(tileInfo) {
        mapEditor.processCellClick(tileInfo);
        var mapData = mapEditor.render();
        loadMap(mapData);
    };
    sidePanel.onModeChosed = function(tileType) {
        mapEditor.selectionMode = tileType;
    };
    sidePanel.setMode({
        type: 'tile',
        key: 'ocean',
        value: 'ocean'
    });
    sidePanel.onNewMap = function(sizeX, sizeY) {
        var newMap = [];
        for (var y = 0; y < sizeY; y++) {
            newMap[y] = [];
            for (var x = 0; x < sizeX; x++) {
                newMap[y][x] = {
                    tile: 'ocean'
                };
            }
        }
        currentMap = {
            tiles: newMap
        };
        mapEditor.loadMap(newMap);
        loadMap(mapEditor.render());
    };
    sidePanel.onSaveMap = function() {
        $.post('save/' + mapUrl, {
            map: JSON.stringify(mapEditor.exportMap())
        });
    };
});
