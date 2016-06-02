#include <iostream>
#include <vector>
#include <stdlib.h>
#include <time.h>
using namespace std;
#define N 3
#define RIGHT 0
#define BOTTOM 1
#define LEFT 2
#define TOP 3

struct card{
	short id;
	short rotation;
	char values[4];
};

card* randomPuzzle(int n);
int friendlyValue(char v);
void printDeck(card* deck, int n);
card* copyDeck(card* deck, int n);
void scrambleDeck(card* deck, int n);

int main(){
	srand(time(NULL));

	card* deck = randomPuzzle(N);

	printDeck(deck, N);

	card* originalDeck = copyDeck(deck, N);

	scrambleDeck(deck, N);

	printDeck(deck, N);
	
	return 0;
}

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

void printDeck(card* deck, int n){
	for(int i = 0; i < N; i++){
		for(int j = 0; j < N; j++){
			int idx = i * N + j;
			cout << "id " << deck[idx].id << " rotation " << deck[idx].rotation << endl;
			cout << "values (right, bottom, left, top) ";
			for(int k = 0; k < 4; k++)
				cout << friendlyValue(deck[idx].values[k]) << " ";
			cout << endl << endl;
		}
		cout << "-----" << endl;
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