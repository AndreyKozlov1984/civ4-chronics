$(function(){
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
        map.setItems($.extend(mapData,{
            size: 72
        }));
    };
    $.getJSON('map.json.js', {cacheBuster:Math.random()}, function(result) {
        mapEditor.loadMap(result.tiles);
        var mapData = mapEditor.render();
        loadMap(mapData);
    }, 'json');
    map.onTileClick = function(tileInfo) {
        mapEditor.processCellClick(tileInfo);
        var mapData = mapEditor.render();
        loadMap(mapData);
    };
    sidePanel.onModeChosed = function(tileType){
        mapEditor.activeTile = tileType;
    };
});
