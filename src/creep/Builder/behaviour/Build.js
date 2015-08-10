module.exports = function (creep) {
    if(creep.memory.constructionTarget) {
        creep.memory.currentTarget = Game.getObjectById(creep.memory.constructionTarget.id);
    }

    if(creep.memory.currentTarget && creep.memory.currentTarget.pos) {
        if(creep.pos.isNearTo(creep.memory.currentTarget.pos.x, creep.memory.currentTarget.pos.y)) {
            creep.build(Game.getObjectById(creep.memory.currentTarget.id));
        } else {
            creep.advMove(creep.memory.currentTarget);
        }
    }
};
