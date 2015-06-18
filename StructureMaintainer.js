module.exports = function() {
    console.log("Maintaining Structures... " + Game.getUsedCpu());
    Object.keys(Game.structures).forEach(function(id) {
        var structure = Game.getObjectById(id);
        
        console.log(structure.structureType + " " + structure.hits + ":" + structure.hitsMax);
        if(structure.hits < (structure.hitsMax / 2) && Memory.repairList.indexOf(id) === -1) {
            console.log(structure.structureType + " " + structure.id + " added.");
            Memory.repairList.push(id);
        } else {
            console.log(structure.structureType + " " + structure.hits + ":" + structure.hitsMax + " index:" + Memory.repairList.indexOf(id));
            var index = Memory.repairList.indexOf(id);
            if(index > -1 && structure.hits >= (structure.hitsMax / 2)) {
                Memory.repairList.splice(index, 1);
            }
        }
        Memory.repairList.sort(function(a, b) {
            return Game.getObjectById(b).hits - Game.getObjectById(a).hits;
        });
    });
    console.log("Finished " + Game.getUsedCpu());
}
