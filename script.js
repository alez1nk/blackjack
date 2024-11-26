import createCards from "./createCards.js";

//constant deck to use for resets
const constDeck = createCards();

//variable deck
let deck = [...constDeck];

//helper functions ADD TO OWN DOC LATER
function getRandom(index) {
    const r = Math.floor(Math.random() * index);
    return r;
}

function findDoc(id) {
    return document.getElementById(id);
}

function drawImage(card, hand, back) {
    const newImage = document.createElement('img');

    if (back) {
        newImage.src = 'images/png/back.png' 
        newImage.classList.add('hidden')
    } else {
        newImage.src = `images/png/${card.name}_of_${card.suit}.png`;
    }
    
    hand.appendChild(newImage);
}

function checkScore(array) {
    let score = 0;
    let acesCount = 0;

    for (let i = 0; i < array.length; i++) {
        //add more stuff for ace checks
        if (array[i].name === 'ace') {
            //if ace check if 11 brings you over 21
            score += 11;
            acesCount++;
        } else {
            score += array[i].value;
        }
    }
    while (score > 21 && acesCount > 0) {
        score -= 10;
        acesCount --;
    }

    return score;
}

function alterWallet(amount) {
    console.log('alter by: ' + amount)
    const walletBeforeAmount = parseInt(wallet.textContent.match(/\d+/));
    wallet.textContent = `$${walletBeforeAmount + parseInt(amount)}`;
}

function onWin() {
    console.log(checkScore(playerCards));
    gameOver = true;
    console.log('you win!')
    alterWallet(betAmount);
    gameRunning = false;
}

function onLoss() {
    console.log(checkScore(playerCards));
    gameOver = true;
    console.log('you lost');
    alterWallet(-betAmount);
    gameRunning = false;
}

//variables
const playerCards = [];
const dealersCards = [];
let gameOver = true;
let turnOver = false;
let gameRunning = false;
let betAmount = 0;
//getElementById type stuff
const playerHand = findDoc('playerHand')
const dealerHand = findDoc('dealerHand')
const startButton = findDoc('start');
const resetButton = findDoc('reset')
const hitButton = findDoc('hit');
const standButton = findDoc('stand');
const bet = findDoc('input');
const wallet = findDoc('wallet')

//actually start stuff now
function drawCards(hand, amount) {
    const cardsArray = hand.id === 'playerHand' ? playerCards : dealersCards; 
    //draw two cards
    for (let i = 0; i < amount; i++) {
        const index = getRandom(deck.length);
        const chosenCard = deck[index];
        cardsArray.push(chosenCard);
        deck.splice(index, 1);
        
        const hide = hand.id === 'dealerHand' && i === 0 && turnOver === false ? true : false;
        drawImage(chosenCard, hand, hide);
    }
    //console.log(hand.id);
    //console.log(cardsArray);
}

//i see why people use frameworks now
startButton.addEventListener('click', () => {
    if(gameRunning === true) {
        return console.log('game is running lock in bru')
    }
    if (bet.value === '' || parseInt(bet.value) === 0 || bet.value > parseInt(wallet.textContent.match(/\d+/))) {
        return console.log('bet invalid');
    }
    reset();
    gameOver = false;
    gameRunning = true;
    betAmount = bet.value;
    drawCards(dealerHand, 2);
    drawCards(playerHand, 2);
})


function reset() {
    deck = [...constDeck];
    playerCards.length = 0;
    dealersCards.length = 0;
    playerHand.innerHTML = '';
    dealerHand.innerHTML = '';
    gameOver = false;
    turnOver = false;
}
resetButton.addEventListener('click', () => {
    if (gameRunning === true) {
        return console.log('gasme runing')
    }
    bet.value = '';
    reset();
});

//gameloop??
standButton.addEventListener('click', () => {
    console.log(checkScore(playerCards));
    if(gameOver === true) {
        return console.log('game over dummy')
    }
    turnOver = true;
    const playerScore = checkScore(playerCards);
    //unreveal the card
    dealerHand.innerHTML = '';
    dealersCards.forEach((card) => {
        drawImage(card, dealerHand, false);
    })
    //add stuff for dealer to do
    let dealerScore = checkScore(dealersCards);
    
    //recursive function to hit
    function dealerTurn() {
        if (dealerScore < 17) {
            setTimeout(() => {
                drawCards(dealerHand, 1);
                dealerScore = checkScore(dealersCards);
                dealerTurn();
            }, 1000);
        } else {
            //end game logic
            gameOver = true;
            if (dealerScore > 21) {
                onWin();
            } else if (dealerScore > playerScore) {
                onLoss();
            } else if (dealerScore < playerScore) {
                onWin();
            } else if (dealerScore === playerScore) {
                console.log('you tied');
                gameRunning = false;
            }
        }
    }
    dealerTurn();
})

hitButton.addEventListener('click', () => {
    console.log(checkScore(playerCards));
    if (turnOver === false && gameOver === false) {
        drawCards(playerHand, 1);
        //check if over 21
        if (checkScore(playerCards) === 21) {
            //win
            gameOver = true;
            onWin();
        } else if (checkScore(playerCards) > 21) {
            //lose
            gameOver = true;
            onLoss();
        }
    }
})