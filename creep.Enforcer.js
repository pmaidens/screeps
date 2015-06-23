module.exports = {
    behaviours: {
        default: require("creep.Enforcer.behaviour.Default")
    },

    compute: function(creep) {
        var desiredBehaviour = "default";

        return this.behaviours[desiredBehaviour](creep);
    }
};
