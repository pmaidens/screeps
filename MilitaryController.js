module.exports = {
    calculateOrders: function(creep) {
        var hostiles = Game.rooms.E6S5.find(FIND_HOSTILE_STRUCTURES).concat(
            Game.rooms.E6S5.find(FIND_HOSTILE_SPAWNS),
            Game.rooms.E6S5.find(FIND_HOSTILE_CREEPS)
        );
        if (hostiles.length > 0 && Memory.roleList.Ranger.length >= 5) {
        // if(false) {
            // Memory.Military.Target = hostiles[0].id;
        } else {
            // Memory.Military.Target = Game.flags["Army Rally Point"].id;
        }
        
        Memory.Military.Target = Game.spawns.Spawn_1.id;
    }
}
