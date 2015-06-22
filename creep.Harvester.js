module.exports = {
    behaviours: {
        default: {
            algorithm: require("creep.Harvester.behaviour.Default"),
            complete: function(creep) {
                return false;
            }
        },
        Spawning: {
            algorithm: require("creep.Harvester.behaviour.Spawning"),
            complete: function (creep) {
                return false;
            }
        },
        Harvest: {
            algorithm: require("creep.Harvester.behaviour.Harvest"),
            complete: function(creep) {
                return creep.energy === creep.energyCapacity;
            }
        },
        Dump: {
            algorithm: require("creep.Harvester.behaviour.Dump"),
            complete: function(creep) {
                return !creep.energy;
            }
        }
    },

    compute: function(creep) {

        // If at full capacity, transfer the energy to any available mules
        if(creep.energy === creep.energyCapacity) {
            var mules = creep.pos.findInRange(FIND_MY_CREEPS,1,{
                filter: function (creep) {
                    return creep.type === "Mule" && creep.energy < creep.energyCapacity;
                }
            });

            mules.some(function(mule) {
                creep.transferEnergy(mule, mule.energyCapacity - mule.energy > creep.energy ? creep.energy : mule.energyCapacity - mule.energy);
                if(!creep.energy) {
                    return true;
                }
            });
        }

        var desiredBehaviour = creep.memory.behaviour || default;

        if(this.behaviours[desiredBehaviour].complete(creep)) {
            if(creep.energy === creep.energyCapacity) {
                creep.memory.behaviour = "Dump";
            } else {
                creep.memory.behaviour = "Harvest";
            }
        }

        this.behaviours[desiredBehaviour].algorithm(creep);
    }
};
