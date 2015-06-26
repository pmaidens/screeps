module.exports = function() {
    console.log("Maintaining Structures... " + Game.getUsedCpu());
    Object.keys(Game.rooms).forEach(function(roomName) {
        var room = Game.rooms[roomName];
        var newCandidates = [],
            links = [],
            spawns = [];
        room.find(FIND_STRUCTURES, {
            filter: function(structure) {
                if(structure.hits < (structure.hitsMax / 2)) {
                    newCandidates.push(structure);
                } else if(structure.structureType === STRUCTURE_LINK) {
                    links.push(structure.id);
                } else if(structure.structureType === STRUCTURE_SPAWN) {
                    links.push(structure.name);
                }
                return false;
            }
        });

        Memory.repairList.forEach(function (id) {
            var structure = Game.getObjectById(id);

            if(!structure || structure.hits >= structure.hitsMax*0.75) {
                Memory.repairList.splice(Memory.repairList.indexOf(id), 1);
            }
        });

        Memory.linkList = links;
        Memory.spawnList = spawns;

        newCandidates.forEach(function (structure) {
            if(Memory.repairList.indexOf(structure.id) === -1) {
                Memory.repairList.push(structure.id);
            }
        });

    });
    console.log("Finished " + Game.getUsedCpu());
};
