module.exports = function(creep) {
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

    if(creep.pos.isNearTo(creep.memory.currentTarget.pos.x, creep.memory.currentTarget.pos.y)) {
        creep.repair(Game.getObjectById(creep.memory.currentTarget.id));
    } else {
        creep.advMove(creep.memory.currentTarget);
    }
};
