module.exports = function (creep) {
    // Aquire target
    var target = Game.getObjectById(creep.memory.currentTarget);
    if(!target || !target.structureType || target.energy === target.energyCapacity) {
        creep.memory.currentTarget = creep.pos.findClosest(FIND_MY_SPAWNS, {
            filter: function(spawn) {
                    return (spawn.energy < spawn.energyCapacity);
                },
            algorithm: "astar"
        });

        if(!target) {
            creep.memory.currentTarget = creep.pos.findClosest(FIND_MY_STRUCTURES, {
                filter: function(structure) {
                     return (structure.structureType === STRUCTURE_EXTENSION) && (structure.energy < structure.energyCapacity);
                },
                algorithm: "astar"
            });
        }
    }
    target = Game.getObjectById(creep.memory.currentTarget);

    // Execute on target
    if(target) {
        if(creep.pos.isNearTo(target)) {
            creep.transferEnergy(target);
        } else {
            creep.advMove(target);
        }
    }
};
