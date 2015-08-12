module.exports = function() {
    var SpawnQueueManager = require("SpawnQueueManager");

    return {
        creepTypes: [
            {
                name: "Harvester",
                limit: 6,
                // body: [WORK, CARRY, CARRY, MOVE, MOVE],
                body: [WORK, WORK, WORK, CARRY, MOVE, MOVE],
                role: "Civilian"
            }, {
                name: "Mule",
                limit: 0,
                body: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                role: "Civilian"
            }, {
                name: "Builder",
                limit: 5,
                // limit: 0,
                // body: [WORK, CARRY, CARRY, MOVE, MOVE],
                body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
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

            var spawnMemory = {
                type: null,
                behaviour: "Spawning",
                currentTarget: {},
                movement: {
                    path: [],
                    step: 0,
                    lastPos: spawn.pos,
                    lastCalc: 0,
                    targetPos: spawn.pos
                }
            };

            if(SpawnQueueManager.getQueuePopulation()) {
                var firstCreep = SpawnQueueManager.getFirst();
                if(spawn.canCreateCreep(firstCreep.body)) {
                    spawnMemory.type = firstCreep.name;
                    var result = spawn.createCreep(firstCreep.body, undefined, spawnMemory);
                    if(result === 0) {
                        SpawnQueueManager.removeFirst();
                    }
                }
            } else {
                this.creepTypes.some(function(type) {
                    if(!Memory.roleLists[type.name]) {
                        Memory.roleLists[type.name] = [];
                    }
                    if(Memory.roleLists[type.name].length < type.limit) {
                        if(spawn.canCreateCreep(type.body) >= 0) {
                            spawnMemory.type = type.name;
                            var creepName = spawn.createCreep(type.body, undefined, spawnMemory);

                            Memory.roleLists[type.name].push(creepName);
                            Memory.spawning.push(creepName);

                            return true;
                        }
                    }
                });
            }

            // If there is leftover energy and all creeps have been spawned, transfer it to the all the near builders
            if(spawn.energy > 0 && this.creepsComplete()) {
                Memory.roleLists.Builder.some(function(name) {
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
            var complete = !SpawnQueueManager.getQueuePopulation();
            if(complete) {
                this.creepTypes.some(function(type) {
                    if(type.limit > Memory.roleLists[type.name].length) {
                        complete = false;
                        return true;
                    }
                });
            }
            return complete;
        }
    };
}();
