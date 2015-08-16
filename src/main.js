SetupPrototypes();

SetupRooms();

SpawnCreeps();

HandleCreeps();

EndTick();

function SetupPrototypes() {
    Room.prototype.getLOIs = function() {
        var lois = this.memory.sources || []; // Need to clone that
        if(this.controller) {
            lois.push(this.controller.id);
        }
        return lois;
    };
}

function SetupRooms() {
    Object.keys(Game.rooms).forEach(function (roomName) {
        var room = Game.rooms[roomName];

        if (!room.memory.calcComplete || Memory.recalcRooms) {
            // Do one time room calculations here

            if(!room.memory.sources) {
                room.memory.sources = room.find(FIND_SOURCES).map(function (sourceObject) {
                    return sourceObject.id;
                });
            }

            room.memory.calcComplete = true;
        }
    });
}

function SpawnCreeps() {
    if(Object.keys(Game.creeps).length < 4) {
        // Spawn a new creep
    }
}

function HandleCreeps() {
    Object.keys(Game.creeps).forEach(function (creepName) {
        var creep = Game.creeps[creepName];

        if(creep.carry.energy < creep.carryCapacity) {
            // Move to source or harvest
        } else {
            // Move to spawn or transfer
        }
    });
}

function EndTick() {
    Memory.recalcRooms = false;
    console.log(Game.getUsedCpu());
}
