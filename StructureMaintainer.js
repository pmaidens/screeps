module.exports = function() {
    console.log("Maintaining Structures... " + Game.getUsedCpu());
    Object.keys(Game.rooms).forEach(function(roomName) {
        var room = Game.rooms[roomName];
        var newCandidates = room.find(FIND_STRUCTURES, {
            filter: function(structure) {
                return structure.hits < (structure.hitsMax / 2);
            }
        });

        Memory.repairList.forEach(function (id) {
            var structure = Game.getObjectById(id);

            if(!structure || structure.hits >= structure.hitsMax*0.75) {
                Memory.repairList.splice(Memory.repairList.indexOf(id), 1);
            }
        });

        newCandidates.forEach(function (structure) {
            if(Memory.repairList.indexOf(structure.id) === -1) {
                Memory.repairList.push(structure.id);
            }
        });

    });
    console.log("Finished " + Game.getUsedCpu());
};
