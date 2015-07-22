module.exports = {
    behaviours: {
        Spawning: {
            algorithm: require("creep.Mule.behaviour.Spawning"),
            complete: function (creep) {
                return false;
            }
        },
        Collect: {
            algorithm: require("creep.Mule.behaviour.Collect"),
            complete: function (creep) {
                return creep.energy === creep.carryCapacity;
            }
        },
        Dump: {
            algorithm: require("creep.Mule.behaviour.Dump"),
            complete: function (creep) {
                return creep.energy === 0;
            }
        }
    },

    compute: function(creep) {

        if(this.behaviours[creep.memory.behaviour].complete(creep)) {
            if(creep.energy === creep.carryCapacity) {
                creep.memory.behaviour = "Dump";
            } else {
                creep.memory.behaviour = "Collect";
            }
        }

        this.behaviours[creep.memory.behaviour || "Spawning"].algorithm(creep);
    }
};
