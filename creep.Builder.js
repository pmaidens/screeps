module.exports = function (creep) {

	if(creep.memory.currentTarget) {
	    creep.memory.currentTarget = Game.getObjectById(creep.memory.currentTarget.id);
	}

    if(!creep.memory.currentTarget || (creep.memory.currentTarget.progress ? (creep.energy === 0) : (creep.energy === creep.energyCapacity || !creep.memory.currentTarget.energy) ) ) {
        if(!creep.memory.currentTarget || creep.energy === 0) {
            var target;
            var elements = [FIND_MY_SPAWNS, FIND_DROPPED_ENERGY, FIND_MY_STRUCTURES];

            elements.some(function(elementType) {
                creep.memory.currentTarget = creep.pos.findClosest(elementType, {
                    filter: function(element) {
                        return (element.energy && (element.structureType ? ([STRUCTURE_LINK, "spawn"]).indexOf(element.structureType) > -1 : true) )
                    },
                    algorithm: "astar"
                });
                return creep.memory.currentTarget;
            });

        } else {
            var target = Game.getObjectById(Memory.repairList.shift());
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
                if(creep.memory.currentTarget.structureType !== STRUCTURE_CONTROLLER) {
                    creep.build(Game.getObjectById(creep.memory.currentTarget.id));
                } else {
                    creep.upgradeController(Game.getObjectById(creep.memory.currentTarget.id));
                }
            } else {
                if(creep.memory.currentTarget instanceof Energy) {
                    creep.pickup(Game.getObjectById(creep.memory.currentTarget.id));
                }
            }
        } else {
            var moveResult = creep.moveTo(Game.getObjectById(creep.memory.currentTarget.id));
            if(moveResult === -2) {
                creep.memory.currentTarget = undefined;
            }
        }
    }
    

}


