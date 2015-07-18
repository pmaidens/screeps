var spawnController = require("SpawnController");
var CreepController = require("CreepController");
var MilitaryController = require("MilitaryController");
var StructureMaintainer = require("StructureMaintainer");
var linkController = require("LinkController");
var RoomMaintainer = require("RoomMaintainer");

Memory.sources = Memory.sources || {};
Object.defineProperty(Source.prototype, "memory", {
    enumerable : true,
    configurable : false,
    get: function () {
        Memory.sources[this.id] = Memory.sources[this.id] || {};
        return Memory.sources[this.id];
    }
});
Memory.structures = Memory.structures || {};
Object.defineProperty(Structure.prototype, "memory", {
    enumerable : true,
    configurable : false,
    get: function () {
        Memory.structures[this.id] = Memory.structures[this.id] || {};
        return Memory.structures[this.id];
    }
});

Creep.prototype.convergingMove = function(target) {
    var reCalc = false;

    if(!target.pos) {
        return;
    }

    if (!this.memory.movement || !Array.isArray(this.memory.movement.path) || !this.memory.movement.lastPos || this.memory.movement.step === undefined || this.memory.movement.lastCalc === undefined) {
        reCalc = true;
    }

    if(reCalc || !this.memory.movement.path.length || target.pos !== this.memory.movement.targetPos || JSON.stringify(this.pos) === this.memory.movement.lastPos || this.memory.movement.step >= (this.memory.movement.lastCalc/2 || undefined) ) {
        this.memory.movement = {
            path: this.pos.findPathTo(target.pos.x, target.pos.y),
            step: 0,
            lastPos: this.pos,
            lastCalc: 0,
            targetPos: target.pos
        };
        this.memory.movement.lastCalc = this.memory.movement.path.length;
    }
    this.memory.movement.lastPos = this.pos;
    if(this.memory.movement.path.length > this.memory.movement.step) {
        this.move(this.memory.movement.path[this.memory.movement.step].direction);
        this.memory.movement.step = this.memory.movement.step + 1;
        return OK;
    } else {
        return ERR_NOT_FOUND;
    }
};

Creep.prototype.advMove = function(target) {
    var reCalc = false;

    if(!target.pos) {
        return;
    }

    if (!this.memory.movement || !Array.isArray(this.memory.movement.path) || !this.memory.movement.lastPos || this.memory.movement.step === undefined) {
        reCalc = true;
    }

    if(reCalc || !this.memory.movement.path.length || target.pos !== this.memory.movement.targetPos || JSON.stringify(this.pos) === this.memory.movement.lastPos ) {
        this.memory.movement = {
            path: this.pos.findPathTo(target.pos.x, target.pos.y),
            step: 0,
            lastPos: this.pos,
            targetPos: target.pos
        };
    }
    this.memory.movement.lastPos = this.pos;
    if(this.memory.movement.path.length > this.memory.movement.step) {
        this.move(this.memory.movement.path[this.memory.movement.step].direction);
        this.memory.movement.step = this.memory.movement.step + 1;
        return OK;
    } else {
        return ERR_NOT_FOUND;
    }
};

Object.keys(Memory.spawnList).forEach(function(spawnName) {
    spawnController.decide(Game.spawns[spawnName]);
});

Memory.linkList.forEach(function(linkId) {
    linkController.decide(Game.getObjectById(linkId));
});

Object.keys(Memory.roleList).forEach(function(roleType) {
    Memory.roleList[roleType].forEach(function(name, index) {
        var spawningIndex = Memory.spawning.indexOf(name);

        if(!Game.creeps[name]) {
            if(spawningIndex < 0) {
                Memory.roleList[roleType].splice(index, 1);
                Memory.creeps[name] = undefined;
            }
        } else {
            if(spawningIndex >= 0) {
                Memory.spawning.splice(spawningIndex, 1);
            }
            CreepController.decide(Game.creeps[name]);
        }
    });
});

if((Game.time % 101) === 0) {
    StructureMaintainer();
}

if((Game.time % 103) === 0) {
    (new RoomMaintainer()).updateRooms();
}

// MilitaryController.calculateOrders();
