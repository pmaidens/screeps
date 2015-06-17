module.exports = {

    roleControllerMap: {
        Harvester: require("Harvester"),
        Enforcer: require("Enforcer"),
        Builder: require("Builder"),
        Ranger: require("Ranger")
    },
    
    decide: function(creep) {
        this.roleControllerMap[creep.memory.type](creep);
    }
}
