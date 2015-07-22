module.exports = function (creep) {

    // If at full capacity, transfer the energy to any available mules
    if(creep.energy === creep.energyCapacity) {
        var mules = creep.pos.findInRange(FIND_MY_CREEPS,1,{
            filter: function (creep) {
                return creep.type === "Mule" && creep.energy < creep.energyCapacity;
            }
        });

        mules.some(function(mule) {
            creep.transferEnergy(mule, mule.energyCapacity - mule.energy > creep.energy ? creep.energy : mule.energyCapacity - mule.energy);
            if(!creep.energy) {
                return true;
            }
        });
    }

    // Target aquisition
	if(creep.memory.currentTarget) {
	    creep.memory.currentTarget = Game.getObjectById(creep.memory.currentTarget.id);
	}

    if(!creep.memory.currentTarget || (creep.memory.currentTarget.structureType ? ((creep.memory.currentTarget.energy === creep.memory.currentTarget.energyCapacity) || (creep.energy === 0)) : (creep.energy === creep.energyCapacity) ) ) {
        var target;

        if(creep.energy === 0) {

    		creep.memory.currentTarget = creep.pos.findClosest(FIND_SOURCES_ACTIVE, {
	    	    algorithm: "astar"
		    });

    	} else {
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
    }

    // Decide what action to take based on the target
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
