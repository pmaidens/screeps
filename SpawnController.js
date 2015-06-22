module.exports = {
    creepTypes: [
        {
            name: "Harvester",
            limit: 6,
            body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
            role: "Civilian"
        }, {
            name: "Mule",
            limit: 0,
            body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            role: "Civilian"
        }, {
            name: "Builder",
            limit: 6,
            // limit: 0,
            body: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            role: "Civilian"
        }, {
            name: "Enforcer",
            // limit: 15,
            limit: 0,
            body: [MOVE, ATTACK, ATTACK, ATTACK],
            role: "Military"
        }, {
            name: "Ranger",
            // limit: 10,
            // limit: 5,
            limit: 0,
            body: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH],
            role: "Military"
        }
    ],

    decide: function(spawn) {

        // Determine what to spawn
        this.creepTypes.some(function(type) {
            if(Memory.roleList[type.name].length < type.limit) {
                if(spawn.canCreateCreep(type.body) >= 0) {

                    var creepName = spawn.createCreep(type.body, undefined, {
                        type: type.name,
                        behaviour: "Spawning",
                        creep.memory.currentTarget = {},
                        creep.memory.movement = {
                            path: [],
                            step: 0,
                            lastPos: spawn.pos,
                            lastCalc: 0,
                            targetPos: spawn.pos
                        }
                    });

                    Memory.roleList[type.name].push(creepName);
                    Memory.spawning.push(creepName);

                    return true;
                }
            }
        });

        // If there is leftover energy and all creeps have been spawned, transfer it to the all the near builders
        if(spawn.energy > 0 && this.creepsComplete()) {
            Memory.roleList.Builder.some(function(name) {
                var creep = Game.creeps[name];
                if(spawn.pos.isNearTo(creep) && creep.energy < creep.energyCapacity) {
                    spawn.transferEnergy(creep, (creep.energyCapacity > spawn.energy ? spawn.energy : creep.energyCapacity));
                }
                if(spawn.energy === 0) {
                    return true; // break
                }
            });
        }
    },

    creepsComplete: function() {
        var complete = true;
        this.creepTypes.some(function(type) {
            if(type.limit > Memory.roleList[type.name].length) {
                complete = false;
                return true;
            }
        });
        return complete;
    }
};
