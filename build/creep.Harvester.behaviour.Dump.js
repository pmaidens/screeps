module.exports = function (creep) {
    var optimalStructureId;

    function determineAndSetOptimalStruture(structure) {
        if(structure.energy < structure.energyCapacity && structure.pos.roomName === creep.pos.roomName ) {
            optimalStructureId = structure.id;
            return true;
        }
    }

    if(creep.memory.currentTarget) {
        creep.memory.currentTarget = Game.getObjectById(creep.memory.currentTarget.id);
    }

    // Aquire target
    if((!creep.memory.currentTarget || !creep.memory.currentTarget.structureType || creep.memory.currentTarget.energy === creep.memory.currentTarget.energyCapacity) && Memory.extensionList !== undefined && Memory.linkList !== undefined) {

        /*
         * This would be better written with a "goto label" structure, but javascript doesn't have that...
         */
        if(Object.keys(Game.spawns).some(function (spawnName) {
            return determineAndSetOptimalStruture(Game.spawns[spawnName]);
        })) {} else if (Memory.extensionList.some(function (extensionId) {
            return determineAndSetOptimalStruture(Game.getObjectById(extensionId));
        })) {} else if (Memory.linkList.some(function (linkId) {
            return determineAndSetOptimalStruture(Game.getObjectById(linkId));
        })) {}

        creep.memory.currentTarget = Game.getObjectById(optimalStructureId);
    }

    // Execute on target
    if(creep.memory.currentTarget && creep.memory.currentTarget.pos) {
        if(creep.pos.isNearTo(creep.memory.currentTarget.pos.x, creep.memory.currentTarget.pos.y)) {
            creep.transferEnergy(Game.getObjectById(creep.memory.currentTarget.id));
        } else {
            creep.advMove(creep.memory.currentTarget);
        }
    }
};
