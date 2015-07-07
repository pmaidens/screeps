module.exports = {

    roleControllerMap: {
        Harvester: require("creep.Harvester.ai"),
        Enforcer: require("creep.Enforcer.ai"),
        Builder: require("creep.Builder.ai"),
        Ranger: require("creep.Ranger.ai"),
        Mule: require("creep.Mule.ai")
    },

    decide: function(creep) {
        this.roleControllerMap[creep.memory.type].compute(creep);
    }
};
