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

### PuzzleSolver.cpp
Command line program that takes in a puzzle from standard input and solves it. Usage:

* `./PuzzleSolver` takes in a 3x3 puzzle from standard input, in the default format that is output by the PuzzleGenerator. Outputs a solution (one per line) to standard out, with this format:
	* `0r1,1r3,4r0...` where the first number is the index of the card from the input, and the number after the r is the number of _counter-clockwise_ turns to rotate the card.
* `./PuzzleGenerator -scramble | ./PuzzleSolver`
* `./PuzzleSolver -n 4` accept a puzzle of a larger size.

Compilation Linux / Mac: `gcc PuzzleSolver.cpp -o PuzzleSolver -std=c++11 -fopenmp`

Compilation Visual Studio: https://msdn.microsoft.com/en-us/library/fw509c3b.aspx
