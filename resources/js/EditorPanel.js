//The map class should just generate a set of hex items
window.Civ = window.Civ || {};
Civ.EditorPanel = function(el) {
    this.el = el;
    this.createMarkup();
    this.side = 0;
};
$.extend(Civ.EditorPanel.prototype, {
    createMarkup: function() {
        var me = this;
        //type selectors
        var tilesDiv = $('<div class="tiles"></div>').html('<div>Choose tile: </div>').appendTo(me.el);
        $.each(Civ.TileDatabase,function(key,tile){
            $('<img></img>').addClass('tile').addClass(key).attr('src', "resources/images/wesnoth/terrain/" + tile.image).appendTo(tilesDiv).click(function(){
                me.setMode({
                    type: 'tile',
                    key: key,
                    value: key
                });
            });
        });
        var improvementsDiv = $('<div class="improvements"></div>').html('<div>Choose improvement: </div>').appendTo(me.el);
        $.each($.extend({
            "remove":{
                "image":"../misc/red-x.png"
            }
        },Civ.ImprovementDatabase),function(key,improvement){
            $('<img></img>').addClass('improvement').addClass(key).attr('src', "resources/images/wesnoth/terrain/" + improvement.image).appendTo(improvementsDiv).click(function(){
                me.setMode({
                    type: 'improvement',
                    key: key,
                    value: key
                });
            });
        });
        var unitsDiv = $('<div class="units"></div>').html('<div>Choose unit:</div>').appendTo(me.el);
        $.each($.extend({
            "remove":{
                "image":"../misc/red-x.png"
            }
        },Civ.UnitDatabase),function(key,unit){
            $('<img></img>').addClass('unit').addClass(key).attr('src', "resources/images/wesnoth/units/" + unit.image).appendTo(unitsDiv).click(function(){
                me.setMode({
                    type: 'unit',
                    key: key,
                    value:{
                        type: key,
                        side: me.side
                    }
                });
            });
        });
        var sideDiv = $('<div/>').addClass('sides').html('<div>Choose a unit side:</div>').appendTo(me.el);
        $.each(Civ.SideDatabase, function(key,side){
            var inner = $('<div/>').addClass('side-inner').css('background-color',side.backgroundColor);
            $('<div/>').addClass('side').append(inner).appendTo(me.el).click(function(){
                me.side = + key;
                $('.side',me.el).removeClass('selected');
                $(this).addClass('selected');
                var mode = me.getMode();
                if (mode.type === 'unit'){
                    mode.value.side = me.side;
                    me.setMode(mode);
                }
            });
        });
        //saving a map is here ...
        var mapToolbarDiv = $('<div/>').addClass('toolbar').html('<div>Controlling the map</div>').appendTo(me.el);
        var newMapButton = $('<a href="javascript:;" class="minibutton"><span>New Map</span></a>').appendTo(mapToolbarDiv);
        $(newMapButton).click(function(){
            me.onNewMap(15,10);
        });
        var saveMapButton = $('<a href="javascript:;" class="minibutton"><span>Save</span></a>').appendTo(mapToolbarDiv);
        $(saveMapButton).click(function(){
            me.onSaveMap();
        });
    },
    getMode: function(){
        return this.mode;
    },
    setMode: function(mode){
        this.mode = $.extend(true,{}, mode);//make a full copy of mode
        var selector = '.$type.$key'.replace('$type',mode.type).replace('$key',mode.key);
        $('img').removeClass('selected');
        $(selector,this.el).addClass('selected');
        this.onModeChosed(mode);
    }
});

