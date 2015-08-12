# Screeps
![https://travis-ci.org/pmaidens/screeps.svg?branch=master](https://travis-ci.org/pmaidens/screeps.svg?branch=master)

### Purpose
The purpose of my AI is not to be the top of the leader charts, nor is it to destroy everything and everyone. I am taking a very different approach to the game. I am using it strictly as a way for me to learn about AI. This means that my script may not be the "best" script out there, but it will hopefully be interesting and fun to write. I am also going to try to make it very efficient so that I can keep my daily CPU usage down.

## Code Architecture

### Path Finding - To Be Implemented
In order to keep path finding costs low, I am going to try to implement an algorithm inspired by the flow field algorithm.  
The idea is simple. Whenever a room is captured, a path calculating algorithm will be kicked off. This algorithm contains several steps:

1. Identify each location of interest (LOI) (ie sources, spawns, some structures, exits, etc.).
2. Compute paths between each LOI using A*.
3. Take the positions at the LOIs and each step of the computed paths and add in each position within 2 moves of them. This becomes the map that will be considered.
4. Calculate and cache the path distance and the direct distance to each LOI from each position.

Since all the likely paths are now precomputed, computing how each creep needs to move becomes much more simple.

1. Each creep looks at the cache of distances for their position and target.
2. **IF** the direction specified by the cache is not obstructed (eg. by a creep) **THEN** it moves in the path direction
3. **ELSE IF** the direction specified is blocked by a creep and the creep is moving to the same target **THEN** the creep moves in the same direction as the obstructing creep as long as it is traversable terrain.
4. **ELSE** the creep looks at all the adjacent positions and moves to the position with the lowest path and direct distance that is unobscured as long as the lowest path distance is lower than the path distance from their current position.

This makes the complexity for each creeps movement O(c), and the more advanced and time consuming computations are done rarely.

######Local Optima
In the case where a local optima problem occurs, the creep will decide to go to the location with a larger x value. If, and only if, both x values are equal it will go towards the location with a larger y value.

##### Drawbacks
The major drawback to this implementation is that all the possible paths must be computed every time the room's configuration changes. This means that when a structure is built, the room must compute all the possible paths again. This means that structure building should be kept to a minimum. Ideally, any new blocking structure should be built outside of the currently known map; this will make it so that the current paths don't need to be recalculated, instead only new paths to any LOI needs to be added.

##### Future improvements
- **Step 2 Mapping:** Instead of calculating the paths between each LOI, only compute the path between LOIs that creeps are likely going to need to move between, then make sure that each LOI is accessible in some way from each other.
- **Step 2 Mapping:** Use the computed paths to add construction sites for roads
- **Step 4 Moving:** If the blocking object is not a creep, signal the room to recompute the paths.
