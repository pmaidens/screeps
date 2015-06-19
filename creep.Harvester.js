module.exports = function (creep) {

	// TEMPORARY (hopefully) FIX FOR STALE MEMORY
	if(creep.memory.currentTarget) {
	    creep.memory.currentTarget = Game.getObjectById(creep.memory.currentTarget.id);
	}

    if(!creep.memory.currentTarget || (creep.memory.currentTarget.structureType ? ((creep.memory.currentTarget.energy === creep.memory.currentTarget.energyCapacity) || (creep.energy === 0)) : (creep.energy === creep.energyCapacity) ) ) {
        var target;

        if(creep.energy === 0) {

    		creep.memory.currentTarget = creep.pos.findClosest(FIND_SOURCES, {
	    	    algorithm: "astar"
		    });

    	} else {

            // This is temporarily broken for some reason. Uncomment and remove replacement when fixed.
    		/*creep.memory.currentTarget = creep.pos.findClosest(FIND_MY_SPAWNS, {
	    	    filter: function(spawn) {
    		            return (spawn.energy < spawn.energyCapacity);
    		        },
		        algorithm: "astar"
    		});*/
            creep.memory.currentTarget = creep.pos.findClosest(FIND_MY_STRUCTURES, {
                filter: function(spawn) {
                        return (spawn.structureType === "spawn" && spawn.energy < spawn.energyCapacity);
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
    }

    if(creep.memory.currentTarget) {
        if(creep.pos.isNearTo(Game.getObjectById(creep.memory.currentTarget.id))) {
            if(creep.memory.currentTarget.structureType) {
                creep.transferEnergy(Game.getObjectById(creep.memory.currentTarget.id));
            } else {
                creep.harvest(Game.getObjectById(creep.memory.currentTarget.id));
            }
        } else {
            var moveResult = creep.moveTo(Game.getObjectById(creep.memory.currentTarget.id), {reusePath: 5});
            if(moveResult === -2) {
                creep.memory.currentTarget = undefined;
                creep.memory._move = undefined;
            }
        }
    }

};
