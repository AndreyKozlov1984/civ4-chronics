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
        var attackerPower = this.getAttackerPower(parameters);
        var defenderPower = this.getDefenderPower(parameters);
        var result = this.getBattleResult(attackerPower,defenderPower);
        parameters.onComplete.call(parameters.scope,result);
    },
    getAttackerPower: function(parameters){
        var attackerCell = parameters.from;
        var basePower = this.unitPowerMap[parameters.from.unit.type];
        var modifiers = [];
        modifiers.push(this.addFriendlyUnitsModifier(parameters.fromFriends));
        modifiers.push(this.addEnemyUnitsModifier(parameters.fromFoes));
        var resultPower = basePower;
        modifiers.forEach(function(modifier){
            resultPower *= modifier;
        });
        return resultPower;
    },
    getDefenderPower: function(parameters){
        var defenderCell = parameters.to;
        var basePower = this.unitPowerMap[defenderCell.unit.type];
        var modifiers = [];
        modifiers.push(this.addTerrainTypeModifier(defenderCell));
        modifiers.push(this.addImprovementModifier(defenderCell));
        modifiers.push(this.addFriendlyUnitsModifier(parameters.toFriends));
        modifiers.push(this.addEnemyUnitsModifier(parameters.toFoes));
        var resultPower = basePower;
        modifiers.forEach(function(modifier){
            resultPower *= modifier;
        });
        return resultPower;
    },
    getBattleResult: function(power1, power2){
        window.console && window.console.info(power1,power2);
        return Math.random() * (power1 + power2) < power1 ?  'attacker' : 'defender';
    },
    addTerrainTypeModifier: function(cell){
        var tile = Civ.TileDatabase[cell.tile];
        var unit = Civ.UnitDatabase[cell.unit.type];
        return (100 + tile.defence_bonus) / 100;
    },
    addImprovementModifier: function(cell){
        var improvement = Civ.ImprovementDatabase[cell.improvement];
        var unit = Civ.UnitDatabase[cell.unit.type];
        var defence_bonus = 0;
        if (improvement){
            defence_bonus = improvement.defence_bonus;
        }
        return (100 + defence_bonus) / 100;
    },
    addFriendlyUnitsModifier: function(friendlyUnits){
        return (100 + 25 * friendlyUnits.length) / 100;
    },
    addEnemyUnitsModifier: function(enemyUnits){
        return (110 - 10 * enemyUnits.length) / 100;
    }
});
