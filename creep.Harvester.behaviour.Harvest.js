module.exports = function (creep) {
	// Aquire target
	if(creep.memory.currentTarget.ticksToRegeneration === undefined || !creep.memory.currentTarget.energy || !creep.memory.movement.path.length) {
		creep.memory.currentTarget = creep.pos.findClosest(FIND_SOURCES_ACTIVE, {
    	    algorithm: "astar"
	    });
	}

	// Execute on target
	if(creep.pos.isNearTo(creep.memory.currentTarget.pos.x, creep.memory.currentTarget.pos.y)) {
		creep.harvest(Game.getObjectById(creep.memory.currentTarget.id));
	} else {
		if(!creep.memory.movement.path.length || creep.memory.currentTarget.pos !== creep.memory.movement.targetPos || JSON.stringify(creep.pos) === creep.memory.movement.lastPos || creep.memory.movement.step >== creep.memory.movement.lastCalc/2) {
			creep.memory.movement = {
				path: creep.pos.findPathTo(creep.memory.currentTarget.pos.x, creep.memory.currentTarget.pos.y),
				step: 0,
				lastPos: creep.pos,
				lastCalc: 0,
				targetPos: creep.memory.currentTarget.pos
			};
			creep.memory.movement.lastCalc = creep.memory.movement.path.length;
		}
		creep.memory.movement.lastPos = creep.pos;
		creep.move(creep.memory.movement.path[creep.memory.movement.step].direction);
		creep.memory.movement.step = creep.memory.movement.step + 1;
	}
};