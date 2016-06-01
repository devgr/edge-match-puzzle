process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const thread = require('child_process');

var card = function(number, images){
    this.image1 = {image: images[0].image, value: images[0].value};
    this.image2 = {image: images[1].image, value: images[1].value};
    this.image3 = {image: images[2].image, value: images[2].value};
    this.image4 = {image: images[3].image, value: images[3].value};

    this.cardNumber = number;
    this.orientation = 1;
};

card.prototype.getImage = function(place){

    switch(place){
        case 'top':
            //top image orientation 1 = image 1
            // orientation 2 top = image2
            // orientation 3 top = image 3
            // orientation 4 top = image 4
            switch(this.orientation){
                case 1:
                    return this.image1;
                    break;
                case 2:
                    return this.image2;
                    break;
                case 3:
                    return this.image3;
                    break;
                case 4:
                    return this.image4;
                    break;
                default:
                    // this is an error
                    return;
            }
            break;
        case 'bottom':
            // orientation 1 bottom = image 3
            // orientation 2 bottom = image 4
            // 3 bottom = image 1
            // 4 bottom = image 2
            switch (this.orientation) {
                case 1:
                    return this.image3;
                    break;
                case 2:
                    return this.image4;
                    break;
                case 3:
                    return this.image1;
                    break;
                case 4:
                    return this.image2;
                    break;
                default:
                    // error
                    return;
            }
            break;
        case 'left':
            // 1 left = image 4
            // 2 left = image 1
            // 3 left = image 2
            // 4 left = image 3
            switch(this.orientation){
                case 1:
                    return this.image4;
                    break;
                case 2:
                    return this.image1;
                    break;
                case 3:
                    return this.image2;
                    break;
                case 4:
                    return this.image4;
                    break;
                default:
                    // error
                    return;
            }
            break;
        case 'right':
            // 1 right = image 2
            // 2 right = image 3
            // 3 right - image 4
            // 4 right = image 1
            switch(this.orientation){
                case 1:
                    return this.image2;
                    break;
                case 2:
                    return this.image3;
                    break;
                case 3:
                    return this.image4;
                    break;
                case 4:
                    return this.image1;
                    break;
                default:
                    //error
                    return;
            }
            break;
        default:
            // error
            break;
    }
};



var cardCreation = function(){
    var image1 = 'earth'; // 0 = madagascar
    var image2 = 'mars'; // 1 = small
    var image3 = 'saturn'; //0 = dark
    var image4 = 'jupiter'; //1 = no spot

    var card1 = new card(1, [
        {image: image1, value: 1},
        {image: image3, value: 1},
        {image: image2, value: 1},
        {image: image1, value: 0}
    ]);
    var card2 = new card(2, [
        {image: image3, value: 0},
        {image: image1, value: 1},
        {image: image4, value: 1},
        {image: image2, value: 1}
    ]);
    var card3 = new card(3, [
        {image: image4, value: 0},
        {image: image2, value: 0},
        {image: image3, value: 1},
        {image: image1, value: 0}
    ]);
    var card4 = new card(4, [
        {image: image1, value: 0},
        {image: image4, value: 0},
        {image: image2, value: 0},
        {image: image4, value: 1}
    ]);
    var card5 = new card(5, [
        {image: image1, value: 0},
        {image: image4, value: 0},
        {image: image2, value: 1},
        {image: image3, value: 1}
    ]);
    var card6 = new card(6, [
        {image: image2, value: 0},
        {image: image3, value: 1},
        {image: image4, value: 1},
        {image: image1, value: 1}
    ]);
    var card7 = new card(7, [
        {image: image2, value: 0},
        {image: image3, value: 0},
        {image: image4, value: 0},
        {image: image3, value: 0}
    ]);
    var card8 = new card(8, [
        {image: image3, value: 0},
        {image: image2, value: 1},
        {image: image4, value: 1},
        {image: image1, value: 1}
    ]);
    var card9 = new card(9, [
        {image: image2, value: 0},
        {image: image4, value: 0},
        {image: image1, value: 0},
        {image: image3, value: 1}
    ]);

    return [card1, card2, card3, card4, card5, card6, card7, card8, card9];
};

/*(function solve(){
    // spawn child processes and solve;
    var cards = new cardCreation();

    for(var i = 0; i < 9; i++){
        var worker = thread.spawn('node', ['solver_utility.js', i, JSON.stringify(cards)]);
        worker.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        worker.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        worker.on('close', function (code) {
            console.log('child process exited with code ' + code);
        });
    }
})();*/

function printSolution(){
    for(var row = 0; row < 3; row++){
        for(var col = 0; col < 3; col++){
            var card = grid[row][col];
            if(card) {
                console.log('card number: ', card.cardNumber, card.getImage('top'))
            }
        }
    }
    console.log('Number of Comparisons: ', comparisons);
}

function solver(curRow, curCol, deck){
    if(deck.length === 0){
        console.log('Solution Found.');
        solutionFound = true;
        printSolution();
        return;
    }

    // For each card in the deck
    for(var card in deck){

        // Next Card
        var cardToFit = deck[card];
        // For each orientation of the card
        for(var orientation = 1; orientation < 5; orientation++) {
           /* if(solutionFound){
                return;
            }*/
            // re-set the card orientation
            cardToFit.orientation = orientation;

            // is this the first card?
            if(curRow === 0 && curCol === 0){
                grid[curRow][curCol] = cardToFit;
                solver(curRow, curCol + 1, getAvailableCards(deck, cardToFit));
            }
            // Check to see if the card fits
            else {
                // This is how I am handling droping down a row and starting at col 0
                var nextCol, nextRow, prevCol, prevRow;
                if(curCol === 3){
                    prevCol = 2;
                    prevRow = curRow;
                    nextCol = 0;
                    nextRow = curRow + 1;
                } else {
                    prevCol = curCol - 1;
                    prevRow = curRow;
                    nextCol = curCol;
                    nextRow = curRow;
                }
                if (cardFits( cardToFit, prevRow, prevCol, nextCol, nextRow)) {
                    grid[nextRow][nextCol] = cardToFit;

                    solver(nextRow, nextCol+1, getAvailableCards(deck, cardToFit));
                }
            }
        }
    }
}

function cardFits(cardToFit, curRow, curCol, nextCol, nextRow){

    comparisons++;
    // We are on the top row and only need to match left side
    if (curRow === 0 && nextRow < 1) {
        var currentCard = grid[curRow][curCol];
        // get the current cards right image
        var curImage = currentCard.getImage('right');
        var nextImage = cardToFit.getImage('left');

        return curImage.image === nextImage.image && curImage.value !== nextImage.value;
    } else {
        if(nextCol === 0){
            // we only need to match the top;
            var topCard = grid[curRow][0];
            var curImage = topCard.getImage('bottom');
            var nextImage = cardToFit.getImage('top');

            return curImage.image === nextImage.image && curImage.value !== nextImage.value;
        }else {
            // We must match left and top images for new card.
            var leftCard = grid[nextRow][nextCol - 1];
            var curLeft_RightImage = leftCard.getImage('right');
            var nextLeftimage = cardToFit.getImage('left');
            if (curLeft_RightImage.image === nextLeftimage.image && curLeft_RightImage.value !== nextLeftimage.value) {
                var topCard = grid[nextRow -1][nextCol];
                var topBottomImage = topCard.getImage('bottom');
                var curTopImage = cardToFit.getImage('top');
                return topBottomImage.image === curTopImage.image && topBottomImage.value !== curTopImage.value;
            }
        }
    }

}

// Looks through our answer grid and filters out any cards that are already placed as on the grid.
// This is temporary and only copies the original card list.
function getAvailableCards(deck, cardToFit){
    var cards = deck.filter(function(card){
        return card != cardToFit;
    });
    return cards;
}

var comparisons = 0;
var grid = [[],[],[]];
var curRow = 0;
var curCol = 0;
var originalCardList = new cardCreation();
var solutionFound = false;

// pass in the current card so recursive function not only handles next cards but also rotations.
solver( curRow, curCol, originalCardList);
