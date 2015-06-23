module.exports = function (creep) {
    creep.memory.currentTarget = creep.room.controller;

    if(creep.memory.currentTarget) {
        if(creep.pos.isNearTo(creep.memory.currentTarget.pos.x, creep.memory.currentTarget.pos.y)) {
            creep.upgradeController(Game.getObjectById(creep.memory.currentTarget.id));
        } else {
            creep.advMove(creep.memory.currentTarget);
        }
    }
};
