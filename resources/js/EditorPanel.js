//The map class should just generate a set of hex items
window.Civ = window.Civ || {};
Civ.EditorPanel = function(el) {
    this.el = el;
    this.createMarkup();
};
$.extend(Civ.EditorPanel.prototype, {
    createMarkup: function() {
        var me = this;
        me.el.html('Choose tile:');
        var tilesDiv = $('<div></div>').appendTo(me.el);
        $.each(Civ.TileDatabase,function(key,tile){
            $('<img></img>').attr('src', "resources/images/wesnoth/terrain/" + tile.image).appendTo(tilesDiv).click(function(){
                me.onModeChosed(key);
            });
        });
    }
});

