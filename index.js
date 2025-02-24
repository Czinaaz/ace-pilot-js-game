const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 600;

let gameState = "menu";
let player, enemies, bonuses, score, keys;
let backgroundX1 = 0, backgroundX2 = canvas.width;
let backgroundSpeed = 2;
let backgroundImage = new Image();
backgroundImage.src = './images/Background-desert.jpg';
let playerImage = new Image();
playerImage.src = './images/jet.png';
let enemyImage = new Image();
enemyImage.src = './images/enemy.png';
let bonusImage = new Image();
bonusImage.src = './images/fuel-bonus.png';

backgroundImage.onload = function() {
    showMenu();
};

function showMenu() {
    document.getElementById("startMenu").style.display = "block";
    document.getElementById("gameOverMenu").style.display = "none";
}

function startGame() {
    document.getElementById("startMenu").style.display = "none";
    document.getElementById("gameOverMenu").style.display = "none";
    gameState = "playing";
    player = { x: 100, y: 400, width: 120, height: 90, speed: 4 };
    enemies = [];
    bonuses = [];
    score = 0;
    keys = {};
    backgroundX1 = 0;
    backgroundX2 = canvas.width;
    gameLoop();
    setInterval(createEnemy, 1000);
    setInterval(createBonus, 2000);
}

function gameOver() {
    gameState = "gameOver";
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverMenu").style.display = "block";
}

function drawBackground() {
    backgroundX1 -= backgroundSpeed;
    backgroundX2 -= backgroundSpeed;
    if (backgroundX1 <= -canvas.width) backgroundX1 = backgroundX2 + canvas.width;
    if (backgroundX2 <= -canvas.width) backgroundX2 = backgroundX1 + canvas.width;
    ctx.drawImage(backgroundImage, Math.floor(backgroundX1), 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, Math.floor(backgroundX2), 0, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawBonuses() {
    bonuses.forEach(bonus => {
        ctx.drawImage(bonusImage, bonus.x, bonus.y, bonus.width, bonus.height);
    });
}

function createEnemy() {
    if (gameState !== "playing") return;
    enemies.push({ x: canvas.width, y: Math.random() * (canvas.height - 20), width: 50, height: 15, speed: Math.random() * 4 + 2 });
}

function createBonus() {
    if (gameState !== "playing") return;
    bonuses.push({ x: Math.random() * (canvas.width - 50), y: 0, width: 25, height: 25, speed: Math.random() * 3 + 1 });
}

function update() {
    if (gameState !== "playing") return;
    if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
    if (keys["ArrowDown"] && player.y + player.height < canvas.height) player.y += player.speed;
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;
    
    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed;
        if (enemy.x + enemy.width < 0) enemies.splice(index, 1);
        if (checkCollision(player, enemy)) gameOver();
    });
    
    bonuses.forEach((bonus, index) => {
        bonus.y += bonus.speed;
        if (bonus.y > canvas.height) bonuses.splice(index, 1);
        if (checkCollision(player, bonus)) {
            score++;
            bonuses.splice(index, 1);
        }
    });
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer();
    drawEnemies();
    drawBonuses();
    ctx.font = "15px 'Press Start 2P', cursive"; 
    ctx.textAlign = "right"; 
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, canvas.width - 100, 30);
}

function gameLoop() {
    if (gameState !== "playing") return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);