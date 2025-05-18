window.addEventListener('DOMContentLoaded', function() {
            //game global object
const game = {
    lives: 3,
    timerId: null,
    minSpeed: window.innerWidth <= 768 ? 400 : 700,
    gameSpeed: 1700,
    board: 16,
    startTime: 0
};

        //getting DOM elements
const startScreen = document.getElementById('start-screen'),
      gameContainer = document.getElementById('game-container'),
      gameOverScreen = document.getElementById('game-over')
      grid = document.getElementById('grid'),
      livesDisplay = document.getElementById('lives'),
      timerDisplay = document.getElementById('timer'),
      finalTime = document.getElementById('final-time'),
      startBtn = document.getElementById('start-btn')
      restartBtn = document.getElementById('restart-btn');

        //Sounds
const sounds = {
    hit: document.getElementById('hitSound'),
    miss: document.getElementById('missSound'),
    gameOver: document.getElementById('gameOverSound'),
    hitHeart: document.getElementById('hitHeartSound'),
    missHeart: document.getElementById('missHeartSound'),
};

        //Cells list
const cells = [];

        //Grid creation function
function createGrid() {
    grid.innerHTML = '';
    cells.length = 0;
    for (let i = 0; i < game.board; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
        cells.push(cell);
    }
}

        //getting random cell function
function getRandomCell() {
    return cells[Math.floor (Math.random() * cells.length)];
}
        //function of showing element(mole or heart)
function spawnElement(type) {
    if (game.lives <= 0) {
        checkGameOver();
        return;
    }
    
    const cell = getRandomCell();


    const element = document.createElement('img');
    element.src = type === 'mole' ? 'assets/mole.png' : 'assets/heart.png';
    element.classList.add(type);
    element.dataset.clicked = 'false';
    cell.appendChild(element);

    element.addEventListener('click', ()=> {
        if (element.dataset.clicked == 'false')
            handleClick(type, element);
        else {
            console.log('Elemenst has been already pressed');
        }
    });

    setTimeout(()=>{
        if (cell.contains(element) && type == 'mole' && element.dataset.clicked == 'false') {
            element.dataset.clicked = 'true';
            game.lives--;
            checkGameOver();
            livesDisplay.textContent = '❤️'.repeat(game.lives);
            livesDisplay.classList.add('blink');
            sounds.miss.play();
            setTimeout(()=> {
                livesDisplay.classList.remove('blink');
            }, 300);
        }
        if(type == 'heart' && element.dataset.clicked == 'false') {
            element.dataset.clicked = 'true';
            element.classList.add('heart-blink');
            sounds.missHeart.play();
        }
        else element.classList.add('mole-hide');
        setTimeout(()=> {
            delete element.dataset.clicked;
            element.remove();
        }, 500);
    }, Math.max(game.minSpeed, game.gameSpeed));
    setTimeout(gettingFaster, game.gameSpeed);

    }

        // Function of processing clicks on mole or heart
function handleClick(type, element) {
    if (element.dataset.clicked == 'true') {
        console.log('EXITING! already pressed')
        return;
    }
    element.dataset.clicked = 'true';
    element.classList.add(type === 'mole' ? 'mole-hit' : 'heart-glow');
    setTimeout(() => {
        delete element.dataset.clicked // deleting atribute
        element.remove(); //deleting element
    }, 500);

    if (type === 'mole') {
        console.log('Clicked mole');
        sounds.hit.play();
    } else {
        console.log('Clicked heart');
        game.lives++;
        livesDisplay.textContent = '❤️'.repeat(game.lives);
        livesDisplay.classList.add('blink');
        setTimeout(()=>{livesDisplay.classList.remove('blink');}, 300); //letting to play heart-blink animation
        sounds.hitHeart.play();
    }
}

        // Start game function
function startGame() {
    startScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    game.startTime = Date.now();
    game.timerId = setInterval(updateTime, 1000);
    game.lives = 3;
    game.gameSpeed = 1700;
    livesDisplay.innerText = '❤️'.repeat(game.lives);

    setTimeout(gettingFaster, game.gameSpeed);
}

function updateTime() {
    const pastedTime = Date.now() - game.startTime;
    timerDisplay.innerText = `Time : ${Math.floor((pastedTime/1000) / 60)}:${Math.floor((pastedTime/1000) % 60).toString().padStart(2, "0")}`;
}

        //function of accelerating spawn
function gettingFaster() {
    game.timer++;
    spawnElement(Math.random() < 0.9 ? 'mole' : 'heart');
    //lowering speed but not letting it to be lower than 600ms
    game.gameSpeed = Math.max(game.minSpeed, game.gameSpeed - 50);
    console.log('new speed:', game.gameSpeed);
}

        //Function of checking game over
function checkGameOver() {
    if (game.lives <= 0) {
        clearInterval(game.timerId);
        game.timerId = null;
        gameOverScreen.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        const totalTime = Date.now() - game.startTime;
        finalTime.innerText = `you lasted ${Math.floor(totalTime/1000)} sec.`;
        sounds.gameOver.play();
    }
}

        // restart game function
function restartGame() {
    gameOverScreen.classList.add('hidden');
    timerDisplay.innerText = 'time: 0:00'
    startGame();
}

        //launching game
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
createGrid();
});
