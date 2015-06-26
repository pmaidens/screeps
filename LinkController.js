module.exports = {

    decide: function(link) {

        if(link.energy) {
            var closeBuilders = [];
            Memory.roleList.Builder.forEach(function(name) {
                var builder = Game.creeps[name];
                if(link.pos.isNearTo(builder) && builder.energy < builder.energyCapacity) {
                    closeBuilders.push(builder);
                }
            });
            closeBuilders.sort(function(a, b) {
                return a - b;
            });
            if(closeBuilders.length) {
                var energyLeft = closeBuilders[0].energyCapacity - closeBuilders[0].energy;
                link.transferEnergy(closeBuilders[0], energyLeft < link.energy ? energyLeft : link.energy);
            }
        }
    }
};
