module.exports = function (creep) {
	if(creep.memory.currentTarget) {
        creep.memory.currentTarget = Game.getObjectById(creep.memory.currentTarget.id);
    }

	// Aquire target
	if(!creep.memory.currentTarget || creep.memory.currentTarget.ticksToRegeneration === undefined || !creep.memory.currentTarget.energy || !creep.memory.movement.path.length) {
		creep.memory.currentTarget = creep.pos.findClosest(FIND_SOURCES_ACTIVE, {
    	    algorithm: "astar"
	    });
	}

	// Execute on target
	if(creep.memory.currentTarget && creep.memory.currentTarget.pos) {
		if(creep.pos.isNearTo(creep.memory.currentTarget.pos.x, creep.memory.currentTarget.pos.y)) {
			creep.harvest(Game.getObjectById(creep.memory.currentTarget.id));
		} else {
			creep.advMove(creep.memory.currentTarget);
		}
	}
};
