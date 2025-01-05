# Conway's Game of Life

This is a pure JavaScript/HTML/CSS implementation of <a href="https://en.wikipedia.org/wiki/Conway's_Game_of_Life" target="_blank">Conway's Game of Life</a>. This implementation does not use any external libraries, and also does not use a canvas, but rather an HTML table element. 

Conway's Game of Life is not a traditional game (there are no players), but rather a cellular automaton on a two dimensional grid, where each cell can be in one of two states: dead or alive. Each cell can have up to 8 neighbours (in every direction around it, including diagonally). The rules of the game are:

* A live cell that has less than 2 neighbours dies of loneliness.
* A live cell that has 2 or 3 neighbours survives to the next generation.
* A live cell that has more than 3 neighbours dies of overpopulation.
* A dead cell that has exactly 3 living neighbours becomes alive as if by reproduction.

The rules are applied simultaneously to all cells of a generation (or 'tick') before their state changes.
The game is initialized by a 'seed', which is the first state of all cells in it.

You can seed the game by clicking on cells to set its state to alive or dead. You can find popular seed patterns <a href="https://en.wikipedia.org/wiki/Conway's_Game_of_Life#Examples_of_patterns" target="_blank">here</a>.
Once you are satisfied with your seeding, use the 'Start Life!' button to let life find its way. You can always use the reset button to start over.
