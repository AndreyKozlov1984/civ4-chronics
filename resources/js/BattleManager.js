window.Civ = window.Civ || {};
Civ.BattleManager = function(config){
    $.extend(this,config);
};
$.extend(Civ.BattleManager.prototype,{
    unitPowerMap: {
        'pikeman': 4,
        'archer': 2,
        'maceman': 6,
        'cavalier': 4
    },
    simulateAttack: function(parameters){
        var attackerPower = this.getAttackerPower(parameters.from.unit);
        var defenderPower = this.getDefenderPower(parameters.to.unit);
        var result = this.getBattleResult(attackerPower,defenderPower);
        parameters.onComplete.call(parameters.scope,result);
    },
    getAttackerPower: function(unit){
        return this.unitPowerMap[unit.type];
    },
    getDefenderPower: function(unit){
        return this.unitPowerMap[unit.type];
    },
    getBattleResult: function(power1, power2){
        return Math.random() * (power1 + power2) < power1 ?  'attacker' : 'defender';
    },
    addTerrainTypeModifier: function(){
        /*
        if (tile.type.defend_bonus && unit.isDefender && unit.receivesDefenderBonus){
            bonus = tile_defence_bonus;
            text = "Terrain Defence";

        }
        */
    }
});
