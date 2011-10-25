//The map class should just generate a set of hex items
window.Civ = window.Civ || {};
Civ.GamePanel = function(el) {
    this.el = el;
    this.createMarkup();
    Civ.subscribe('battle-finished',this.onBattleFinished,this);
};
$.extend(Civ.GamePanel.prototype, {
    createMarkup: function() {
        var me = this;
        me.endTurnButton = $('<a href="javascript:;" class="minibutton"><span>End Turn</span></a>').appendTo(me.el).addClass('endturn');
        $(me.endTurnButton).click(function(){
            me.onEndTurn();
        });
        me.notificationDiv = $('<div/>').addClass('notification').appendTo(me.el);
        Civ.broadcast({
            type:'fill-game-panel',
            el: me.el
        });
    },
    setItems: function(items){
        $(this.endTurnButton).removeClass('no-moves');
        if (items.endOfTurn){
            $(this.endTurnButton).addClass('no-moves');
        }
    },
    onBattleFinished: function(message){
        var color;
        var text;
        if (message.result === 'attacker'){
            color = 'green';
            text = "Your $myUnit$ destroyed enemy $theirUnit$".replace('$myUnit$',message.attacker.type).replace('$theirUnit$',message.defender.type);
        } else {
            color = 'red';
            text = "Your $myUnit$ was defeated by enemy $theirUnit$".replace('$myUnit$',message.attacker.type).replace('$theirUnit$',message.defender.type);
        }
        $(this.notificationDiv).text(text).css('color',color);
    }
});


