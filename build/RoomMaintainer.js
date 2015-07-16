module.exports = function RoomMaintainer() {
    return {
        updateRooms: function () {
            Object.keys(Game.rooms).forEach(function (room) {
                this.maintainRoom(room);
            });
        },

        maintainRoom: function (room) {
            room.find(FIND_SOURCES).forEach(function (source) {
                source.memory = source.memory || {};
            });
        },

        newRoom: function (room) {
            this.maintainRoom(room);
        }
    };
};
