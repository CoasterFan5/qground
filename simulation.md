# This is the official simulation plan

1. When a grid element is placed, we will determine inputs and outputs of the system using "nets". A wire piece belongs to a net. Nets can have a single input but may have unlimited outputs, this means we don't have to determine what happens if two gates attempt to settle a value for a single net, we just don't allow that. 
2. We also at this stage look for cycles, a cycle is a path where the same node is visited twice within the same path, for instance a -> not-1 -> or-2 -> and-3 -> not-1 would be invalid as it contains feedback, we don't want that since this is a simplified teaching system.
3. When the simulation runs, we get the output by tracing all paths based on levels, items are assigned to levels based on their required number of calculated inputs, so in this system: `a -> not-1 -> or-2 -> and-3`, a would be level 0, not-1 would be level 1, or-2 would be level 2, and and-3 would be level 3.
