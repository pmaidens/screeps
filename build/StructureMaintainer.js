module.exports = function() {
    console.log("Maintaining Structures... " + Game.getUsedCpu());

    var structures = [];
    Object.keys(Game.rooms).forEach(function (roomName) {
        structures = structures.concat(Game.rooms[roomName].find(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.my === true || structure.structureType === STRUCTURE_ROAD);
            }
        }));
    });

    var newCandidates = [],
        links = [],
        extensions = [];
    structures.forEach(function(structure) {
        if(structure.hits < (structure.hitsMax / 2)) {
            newCandidates.push(structure);
        }
        if(structure.structureType === STRUCTURE_LINK) {
            links.push(structure.id);
        } else if(structure.structureType === STRUCTURE_EXTENSION) {
            extensions.push(structure.id);
        }
    });

    Memory.repairList.forEach(function (id) {
        var structure = Game.getObjectById(id);

        if(!structure || structure.hits >= structure.hitsMax*0.75) {
            Memory.repairList.splice(Memory.repairList.indexOf(id), 1);
        }
    });

    Memory.linkList = links;
    Memory.spawnList = Game.spawns;
    Memory.extensionList = extensions;

    newCandidates.forEach(function (structure) {
        if(Memory.repairList.indexOf(structure.id) === -1) {
            Memory.repairList.push(structure.id);
        }
    });

    Memory.repairList = Memory.repairList.sort(function (a, b) {
        return Game.getObjectById(a).hits - Game.getObjectById(b).hits;
    });

    console.log("Finished " + Game.getUsedCpu());
};
