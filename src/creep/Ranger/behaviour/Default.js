module.exports = function (creep) {

    if(!creep.memory.currentTarget) {
    	creep.memory.currentTarget = Memory.Military.Target;
    }

    var target = Game.getObjectById(creep.memory.currentTarget);

    // console.log(JSON.stringify(target));
    if(target.my === false) {
        if(creep.pos.getRangeTo(target) < 3) {
            // creep.rangedAttack(target);
            creep.rangedMassAttack();
        } else {
            creep.moveTo(target);
        }
    } else {
        creep.moveTo(target);
        creep.memory.currentTarget = Memory.Military.Target;
    }
};
