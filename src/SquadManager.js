module.exports = function SquadManager() {
    var squadNamePool = require("resources.teamNames");
    var SpawnQueueManager = require("SpawnQueueManager");

    function calculateOpenSpace(id) {
        var area;
        var target = Game.getObjectById(id);
        var result = 0;

        if(!target.pos) {
            return;
        }

        area = Game.rooms[target.pos.roomName].lookAtArea(target.pos.y-1, target.pos.x-1, target.pos.y+1, target.pos.x+1);

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

    function calculateHarvesterBody(availableSpace) {
        /**
         * Sources have a total of 3000 energyCapacity, and regenerate every 300
         * game ticks. As a result, we need to harvest 10 energy every game
         * tick. Each WORK part can harvest 2 energy per turn. So each squad
         * needs to have a total of 5 WORK parts. Calculte the most minimal body
         * composition ratio based on the number of available spaces around the
         * source.
         */
        var workParts = Math.ceil(5/availableSpace);
        var carryParts = workParts/2;
        var moveParts = workParts + carryParts;
        var partCounts = {
            WORK: workParts,
            MOVE: moveParts,
            CARRY: carryParts
        };
        var body = [];

        Object.keys(partCounts).forEach(function (part) {
            for(var i = 0; i < partCounts[part]; i++) {
                body.push(part);
            }
        });

        return body;
    }

    Memory.SquadManager = Memory.SquadManager || {};
    Memory.SquadManager.index = Memory.SquadManager.index || 0;

    // Determine which squads should be active
    Object.keys(Memory.sources).forEach(function (sourceId) {
        if(!Memory.sources[sourceId].squad) {
            // Add a harvester squad
            var squadName;
            var openSpaceAroundSource = calculateOpenSpace(sourceId);
            var optimalBody = calculateHarvesterBody(openSpaceAroundSource);

            squadNamePool.some(function (name) {
                if(Memory.SquadManager.squads[name] === undefined){
                    squadName = name;
                    return true;
                }
            });

            Memory.SquadManager.squads[squadName] = {
                type: "Harvester",
                assignment: sourceId,
                populationMax: openSpaceAroundSource,
                bodyRatio: optimalBody,
                members: []
            };

            Memory.SquadManager.index = Memory.SquadManager.index + 1;
            Memory.sources[sourceId].squad = squadName;
        }
    });

    Object.keys(Memory.SquadManager.squads).forEach(function (squadName) {
        var squadInfo = Memory.SquadManager.squads[squadName];
        if(squadInfo.populationMax > squadInfo.members.length) {
            SpawnQueueManager.add({
                bodyRatio: squadInfo.bodyRatio,
                type: squadInfo.type,
                squad: squadName
            });
        }
        // TODO: Ensure squad assigment is still relevent and optimal
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
