module.exports = function (creep) {
    // Aquire target
    if(creep.memory.currentTarget.ticksToRegeneration === undefined || !creep.memory.currentTarget.energy || !creep.memory.movement.path.length) {
        creep.memory.currentTarget = creep.pos.findClosest(FIND_MY_SPAWNS, {
            filter: function(spawn) {
                    return (spawn.energy < spawn.energyCapacity);
                },
            algorithm: "astar"
        });

        if(!creep.memory.currentTarget) {
            creep.memory.currentTarget = creep.pos.findClosest(FIND_MY_STRUCTURES, {
                filter: function(structure) {
                     return (structure.structureType === STRUCTURE_EXTENSION) && (structure.energy < structure.energyCapacity);
                },
                algorithm: "astar"
            });
        }
    }

    // Execute on target
    if(creep.pos.isNearTo(creep.memory.currentTarget.pos.x, creep.memory.currentTarget.pos.y)) {
        creep.harvest(Game.getObjectById(creep.memory.currentTarget.id));
    } else {
        creep.advMove(creep.memory.currentTarget);
    }
};
