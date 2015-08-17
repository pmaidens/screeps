module.exports = function () {
    function PriorityNode(data, priority) {
        this.data = [];
        this.priority = priority;
        this.push(data);
    }

    PriorityNode.prototype = {
        push: function (data) {
            this.data.push(data);
        },

        pop: function () {
            return this.data.splice(0, 1)[0];
        },

        toString: function () {
            return "[object PriorityNode]";
        },

        get length() {
            return this.data.length;
        }
    };

    return PriorityNode;
}();
