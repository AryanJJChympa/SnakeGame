let inputDir = { x: 0, y: 0 };
let lastInputDir = { x: 0, y: 0 }; // Prevent reverse
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Game Functions
function main(currTime) {
    window.requestAnimationFrame(main);
    if ((currTime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = currTime;
    gameEngine();
}

function isCollide(snake) {
    // Collide with self
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    // Collide with wall
    return (
        snake[0].x >= 18 || snake[0].x <= 0 ||
        snake[0].y >= 18 || snake[0].y <= 0
    );
}

function gameEngine() {
    // Game over
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over! Press any key to play again.");
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        score = 0;
        scoreBox.innerHTML = "Score: 0";
    }

    // Eating food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score++;
        if (score > highScoreVal) {
            highScoreVal = score;
            localStorage.setItem("highScore", highScoreVal);
            highScoreBox.innerHTML = "High Score: " + highScoreVal;
        }
        scoreBox.innerHTML = "Score: " + score;

        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });

        let a = 2, b = 16;
        food = {
            x: Math.floor(a + (b - a) * Math.random()),
            y: Math.floor(a + (b - a) * Math.random())
        };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
    lastInputDir = inputDir; // Update last input direction

    // Render snake and food
    board.innerHTML = "";

    snakeArr.forEach((e, i) => {
        let element = document.createElement('div');
        element.style.gridRowStart = e.y;
        element.style.gridColumnStart = e.x;
        element.classList.add(i === 0 ? 'head' : 'snake');
        board.appendChild(element);
    });

    let foodEl = document.createElement('div');
    foodEl.style.gridRowStart = food.y;
    foodEl.style.gridColumnStart = food.x;
    foodEl.classList.add('food');
    board.appendChild(foodEl);
}

// High Score Setup
let highScore = localStorage.getItem("highScore");
let highScoreVal = highScore ? parseInt(highScore) : 0;
highScoreBox.innerHTML = "High Score: " + highScoreVal;

// Start Game
window.requestAnimationFrame(main);

// Controls
window.addEventListener('keydown', e => {
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
            if (lastInputDir.y !== 1) inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
        case "s":
        case "S":
            if (lastInputDir.y !== -1) inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            if (lastInputDir.x !== 1) inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
        case "d":
        case "D":
            if (lastInputDir.x !== -1) inputDir = { x: 1, y: 0 };
            break;
    }
});