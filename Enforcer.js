module.exports = function (creep) {

	var target = Game.getObjectById(Memory.Military.Target);
	console.log(Memory.Military.Target);
	console.log(target);
    if(target.my === true) {
        if(creep.pos.isNearTo(target)) {
            creep.attack(target);
        } else {
            creep.moveTo(target);
        }
    } else {
        creep.moveTo(target);
    }
}

