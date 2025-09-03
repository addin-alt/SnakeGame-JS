const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
const cols = canvas.width / box; 
const rows = canvas.height / box;

let score = 0;

// Initial snake with 6 segments
let snake = [];
for (let i = 0; i < 6; i++) {
    snake.push({ x: (9 - i) * box, y: 10 * box });
}

let food = generateFood();

let direction = "RIGHT";

document.addEventListener('keydown', directionHandler);
document.getElementById('restartBtn').addEventListener('click', restartGame);

function directionHandler(event) {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function collision(head, array) {
    return array.some(segment => segment.x === head.x && segment.y === head.y);
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * cols) * box,
        y: Math.floor(Math.random() * rows) * box
    };
}

function drawSnakeSegment(x, y, type) {
    const radius = box / 2;

    if(type === 'head'){
        // Head gradient
        const gradient = ctx.createRadialGradient(x + radius, y + radius, 2, x + radius, y + radius, radius);
        gradient.addColorStop(0, "#fff700");
        gradient.addColorStop(1, "#ffae00");
        ctx.fillStyle = gradient;
    } else if(type === 'tail'){
        ctx.fillStyle = "#ff3300";
    } else {
        const gradient = ctx.createLinearGradient(x, y, x + box, y + box);
        gradient.addColorStop(0, "#ff8c00");
        gradient.addColorStop(1, "#ff4500");
        ctx.fillStyle = gradient;
    }

    ctx.beginPath();
    ctx.moveTo(x + 4, y);
    ctx.lineTo(x + box - 4, y);
    ctx.quadraticCurveTo(x + box, y + radius, x + box - 4, y + box);
    ctx.lineTo(x + 4, y + box);
    ctx.quadraticCurveTo(x, y + radius, x + 4, y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#222";
    ctx.stroke();
}

function drawFood() {
    const radius = box / 2;
    const gradient = ctx.createRadialGradient(food.x + radius, food.y + radius, 2, food.x + radius, food.y + radius, radius);
    gradient.addColorStop(0, "#ff4d4d");
    gradient.addColorStop(1, "#b30000");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(food.x + radius, food.y + radius, radius, 0, Math.PI * 2);
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        let type = i === 0 ? 'head' : (i === snake.length - 1 ? 'tail' : 'body');
        drawSnakeSegment(snake[i].x, snake[i].y, type);
    }

    drawFood();

    // Move snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // Eat food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('score').innerText = score;
        food = generateFood();
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    // Game over
    if (
        snakeX < 0 || snakeX >= canvas.width ||
        snakeY < 0 || snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        alert("Game Over! Your score: " + score);
    }

    snake.unshift(newHead);
}

function restartGame() {
    snake = [];
    for (let i = 0; i < 6; i++) {
        snake.push({ x: (9 - i) * box, y: 10 * box });
    }
    direction = "RIGHT";
    score = 0;
    document.getElementById('score').innerText = score;
    food = generateFood();
    game = setInterval(draw, 120);
}

let game = setInterval(draw, 120);
