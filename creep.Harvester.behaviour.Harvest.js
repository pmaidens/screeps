module.exports = function (creep) {
	// Aquire target
	var target = Game.getObjectById(creep.memory.currentTarget);
	if(!target || target.ticksToRegeneration === undefined || !target.energy || !creep.memory.movement.path.length) {
		creep.memory.currentTarget = creep.pos.findClosest(FIND_SOURCES_ACTIVE, {
    	    algorithm: "astar"
	    });
	}
	target = Game.getObjectById(creep.memory.currentTarget);

	// Execute on target
	if(target) {
		if(creep.pos.isNearTo(target)) {
			creep.harvest(target);
		} else {
			creep.advMove(target);
		}
	}
};
