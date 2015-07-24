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
                // var body = this.calculateBodyBasedOnRatio(firstCreep.optimalBody);
                var body = firstCreep.optimalBody;
                if(spawn.canCreateCreep(body)) {
                    spawnMemory.type = firstCreep.type;
                    spawnMemory.squad = firstCreep.squad;
                    var creepName = spawn.createCreep(body, undefined, spawnMemory);
                    if(typeof creepName !== "number") { // If there was an error, this will be a number
                        SpawnQueueManager.removeFirst();
                        Memory.roleList[type.name].push(creepName);
                        Memory.spawning.push(creepName);
                        Memory.SquadManager.squads[firtCreep.squad].members.push(creepName);
                    }
                }
            } else {
                this.creepTypes.some(function(type) {
                    if(Memory.roleList[type.name].length < type.limit) {
                        if(spawn.canCreateCreep(type.body) >= 0) {
                            spawnMemory.type = type.name;
                            var creepName = spawn.createCreep(type.body, undefined, spawnMemory);

                            Memory.roleList[type.name].push(creepName);
                            Memory.spawning.push(creepName);

                            return true;
                        }
                    }
                });
            }

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
            var complete = !SpawnQueueManager.getQueuePopulation();
            if(complete) {
                this.creepTypes.some(function(type) {
                    if(type.limit > Memory.roleList[type.name].length) {
                        complete = false;
                        return true;
                    }
                });
            }
            return complete;
        },

        calculateBodyBasedOnRatio: function (ratio) {
            var i = 0;
            var body = ratio.slice(); // Clone array
            var continueAdding = true;

            while(this.getCostOfBody(body) <= this.calculateUsableEnergy()) {
                body.push(ratio[i]);
                i = i++ % ratio.length;
            }

            return body;
        },

        getCostOfBody: function (body) {
            var bodyCost = 0;
            var bodyCosts = {
                move: 50,
                work: 100,
                carry: 50,
                attack: 80,
                ranged_attack: 150,
                heal: 200,
                tough: 10
            };

            body.forEach(function (part) {
                var cost = bodyCosts[part];
                if(cost !== undefined) {
                    bodyCost+= cost;
                }
            });
            return bodyCost;
        },

        calculateUsableEnergy: function () {
            var energyHolders = ["spawnList", "extensionList"];
            var useableEnergy = 0;

            energyHolders.forEach(function (list) {
                Memory[list].forEach(function (structureId) {
                    useableEnergy += Game.getObjectById(structureId).energy;
                });
            });

            return useableEnergy * 2 / 3;
        }
    };
}();
