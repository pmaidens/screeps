module.exports = function (creep) {
    creep.memory.currentTarget = creep.memory.constructionTarget;

    if(creep.pos.isNearTo(creep.memory.currentTarget.pos.x, creep.memory.currentTarget.pos.y)) {
        creep.build(Game.getObjectById(creep.memory.currentTarget.id));
    } else {
        creep.advMove(creep.memory.currentTarget);
    }
};
