module.exports = function() {
    console.log("Maintaining Structures... " + Game.getUsedCpu());

    var structures = [];
    Object.keys(Game.rooms).forEach(function (roomName) {
        structures = structures.concat(Game.rooms[roomName].find(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.my === true || structure.structureType === STRUCTURE_ROAD || structure.structureType === STRUCTURE_WALL);
            }
        }));
    });

    var newCandidates = [],
        links = [],
        extensions = [];
    var largeStructures = [STRUCTURE_WALL, STRUCTURE_RAMPART];
    structures.forEach(function(structure) {
        if(largeStructures.indexOf(structure.structureType) === -1 ? structure.hits < (structure.hitsMax / 2) : structure.hits < 3000000) {
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

        if(!structure || largeStructures.indexOf(structure.structureType) === -1 ? structure.hits >= structure.hitsMax*0.75 : structure.hits > 4000000) {
            Memory.repairList.splice(Memory.repairList.indexOf(id), 1);
        }
    });

    Memory.linkList = links;
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
