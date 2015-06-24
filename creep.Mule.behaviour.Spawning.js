module.exports = function  (creep) {
    Object.keys(Game.sources).some(function (source) {
    	source = Game.sources[source];
		if(!Game.creeps[source.memory.mule]) {
			source.memory.mule = creep.name;
			creep.memory.source = source.id;
			return true; // break
		}
    });

	creep.memory.behaviour = "Collect";
};
