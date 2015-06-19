module.exports = {

    roleControllerMap: {
        Harvester: require("creep.Harvester"),
        Enforcer: require("creep.Enforcer"),
        Builder: require("creep.Builder"),
        Ranger: require("creep.Ranger")
    },

    decide: function(creep) {
        this.roleControllerMap[creep.memory.type](creep);
    }
};
