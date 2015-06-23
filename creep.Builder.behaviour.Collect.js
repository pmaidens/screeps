module.exports = function (creep) {
    // Aquire target
    var elements = [FIND_DROPPED_ENERGY, FIND_MY_STRUCTURES];

    elements.some(function(elementType) {
        creep.memory.currentTarget = creep.pos.findClosest(elementType, {
            filter: function(element) {
                return (element.energy && (element.name || (element.structureType ? element.structureType === STRUCTURE_LINK : true) ) );
            },
            algorithm: "astar"
        });
        return creep.memory.currentTarget;
    });

    // Execute against target
    if(creep.pos.isNearTo(creep.memory.currentTarget.pos.x, creep.memory.currentTarget.pos.y)) {
        if(creep.memory.currentTarget instanceof Energy) {
            creep.pickup(Game.getObjectById(creep.memory.currentTarget.id));
        }
    } else {
        creep.advMove(creep.memory.currentTarget);
    }
};
