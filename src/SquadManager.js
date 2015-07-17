module.exports = function SquadManager() {
    var squadNamePool = require("resources.teamNames");

    function calculateOpenSpace(id) {
        var target = Game.getObjectById(id);
        var area = Game.rooms[target.pos.roomName].lookAtArea(target.pos.x+1, target.pos.y-1, target.pos.x-1, target.pos.y+1);
        var result = 0;

        Object.keys(area).forEach(function (x) {
            Object.keys(area[x]).forEach(function (y) {
                if(!area[x][y].some(function (object) {
                    var nonBlockingStructures = [STRUCTURE_ROAD, STRUCTURE_RAMPART];
                    if( object.type === "source" ||
                        (object.type === "terrain" && object.terrain === "wall") ||
                        ((object.type === "constructionSite" || object.type === "structure") && nonBlockingStructures.indexOf(object.strcuture.structureType) === -1)
                    ) {
                        return true;
                    }
                })) {
                    result++;
                }
            });
        });
        return result;
    }

    Memory.SquadManager = Memory.SquadManager || {};
    Memory.SquadManager.index = Memory.SquadManager.index || 0;

    // Determine which squads should be active
    Object.keys(Memory.sources).forEach(function (sourceId) {
        if(!Memory.sources.squad) {
            // Add a harvester squad
            Memory.SquadManager.squads[squadNamePool[Memory.SquadManager.index]] = {
                type: "Harvester",
                assignment: sourceId,
                population: {
                    max: calculateOpenSpace(), // Need to calculate
                    min: 0, // Need to calculate
                },
                body: [], // Need to calculate
                members: null
            };
        }
    });


    /**
    for each squad
        if not squad memory
            make squad memory
        if squad job not optimal
            find new squad job
        if squad not full
            add creep to queue

    */
};
