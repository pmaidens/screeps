module.exports = function  (creep) {
	if(!creep.memory.source) {
		creep.behaviour = "Spawning";
		return;
	}

	if(creep.memory.currentTarget) {
        creep.memory.currentTarget = Game.getObjectById(creep.memory.currentTarget.id);
    }

	if(!creep.memory.currentTarget || creep.memory.currentTarget.fatigue === undefined || creep.memory.currentTarget.energy === 0) {
		var harvesters = [];

		if(creep.memory.source && creep.memory.source.pos) {
			harvesters = (new RoomPosition(creep.memory.source.pos.x, creep.memory.source.pos.y, creep.memory.source.pos.room)).findInRange(FIND_MY_CREEPS, 1, {
				filter: function(creep) {
					return creep.memory.type === "Harvester";
				}
			});
		}
		if(harvesters.length) {
			harvesters.sort(function(creepA, creepB) {
				return creepA.energy - creepB.energy;
			});

			creep.memory.currentTarget = harvesters[0];
		}
	}

    if(creep.memory.currentTarget && creep.memory.currentTarget.pos && !creep.pos.isNearTo(creep.memory.currentTarget.x, creep.memory.currentTarget.y)) {
		creep.advMove(creep.memory.currentTarget);
	}
};
