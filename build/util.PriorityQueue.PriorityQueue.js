

module.exports =function() {
    function PriorityQueue (arr) {
        this.heap = [];
        if (arr) {
            for (i=0; i< arr.length; i++) {
                this.pushNode(arr[i]);
            }
        }
    }

    PriorityQueue.prototype = {
        push: function (data, priority) {
            var targetIndex = this._getPriorityIndex(priority);

            if(this._comparePriorityAtIndex(targetIndex, priority)) {
                this.heap[targetIndex].push(data);
            } else {
                this.heap.splice(targetIndex, 0, (new PriorityNode(data, priority)));
            }
        },

        pushNode: function (node) {
            var targetIndex = this._getPriorityIndex(priority);

            if(this._comparePriorityAtIndex(targetIndex, priority)) {
                node.data.forEach(function (value) {
                    this.heap[targetIndex].push(value);
                });
            } else {
                this.heap.splice(targetIndex, 0, node);
            }
        },

        pop: function () {
            var result;
            var node = this.heap[0];
            if(node) {
                result = node.pop();
                if(!node.length) {
                    this.heap.splice(0, 1);
                }
            }
            return result;
        },

        _getPriorityIndex: function (priority) {
            var targetIndex = this.heap.length;

            this.heap.some(function (value, index) {
                if(value.priority >= priority) {
                    targetIndex = index;
                    return true;
                }
            });

            return targetIndex;
        },

        _comparePriorityAtIndex: function (index, priority) {
            return this.heap[targetIndex] && this.heap[targetIndex].priority === priority;
        },

        toString: function () {
            return "[object PriorityQueue]";
        },

        get length() {
            var length = 0;
            this.heap.forEach(function (node) {
                length += node.length;
            });
            return length;
        }
    };

    return PriorityQueue;
}();
