const MIN_NUMBER = 1,
      MAX_NUMBER = 100;

let answer;
let attempts = 0;

const guessInput = document.getElementById('guess-inp'),
      submitGuess = document.getElementById('submit-guess'),
      feedback = document.getElementById('feedback'),
      hint = document.getElementById('hint'),
      attemptsDisplay = document.getElementById('attempts'),
      newGame = document.getElementById('new-game');

guessInput.disabled = true;

newGame.addEventListener ('click', ()=> {
    //create a random number
    answer = parseInt((Math.random() * (MAX_NUMBER - MIN_NUMBER) +1));

    guessInput.disabled = false;
    newGame.classList.toggle('hidden');
    submitGuess.classList.toggle('hidden');

    attempts = 0;
    attemptsDisplay.textContent = `Tries: ${attempts}`;
    hint.style.color = '#8a2be2';

    submitGuess.addEventListener('click',  checkGuess);
});

function checkGuess() {
    let userGuess = parseInt(guessInput.value);

    if (isNaN(userGuess) || userGuess < MIN_NUMBER || userGuess > MAX_NUMBER) {
        feedback.textContent = 'enter correct number';
        hint.textContent = '';
        console.log(userGuess, answer);
        return;
    }
    
    attempts++;
    attemptsDisplay.textContent = `tries : ${attempts}`;

    if (userGuess === answer) {
        feedback.textContent = 'you guessed';
        hint.textContent = '';
        submitGuess.classList.toggle("hidden");
        newGame.classList.toggle('hidden');
        guessInput.disabled = true;
    }
    else if (userGuess > answer) {
        feedback.textContent = '';
        hint.textContent = 'number is smaller';
    }
    else {
        feedback.textContent = '';
        hint.textContent = 'number is bigger';
    }
    guessInput.value = '';
}