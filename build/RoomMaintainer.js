module.exports = function RoomMaintainer() {
    return {
        updateRooms: function () {
            Object.keys(Game.rooms).forEach(function (roomName) {
                this.maintainRoom(Game.rooms[roomName]);
            }.bind(this));
        },

        maintainRoom: function (room) {
            room.find(FIND_SOURCES).forEach(function (source) {
                Memory.sources[source.id] = Memory.sources[source.id] || {};
            }.bind(this));
        },

        newRoom: function (room) {
            this.maintainRoom(room);
        }
    };
};
