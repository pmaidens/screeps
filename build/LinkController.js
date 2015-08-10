module.exports = {

    decide: function(link) {

        if(!(link instanceof Structure) || link.structureType !== STRUCTURE_LINK ) {
            // Throw an error - Is not a valid link
            // Maybe I should make an error handling/reporting module of some sort...
        }

        if(!link.memory) {
            // Throw an error - link does not have memory
        }

        if(!link.memory.type) {
            if(link.pos.findInRange(FIND_SOURCES, 2).length) {
                link.memory.type = "dispatch";
            } else {
                link.memory.type = "recieve";
            }
        }

        if(link.energy) {
            var closeBuilders = [];
            Memory.roleLists.Builder.forEach(function(name) {
                var builder = Game.creeps[name];
                if(link.pos.isNearTo(builder) && builder.energy < builder.energyCapacity) {
                    closeBuilders.push(builder);
                }
            });
            closeBuilders.sort(function(a, b) {
                return a.energy - b.energy;
            });
            if(closeBuilders.length) {
                var energyLeft = closeBuilders[0].energyCapacity - closeBuilders[0].energy;
                link.transferEnergy(closeBuilders[0], energyLeft < link.energy ? energyLeft : link.energy);
            }
        }

        if(link.memory.type === "dispatch" && link.energy >= link.energyCapacity/2 && !link.cooldown) {
            var recieveLinks = [];
            Memory.linkList.forEach(function(linkId) {
                var targetLink = Game.structures[linkId];
                if(targetLink.memory.type === "recieve" && targetLink.energy <= targetLink.energyCapacity/2 && link.pos.room === targetLink.pos.room) {
                    recieveLinks.push(targetLink);
                }
            });
            recieveLinks.sort(function(a, b) {
                return a.energy - b.energy;
            });
            link.transferEnergy(recieveLinks[0], link.energyCapacity/2);
        }
    }
};
