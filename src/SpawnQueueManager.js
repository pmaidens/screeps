module.exports = {
    add: function (role) {
        var queue;
        Memory.spawnQueue = Memory.spawnQueue || [];
        queue = Memory.spawnQueue;
        queue.push(role);
        Memory.spawnQueue = queue;
    },
    removeFirst: function () {
        var queue = Memory.spawnQueue || [];
        firstRole = queue.splice(0, 1)[0];
        Memory.spawnQueue = queue;
        return firstRole;
    },
    getQueuePopulation: function () {
        Memory.spawnQueue = Memory.spawnQueue || [];
        return Memory.spawnQueue.length;
    },
    getFirst: function () {
        Memory.spawnQueue = Memory.spawnQueue || [];
        return Memory.spawnQueue[0];
    }
};
