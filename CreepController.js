module.exports = {

    roleControllerMap: {
        Harvester: require("creep.Harvester"),
        Enforcer: require("creep.Enforcer"),
        Builder: require("creep.Builder"),
        Ranger: require("creep.Ranger"),
        Mule: require("creep.Mule")
    },

    decide: function(creep) {
        this.roleControllerMap[creep.memory.type].compute(creep);
    }
};
