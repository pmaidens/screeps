module.exports = function(creep) {
    if(creep.memory.currentTarget) {
        creep.memory.currentTarget = Game.getObjectById(creep.memory.currentTarget.id);
    }

    if(!creep.memory.currentTarget || !creep.memory.currentTarget.structureType || creep.memory.currentTarget.hits === creep.memory.currentTarget.hitsMax) {
        for(var i = 0; i < Memory.repairList.length; i++) {
            var repair = Game.getObjectById(Memory.repairList[i]);
            if(repair.hits === repair.hitsMax) {
                Memory.repairList.splice(i, 1);
                i--;
                continue;
            } else {
                creep.memory.currentTarget = repair;
                break;
            }
        }
    }

    if(creep.memory.currentTarget) {
        if(creep.pos.isNearTo(creep.memory.currentTarget.pos.x, creep.memory.currentTarget.pos.y)) {
            creep.repair(Game.getObjectById(creep.memory.currentTarget.id));
        } else {
            creep.advMove(creep.memory.currentTarget);
        }
    }
};
