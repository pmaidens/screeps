module.exports = function (creep) {

    if(creep.memory.currentTarget) {
        creep.memory.currentTarget = Game.getObjectById(creep.memory.currentTarget.id);
    }

    if(!creep.memory.currentTarget || (creep.memory.currentTarget.progress ? (creep.energy === 0) : (creep.energy === creep.energyCapacity || !creep.memory.currentTarget.energy) ) || (creep.memory.currentTarget.structureType === STRUCTURE_RAMPART && creep.memory.currentTarget.hits >= 1500) ) {
        if(!creep.memory.currentTarget || creep.energy === 0) {
            var target;
            var elements = [FIND_MY_SPAWNS, FIND_DROPPED_ENERGY, FIND_MY_STRUCTURES];

            elements.some(function(elementType) {
                creep.memory.currentTarget = creep.pos.findClosest(elementType, {
                    filter: function(element) {
                        return (element.energy && (element.name || (element.structureType ? element.structureType === STRUCTURE_LINK : true) ) )
                    },
                    algorithm: "astar"
                });
                return creep.memory.currentTarget;
            });

        } else {
            var target;

            for(var i = 0; i < Memory.repairList.length; i++) {
                var repair = Game.getObjectById(Memory.repairList[i]);
                if(repair.hits === repair.hitsMax) {
                    Memory.repairList.splice(i, 1);
                    i--;
                    continue;
                } else {
                    target = repair;
                    break;
                }
            }

            if(!target) {
                target = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
            }
            if(!target) {
                target = creep.room.controller;
            }
            creep.memory.currentTarget = target;
        }
        if(!creep.memory.currentTarget) {
            creep.memory.currentTarget = Game.flags.Rally_Builders;
        }
    }

    if(creep.memory.currentTarget) {
        if(creep.pos.isNearTo(Game.getObjectById(creep.memory.currentTarget.id))) {
            if(creep.memory.currentTarget.progress !== undefined) {
                if(creep.memory.currentTarget.structureType === STRUCTURE_CONTROLLER) {
                    creep.upgradeController(Game.getObjectById(creep.memory.currentTarget.id));
                } else {
                    creep.build(Game.getObjectById(creep.memory.currentTarget.id));
                }
            } else {
                if(creep.memory.currentTarget instanceof Energy) {
                    creep.pickup(Game.getObjectById(creep.memory.currentTarget.id));
                } else if(creep.memory.currentTarget.structureType) {
                    creep.repair(Game.getObjectById(creep.memory.currentTarget.id));
                }
            }
        } else {
            var moveResult = creep.moveTo(Game.getObjectById(creep.memory.currentTarget.id), {reusePath: 10});
            if(moveResult === -2) {
                creep.memory.currentTarget = undefined;
                creep.memory._move = undefined;
            }
        }
    }
}
