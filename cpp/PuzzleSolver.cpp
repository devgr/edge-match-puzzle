#include <iostream>
#include <vector>
#include <stdlib.h>
#include <time.h>
#include <string>
#include <sstream>
using namespace std;
#define RIGHT 0
#define BOTTOM 1
#define LEFT 2
#define TOP 3

struct card{
	short id;
	short rotation;
	char values[4];
};
struct match{
	short id;
	short side;
};

card* parseInput(const string in, int n);
void solve(card* deck, int n);

// Helper functions borrowed from PuzzleGenerator
card* randomPuzzle(int n);
int friendlyValue(char v);
string twoCharValue(char v);
void printDeck(card* deck, int n);
void printDeckJSON(card* deck, int n);
void printDeckString(card* deck, int n);
card* copyDeck(card* deck, int n);
void scrambleDeck(card* deck, int n);

// helper
vector<string> split(const string &s, char delim);


int main(int argc, char *argv[]){
	srand(time(NULL));
	bool generate = false;
	card* deck;
	int n = 3;

	for(int i = 1; i < argc; i++){
		if(strcmp(argv[i], "-gen") == 0)
			generate = true;
		else if(strcmp(argv[i], "-n") == 0)
			n = stoi(argv[i + 1]);
	}

	if(generate)
		deck = randomPuzzle(n);
	else{
		string input;
		// Test data:
		input = "4+1-2-1+,1-2+4-1+,2+4-1+1-,3+4+2-1+,2+2+3-2-,3+4+2-4+,1-4+4-4-,4-2-1+2-,2+1+4+4-"; // solved order
		//input = "1-3+1-1+,4+4+1+2+,3-4+4-4+,1-4+3-3-,1+4-1+4-,2+1+1-4-,4-2+3+4-,1-3+4+4+,3-3-1+1-"; // scrambled
		//cin >> input;
		deck = parseInput(input, n);
	}
	
	solve(deck, n);

	printDeckString(deck, n);
	
	return 0;
}

card* parseInput(const string in, int n){
	card* deck = new card[n * n];
	vector<string> cardArr = split(in, ',');
	for(int i = 0, len = cardArr.size(); i < len; i++){
		string currCard = cardArr[i];
		if(currCard.length() == 8){
			deck[i].id = i;
			deck[i].rotation = 0;
			for(int v = 0; v < 4; v++){
				char num = currCard[v * 2] - 48;
				if(currCard[v * 2 + 1] == '-'){
					// flip
					num = -num;
				}
				else{
					// positive, so just subtract 1 (undoing the encoding that was done in twoCharValue)
					num--;
				}
				deck[i].values[v] = num;
			}
		}
	}
	return deck;
}


void solve(card* deck, int n){

}


vector<match>* precalcSides(const card* deck, int n){
	auto calcs = new vector<match>[8];
	for(int i = 0, len = n * n; i < len; i++){ // loop through deck
		for(int v = 0; v < 4; v++){ // loop through sides
			int idx = deck[i].values[v]+4; // the +4 is the magic number
			calcs[idx].push_back(match());
			calcs[idx].back().id = deck[i].id;
			calcs[idx].back().side = v; // what side is it, relative to a 0 card rotation? 
				// when matching, set card rotation to (NEEDED - side + 4) % 4
		}
	}
	return calcs;
}
vector<match>** precalcCorners(const card* deck, int n){
	auto calcs = new vector<match>*[8];
	for(int a = 0; a < 8; a++){
		calcs[a] = new vector<match>[8];
	}

	for(int i = 0, len = n * n; i < len; i++){ // loop through deck
		for(int side1 = 0; side1 < 4; side1++){ // loop through sides
			int side2 = (side1 + 1) % 4;
			int row = deck[i].values[side1]+4; // the +4 is the magic number
			int col = deck[i].values[side2]+4;

			calcs[row][col].push_back(match());
			calcs[row][col].back().id = deck[i].id;
			calcs[row][col].back().side = side1; // have to figure out rotation differently because corner
		}
	}
	return calcs;
}


// Helper functions borrowed from PuzzleGenerator ---------------------------

// generates a random valid puzzle
// n is the width of the square board
card* randomPuzzle(int n){
	card* deck = new card[n * n];
	for(int i = 0; i < n; i++){
		for(int j = 0; j < n; j++){
			int idx = i * n + j;

			// initialize card
			deck[idx].id = idx;
			deck[idx].rotation = 0;
			for(int k = 0; k < 4; k++)
				deck[idx].values[k] = rand() % 8 - 4;

			// set specific values to match, to make a valid puzzle
			if(i > 0) // set top
				deck[idx].values[TOP] = ~deck[(i - 1) * n + j].values[BOTTOM];
			if(j > 0) // set left
				deck[idx].values[LEFT] = ~deck[i * n + j - 1].values[RIGHT];
		}
	}

	return deck;
}

int friendlyValue(char v){
	int val = (int)v;
	if(val >= 0)
		val++;
	return val;
}
string twoCharValue(char v){
	string result = "";
	int val = (int)v;
	if(val >= 0){
		val++;
		result += to_string(val) + "+";
	}
	if(val < 0){
		val = -val;
		result += to_string(val) + "-";
	}
	return result;
}

void printDeck(card* deck, int n){
	for(int i = 0; i < n; i++){
		cout << endl;
		for(int j = 0; j < n; j++){
			int idx = i * n + j;
			cout << "id " << deck[idx].id << " rotation " << deck[idx].rotation << endl;
			cout << "values (right, bottom, left, top) ";
			for(int k = 0; k < 4; k++)
				cout << friendlyValue(deck[idx].values[k]) << " ";
			cout << endl << endl;
		}
		cout << "-----" << endl;
	}
}
void printDeckJSON(card* deck, int n){
	cout << "[";
	for(int i = 0, len = n * n; i < len; i++){
		if(i != 0)
			cout << ",";
		cout << "[";
			for(int k = 0; k < 4; k++){
				if(k != 0)
					cout << ",";
				int rotate = (k - deck[i].rotation + 4) % 4;
				cout << friendlyValue(deck[i].values[rotate]);
			}
		cout << "]";
	}
	cout << "]";
}
void printDeckString(card* deck, int n){
	for(int i = 0, len = n * n; i < len; i++){
		if(i != 0)
			cout << ",";
		for(int k = 0; k < 4; k++){
			int rotate = (k - deck[i].rotation + 4) % 4;
			cout << twoCharValue(deck[i].values[rotate]);
		}
	}
}

card* copyDeck(card* deck, int n){
	card* copy = new card[n * n];
	for(int i = 0, len = n * n; i < len; i++)
			copy[i] = deck[i];
	return copy;
}


void scrambleDeck(card* deck, int n){
	// Array scramble alogrithm based on the Fisher-Yates shuffle
	// In-place, O(n)
	// algorithm explanation here: https://bost.ocks.org/mike/shuffle/
	for(int i = n * n; i > 0; i--){
		// Start from the end of the array and swap with a random index from 
		// the unshuffled (lower) part of the array.
		int currIndex = i - 1;
		int randIndex = rand() % i;

		card temp = deck[currIndex];
		deck[currIndex] = deck[randIndex];
		deck[randIndex] = temp;
	}

	// also randomize the rotations
	for(int i = n * n; i > 0; i--){
		deck[i].rotation = rand() % 4;
	}
}

// http://stackoverflow.com/a/236803
vector<string> split(const string &s, char delim) {
    vector<string> elems;
    stringstream ss(s);
    string item;
    while (getline(ss, item, delim)) {
        elems.push_back(item);
    }
    return elems;
}