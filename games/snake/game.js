let intervalId = null;
const ScoreEl = document.getElementById('score');
const overlay = document.getElementById('overlay');
const recordEl = document.getElementById('record');

const board = document.querySelector('canvas');
const size = 25;
const rows = Math.floor((window.innerWidth - 50)/size),
      colls = Math.floor((window.innerHeight - 100)/size);
board.width = size * rows;
board.height = size * colls;

const c = board.getContext('2d');
let gameRunning = false
let directionChamged = false;
let highscore = +(localStorage.getItem('snakeRecord')) || 1;
recordEl.textContent = `Record: ${highscore}`;
const gameSpeed = window.innerWidth < 900 ? 160 : 80;

const touch = {
    startX: 0,
    startY: 0
}

const snake = {
    body: [{
        x: Math.floor((rows/2)) * size,
        y: Math.floor((colls/2)) * size,
    }],    
    direction: {dx: 1, dy:0},
    length: 1
}

const food = {
    x: undefined,
    y: undefined,
    placeFood: function() {
        let valid = true;

        while(valid) {
                food.x = Math.floor(1 + Math.random() * (rows - 2)) * size;
                food.y = Math.floor(1 + Math.random() * (colls - 2)) * size;

                valid = snake.body.some(seg => seg.x == this.x && seg.y == this.y)
        }
    }
};

function startGame() {
    resetGame();
    food.placeFood();
    intervalId = setInterval(draw, gameSpeed);
    overlay.classList.remove('show');
    gameRunning = true;
}

function resetGame() {
    snake.body = [{
        x: Math.floor((rows/2)) * size,
        y: Math.floor((colls/2)) * size,
    }];
    snake.length = 1;
    snake.direction = {dx: 1, dy: 0};
    updateScore();
}

function draw() {
    directionChamged = false;
    c.clearRect(0, 0, board.width, board.height);
            // drawing food
    c.fillStyle = 'red';
    c.fillRect(food.x, food.y, size, size);

            // drawing snake
    c.fillStyle = 'yellow';
    for (let i = 0; i < snake.body.length; i++) {
        const segment = snake.body[i];
        c.fillRect(segment.x, segment.y, size, size);
    };
            // creating new head
    const newHead = {
        x: snake.body[0].x + (snake.direction.dx * size),
        y: snake.body[0].y + (snake.direction.dy * size)
    };

    if (collision(newHead, snake.body)) {
        clearInterval(intervalId);
        gameOver();
        return;
    }
            // adding new head in beginning of the body
    snake.body.unshift(newHead);

    if (snake.body[0].x == food.x && snake.body[0].y == food.y) {
        snake.length++;
        food.placeFood();
        updateScore()
    } else {
        snake.body.pop();
    }
}

function updateScore() {
    ScoreEl.textContent = `Score: ${snake.length}`;
    if (snake.length > highscore && !gameRunning) {
        highscore = snake.length;
        localStorage.setItem('snakeRecord', highscore);
    }
    recordEl.textContent = `Record: ${highscore}`;
}

function gameOver() {
    overlay.innerHTML = `GAME OVER<br><span class="small">Press Space</span>`;
    overlay.classList.add('show');
    gameRunning = false;
    updateScore();
}

function simulateKey(key) {
    const eventKey = new KeyboardEvent('keydown', { key })
    document.dispatchEvent(eventKey);
}

board.addEventListener('touchstart', e=> {
    const startTouch = e.touches[0];
    touch.startX = startTouch.clientX;
    touch.startY = startTouch.clientY;
});

board.addEventListener('touchend', e => {
    const endTouch = e.changedTouches[0];
    const swipeX = touch.startX = endTouch.clientX; 
    const swipeY = touch.startY = endTouch.clientY;

    if (Math.abs(swipeX) > Math.abs(swipeY)) {
        if (swipeX > 20) simulateKey('ArrowLeft');
        else if (swipeX < -20) simulateKey('ArrowRight');
    } else {
        if (swipeY > 20) simulateKey('ArrowUp');
        else if (swipeY < -20) simulateKey('ArrowDown');
    }
});


document.addEventListener('touchstart', () => {
    if(gameRunning) return;
    const eventStart = new KeyboardEvent('keydown', {key: '', code: 'Space'});
    document.dispatchEvent(eventStart);
});
            // snake hits the wall
function collision(head, tail) {
    if(head.x < 0 || head.y < 0 || head.x + size > board.width || head.y + size > board.height) {
        return true;
    }

            // snake hits itself
    for(let i = 0; i < tail.length; i++) {
        if(head.x == tail[i].x && head.y == tail[i].y) {
            return true;
        }
    }
    return false;

}


document.addEventListener('keydown', (e)=> {
    const dir = snake.direction;
    alert(event.key + event.code)
    if (!gameRunning && e.code == 'Space') {
        startGame();
    }

    if(directionChamged) return;

    if ((e.key == 'ArrowLeft' || e.key == 'a') && dir.dx != 1) {
        dir.dx = -1;
        dir.dy = 0;
        directionChamged = true
    } else if ((e.key == 'ArrowRight' || e.key == 'd') && dir.dx != -1) {
        dir.dx = 1;
        dir.dy = 0;
        directionChamged = true
    } else if ((e.key == 'ArrowDown' || e.key == 's') && dir.dy != -1) {
        dir.dx = 0;
        dir.dy = 1;
        directionChamged = true
    } else if ((e.key == 'ArrowUp' || e.key == 'w') && dir.dy != 1) {
        dir.dx = 0;
        dir.dy = -1;
        directionChamged = true
    }
});

