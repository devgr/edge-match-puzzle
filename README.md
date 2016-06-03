# edge-match-puzzle
edge match puzzle solver 

This is a solution for a 3x3 Edge-Match puzzle.
puzzle.js is the main file. solver_utility.js is not used as of now. It is for a multi-threaded solution.

TO run use "node puzzle.js" on the command line.

It will find correct solutions and incorrect solutions. Bug fixes on the way.


## Other versions
C++ version located in the cpp directory.

### PuzzleGenerator.cpp
Command line program that randomly generates new valid puzzles, and scrambles them. Usage:

* `./PuzzleGenerator` prints a 3x3 puzzle (in solved order) to std out.
* `./PuzzleGenerator -n 4` prints a 4x4 puzzle. Increase the number for more fun.
* `./PuzzleGenerator -n 4 -scramble` prints a puzzle in a scrambled order.
* `./PuzzleGenerator -json` prints in a javascript or python friendly format, as nested lists.
* `./PuzzleGenerator -pretty` prints the puzzle in a more human friendly format.

Compilation: `gcc PuzzleGenerator.cpp -o PuzzleGenerator -std=c++11`
