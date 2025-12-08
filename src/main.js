import { WORDS } from './words.js';

const NUMBER_OF_GUESSES = 6;
const WORD_LENGTH = 5;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
const rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];

// Defined constants for animation timing
const CHRISTMAS_LIGHTS_DELAY = 500;
const JUDGE_DISPLAY_DELAY = 250;

const ALL_DELAYS = CHRISTMAS_LIGHTS_DELAY + JUDGE_DISPLAY_DELAY;

function initBoard() {
    const board = document.getElementById('game-board');

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        const row = document.createElement('div');
        row.className = 'letter-row flex';

        for (let j = 0; j < WORD_LENGTH; j++) {
            const box = document.createElement('div');
            box.className = 'letter-box';
            row.appendChild(box);
        }

        board.appendChild(row);
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName('keyboard-button')) {
        if (elem.textContent === letter) {
            elem.style.backgroundColor = color;
            break;
        }
    }
}

function deleteLetter() {
    if (nextLetter === 0) {
        return;
    }
    nextLetter -= 1;
    const row = document.getElementsByClassName('letter-row')[6 - guessesRemaining];
    const box = row.children[nextLetter];
    box.textContent = '';
    box.classList.remove('filled-box');
    currentGuess.pop();
}

function checkGuess() {
    const row = document.getElementsByClassName('letter-row')[6 - guessesRemaining];
    let guessString = '';
    const rightGuess = Array.from(rightGuessString);
    const rightGuessCopy = Array.from(rightGuessString);

    for (const val of currentGuess) {
        guessString += val;
    }

    if (guessString.length !== WORD_LENGTH) {
        alert('Not enough letters!');
        return;
    }

    if (!WORDS.includes(guessString)) {
        alert('Not an English word!');
        return;
    }

    christmasLights(row, true);

    setTimeout(() => {
        for (let i = 0; i < WORD_LENGTH; i++) {
            let letterColor = '';
            const box = row.children[i];
            const letter = currentGuess[i];

            const letterPosition = rightGuessCopy.indexOf(currentGuess[i]);
            // is letter in the correct guess
            if (letterPosition === -1) {
                letterColor = 'grey';
            } else if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green';
            } else {
                letterColor = 'yellow';
            }

            rightGuessCopy[letterPosition] = '_';

            const delay = 50 * i;
            setTimeout(() => {
                box.style.backgroundColor = letterColor;
                shadeKeyBoard(letter, letterColor);
            }, delay);
        }
    }, CHRISTMAS_LIGHTS_DELAY * 5);

    if (guessString === rightGuessString) {
        if (guessesRemaining >= 1) {
            guessesRemaining = 0;
        }
        setTimeout(() => {
            alert('You guessed right! Game over!');
        }, ALL_DELAYS + 10);

        return;
    }

    guessesRemaining -= 1;
    currentGuess = [];
    nextLetter = 0;

    if (guessesRemaining <= 0) {
        setTimeout(() => {
            alert("You've run out of guesses! Game over!");
            alert(`The right word was: "${rightGuessString}"`);
        }, ALL_DELAYS + 10);
    }
}

function insertLetter(pressedKey) {
    if (nextLetter === WORD_LENGTH) {
        return;
    }
    pressedKey = pressedKey.toLowerCase();

    const row = document.getElementsByClassName('letter-row')[6 - guessesRemaining];
    const box = row.children[nextLetter];
    box.textContent = pressedKey;
    box.classList.add('filled-box');
    currentGuess.push(pressedKey);
    nextLetter += 1;
}

/**
 * Plays a christmas lights animation. Calls itself recursively 5 times.
 * @param {HTMLCollectionOf} row - The current guess row.
 * @param {boolean} cycle_flag - Determines if the alternating pattern starts on box 0 or box 1
 * @param {number} times_called - Indicates how many cycles of the animation have run
 * @returns Nothing.
 */
function christmasLights(row) {
    let cycle_flag = true;
    for (let counter = 0; counter <= 5; counter++) {
        setTimeout(() => {
            for (let i = 0; i < WORD_LENGTH; i++) {
                const box = row.children[i];

                if (cycle_flag) {
                    // animation starts on first element
                    if (i % 2 === 0) {
                        box.style.backgroundColor = 'red';
                    } else {
                        box.style.backgroundColor = 'green';
                    }
                } else if (i % 2 === 0) {
                    //I don't like the way this looks, but the formatter forced it
                    box.style.backgroundColor = 'green';
                } else {
                    box.style.backgroundColor = 'red';
                }
            }

            cycle_flag = !cycle_flag;
        }, CHRISTMAS_LIGHTS_DELAY * counter);
    }
}

document.addEventListener('keyup', e => {
    if (guessesRemaining === 0) {
        return;
    }

    const pressedKey = String(e.key);
    if (pressedKey === 'Backspace' && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === 'Enter') {
        checkGuess();
        return;
    }

    const found = pressedKey.match(/[a-z]/gi);
    if (!found || found.length > 1) {
        return;
    }
    insertLetter(pressedKey);
});

document.getElementById('keyboard-cont').addEventListener('click', e => {
    const target = e.target;

    if (!target.classList.contains('keyboard-button')) {
        return;
    }
    let key = target.textContent;

    if (key === 'Del') {
        key = 'Backspace';
    }

    document.dispatchEvent(new KeyboardEvent('keyup', { key: key }));
});

initBoard();
