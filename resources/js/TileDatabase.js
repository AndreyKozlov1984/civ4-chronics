window.Civ = window.Civ || {};
Civ.TileDatabase = {
    "ocean":{
        "image":"water/ocean.png",
        "defence_bonus": 0,
        "accessible_via":["ship"]
    },
    "coast":{
        "image":"water/coast.png",
        "defence_bonus": 10,
        "accessible_via":["ship"]
    },
    "plain":{
        "image":"flat/dirt.png",
        "defence_bonus": 0,
        "accessible_via":["melee","archer","cavarly"]
    },
    "grass":{
        "image":"flat/grass-r1.png",
        "defence_bonus": 0,
        "accessible_via":["melee","archer","cavarly"]
    },
    "hills":{
        "image":"hills-variation.png",
        "defence_bonus": 50,
        "accessible_via":["melee","archer","cavarly"]
    }
};
Civ.ImprovementDatabase = {
    "forest":{
        "image":"forest/mixed-summer-tile.png",
        "defence_bonus": 50
    }
};
Civ.UnitDatabase = {
    "peasant":{
        "image":"human-peasants/peasant.png",
        "type":"melee",
        "speed": 1,
        "power": 1
    },
    "pikeman":{
        "image":"human-loyalists/pikeman.png",
        "type":"melee",
        "speed": 1,
        "power": 4
    },
    "archer":{
        "image":"human-loyalists/bowman.png",
        "type":"archer",
        "speed": 1,
        "power": 2
    },
    "maceman":{
        "image":"human-loyalists/heavyinfantry.png",
        "type":"melee",
        "speed": 1,
        "power": 6
    },
    "horseman":{
        "image":"human-loyalists/cavalier.png",
        "type":"cavarly",
        "speed": 2,
        "power": 4
    }
};
Civ.SideDatabase = {
    "0": {
        backgroundColor:'blue'
    },
    "1": {
        backgroundColor:'black'
    }
};
