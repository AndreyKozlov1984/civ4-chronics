window.Civ = window.Civ || {};
Civ.BattleManager = function(config) {
    $.extend(this, config);
};
$.extend(Civ.BattleManager.prototype, {
    simulateAttack: function(parameters) {
        var attackerPower = this.getAttackerPower(parameters);
        var defenderPower = this.getDefenderPower(parameters);
        var result = this.getBattleResult(attackerPower, defenderPower);
        parameters.onComplete.call(parameters.scope, result);
    },
    getAttackerPower: function(parameters) {
        var attackerCell = parameters.from;
        var unitInfo = Civ.UnitDatabase[attackerCell.unit.type];
        var basePower = unitInfo.power;
        var modifiers = [];
        modifiers.push(this.addHorseAttackBonus(parameters.from.unit,parameters.to.unit));
        modifiers.push(this.addFriendlyUnitsModifier(parameters.fromFriends));
        modifiers.push(this.addEnemyUnitsModifier(parameters.fromFoes));
        var resultPower = basePower;
        modifiers.forEach(function(modifier) {
            resultPower *= modifier;
        });
        return resultPower;
    },
    getDefenderPower: function(parameters) {
        var defenderCell = parameters.to;
        var unitInfo = Civ.UnitDatabase[defenderCell.unit.type];
        var basePower = unitInfo.power;
        var modifiers = [];
        modifiers.push(this.addTerrainTypeModifier(defenderCell));
        modifiers.push(this.addImprovementModifier(defenderCell));
        modifiers.push(this.addFriendlyUnitsModifier(parameters.toFriends));
        modifiers.push(this.addEnemyUnitsModifier(parameters.toFoes));
        var resultPower = basePower;
        modifiers.forEach(function(modifier) {
            resultPower *= modifier;
        });
        return resultPower;
    },
    getBattleResult: function(power1, power2) {
        window.console && window.console.info(power1, power2);
        return Math.random() * (power1 + power2) < power1 ? 'attacker' : 'defender';
    },
    addTerrainTypeModifier: function(cell) {
        var tile = Civ.TileDatabase[cell.tile];
        var unit = Civ.UnitDatabase[cell.unit.type];
        return (100 + tile.defence_bonus) / 100;
    },
    addImprovementModifier: function(cell) {
        var improvement = Civ.ImprovementDatabase[cell.improvement];
        var unit = Civ.UnitDatabase[cell.unit.type];
        var defence_bonus = 0;
        if (improvement) {
            defence_bonus = improvement.defence_bonus;
        }
        return (100 + defence_bonus) / 100;
    },
    addFriendlyUnitsModifier: function(friendlyUnits) {
        return (100 + 25 * friendlyUnits.length) / 100;
    },
    addEnemyUnitsModifier: function(enemyUnits) {
        return (115 - 15 * enemyUnits.length) / 100;
    },
    addHorseAttackBonus: function(attacker, defender) {
        if (attacker.remaining > defender.speed) {
            return ((attacker.remaining - defender.speed) * 50 + 100) / 100;
        }
        return 1;
    }
});
