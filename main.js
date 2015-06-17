var spawnController = require("SpawnController");
var CreepController = require("CreepController");
var MilitaryController = require("MilitaryController");
var StructureMaintainer = require("StructureMaintainer");

for(var name in Game.spawns) {
    spawnController.decide(Game.spawns[name]);
}

Object.keys(Memory.roleList).forEach(function(roleType) {
    Memory.roleList[roleType].forEach(function(name, index) {
        var spawningIndex = Memory.spawning.indexOf(name);
        
        if(!Game.creeps[name]) {
            if(spawningIndex < 0) {
                Memory.roleList[roleType].splice(index, 1);
                Memory.creeps[name] = undefined;
            }
        } else {
            if(spawningIndex >= 0) {
                Memory.spawning.splice(spawningIndex, 1);
            }
            CreepController.decide(Game.creeps[name]);
        }
    });
});

if((Game.time % 101) === 0) {
    // StructureMaintainer();
}

// MilitaryController.calculateOrders();



// TODO: Store path in creep memory. Move based on that.
// TODO: Create military AI
// TODO: Expand AI to multi-room
// TODO: Destroy SourceKeepers
// TODO: Try to replace creep.memory.currentTarget with creep.prototype[creep.name].currentTarget to see if we can remove the getObjectById
// TODO: Export AI behaviour to config files



