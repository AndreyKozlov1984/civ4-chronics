//The map class should just generate a set of hex items
window.Civ = window.Civ || {};
Civ.GamePanel = function(el) {
    this.el = el;
    this.createMarkup();
};
$.extend(Civ.GamePanel.prototype, {
    createMarkup: function() {
        var me = this;
        var endTurnButton = $('<a href="javascript:;" class="minibutton"><span>End Turn</span></a>').appendTo(me.el).addClass('endturn');
        $(endTurnButton).click(function(){
            me.onEndTurn();
        });
    }
});


