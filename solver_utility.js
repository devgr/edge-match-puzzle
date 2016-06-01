

function printSolution(){
    for(var col = 0; col < 3; col++){
        for(var row = 0; row < 2; row++){
            var card = grid[col][row];
            console.log('card number: ', card.cardNumber, card.getImage('top'))
        }
    }
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
            if(solutionFound){
                return;
            }
            // re-set the card orientation
            cardToFit.orientation = orientation;

            // is this the first card?
            if(!grid[0][0]){
                grid[curRow][curCol] = cardToFit;
                solver(curRow, curCol, getAvailableCards(deck, cardToFit));
            }
            // Check to see if the card fits
            else {
                // Get the position/positions to check
                //get new card position
                var nextCol, nextRow;
                if(curCol === 2){
                    nextCol = 0;
                    nextRow = curRow + 1;
                } else {
                    nextCol = curCol + 1;
                    nextRow = curRow;

                }
                if (cardFits( cardToFit, curRow, curCol, nextCol, nextRow)) {
                    /* var nextCol = curCol + 1;
                     grid[curRow][nextCol] = cardToFit;*/
                    grid[nextRow][nextCol] = cardToFit;

                    solver(nextRow, nextCol, getAvailableCards(deck, cardToFit));

                }
            }
        }
    }
}

function cardFits(cardToFit, curRow, curCol, nextCol, nextRow){
    var currentCard = grid[curRow][curCol];
    // First initial case. These cards will be equal
    if(currentCard == null){
        return true;
    }
    // We are on the top row and only need to match left side
    if (curRow === 0 && nextRow < 1) {
        // get the current cards right image
        var curImage = currentCard.getImage('right');
        var nextImage = cardToFit.getImage('left');

        return curImage.image === nextImage.image && curImage.value !== nextImage.value;
    } else {
        if(nextCol === 0){
            // we only need to match the top;
            var topCard = grid[0][nextRow -1];
            var curImage = topCard.getImage('bottom');
            var nextImage = cardToFit.getImage('top');

            return curImage.image === nextImage.image && curImage.value !== nextImage.value;
        }else {
            // We must match left and top images for new card.
            var rightCard = grid[nextCol - 1][nextRow];
            var curRightImage = rightCard.getImage('right');
            var nextLeftimage = cardToFit.getImage('left');
            if (curRightImage.image === nextLeftimage.image && curRightImage.value !== nextLeftimage.value) {
                var topCard = grid[nextCol][curRow-1];
                var topBottomImage = topCard.getImage('bottom');
                var curTopImage = cardToFit.getImage('top');
                if( topBottomImage.image === curTopImage.image && topBottomImage.value !== curTopImage.value){
                    return true;
                } else {
                    return false;
                }
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


var originalCardList = JSON.parse(process.argv[3]);




var grid = [[],[],[]];
var curRow = 0;
var curCol = 0;
//var originalCardList = deck;
var solutionFound = false;

// pass in the current card so recursive function not only handles next cards but also rotations.
solver( curRow, curCol, originalCardList);
