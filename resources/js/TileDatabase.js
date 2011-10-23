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
    "pikeman":{
        "image":"pikeman.png",
        "type":"melee",
        "speed": 1
    },
    "archer":{
        "image":"bowman.png",
        "type":"archer",
        "speed": 1
    },
    "maceman":{
        "image":"heavyinfantry.png",
        "type":"melee",
        "speed": 1
    },
    "horseman":{
        "image":"cavalier.png",
        "type":"cavarly",
        "speed": 2
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
