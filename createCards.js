//create deck of cards to use
function createDeck() {
    const cardNames = ['ace',2,3,4,5,6,7,8,9,10,'jack','queen','king'];
    const suitNames = ['spades', 'clubs', 'hearts', 'diamonds'];
        
    
    //helper function
    function getValue(card) {
        if (Number.isInteger(card) === true) {
            return card;
        } else if (card === 'ace') {
            return 1;
        } else if (typeof card == 'string') {
            return 10;
        }
    }

    //create card object
    function Card(name, suit) {
        this.name = name,
        this.suit = suit,
        this.value = getValue(name);
    }

    //nested for/map loop to create 52 objects
    const deck = suitNames.flatMap((suit) => cardNames.map((name) => new Card(name, suit)));
    deck.flat();
    return deck;
}

export default createDeck;