module.exports = function() {
    console.log("Maintaining Structures... " + Game.getUsedCpu());
    Object.keys(Game.structures).forEach(function(id) {
        var structure = Game.getObjectById(id);
        
        if(structure.hits < structure.hitsMax / 2 && Memory.repairList.indexOf(id) === -1) {
            Memory.repairList.push(id);
        } else {
            var index = Memory.repairList.indexOf(id);
            if(index > -1) {
                Memory.repairList.splice(index, 1);
            }
        }
    });
    console.log("Finished " + Game.getUsedCpu());
}

