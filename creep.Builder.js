module.exports = {
    behaviours: {
        default: {
            algorithm: require("creep.Builder.behaviour.Default"),
            complete: function (creep) {
                return true;
            }
        },
        Spawning: {
            algorithm: require("creep.Builder.behaviour.Spawning"),
            complete: function (creep) {
                return false;
            }
        },
        Collect: {
            algorithm: require("creep.Builder.behaviour.Collect"),
            complete: function (creep) {
                return creep.energy === creep.energyCapacity;
            }
        },
        Repair: {
            algorithm: require("creep.Builder.behaviour.Repair"),
            complete: function (creep) {
                return Memory.repairList[0] !== creep.memory.currentTarget.id;
            }
        },
        Build: {
            algorithm: require("creep.Builder.behaviour.Build"),
            complete: function (creep) {
                return creep.energy === 0 || creep.currentTarget.progress === undefined;
            }
        },
        Upgrade: {
            algorithm: require("creep.Builder.behaviour.Upgrader"),
            complete: function (creep) {
                return creep.energy === 0;
            }
        }

    },

    compute: function(creep) {

        if(this.behaviours[creep.memory.behaviour].complete(creep)) {
            if(creep.energy === 0) {
                creep.memory.behaviour = "Collect";
            } else if(Memory.repairList.length !== 0) {
                creep.memory.behaviour = "Repair";
            } else if((creep.memory.constructionTarget = creep.pos.findClosest(FIND_CONSTRUCTION_SITES))) {
                creep.memory.behaviour = "Build";
            } else {
                creep.memory.behaviour = "Upgrade";
            }
        }

        this.behaviours[creep.memory.behaviour || "default"].algorithm(creep);
    }
};
