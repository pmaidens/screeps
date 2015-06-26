module.exports = {

    decide: function(link) {

        if(link.energy) {
            Memory.roleList.Builder.some(function(name) {
                var builder = Game.creeps[name];
                if(builder.energy < builder.energyCapacity) {
                    var energyLeft = builder.energyCapacity - builder.energy;
                    link.transferEnergy(energyLeft < link.energy ? energyLeft : link.energy);
                }
            });
        }
    }
};
