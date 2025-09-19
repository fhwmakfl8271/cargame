const car = document.getElementById("car");
const gameArea = document.getElementById("game-area");
const levelEl = document.getElementById("level");
const scoreEl = document.getElementById("score");
const starsEl = document.getElementById("stars");
const upgradeBtn = document.getElementById("upgrade-btn");
const messageEl = document.getElementById("message");

let level = 1;
let score = 0;
let stars = 0;
let carSpeed = 20;
let obstacles = [];
let obstacleSpeed = 3;
let keys = {};

const stages = [
    { level: 1, speed: 3, obstacles: 3, reward: 1 },
    { level: 2, speed: 4, obstacles: 5, reward: 2 },
    { level: 3, speed: 5, obstacles: 7, reward: 3 },
];

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

upgradeBtn.addEventListener("click", () => {
    if(stars >= 3){
        carSpeed += 5;
        stars -= 3;
        starsEl.textContent = stars;
        messageEl.textContent = "Машина улучшена!";
        setTimeout(()=>messageEl.textContent="", 1500);
    } else {
        messageEl.textContent = "Недостаточно ★!";
        setTimeout(()=>messageEl.textContent="", 1500);
    }
});

function createObstacle(){
    const obs = document.createElement("div");
    obs.classList.add("obstacle");
    obs.style.left = Math.floor(Math.random() * 360) + "px";
    gameArea.appendChild(obs);
    obstacles.push(obs);
}

function moveObstacles(){
    obstacles.forEach((obs, index)=>{
        obs.style.top = (parseInt(obs.style.top || 0) + obstacleSpeed) + "px";
        if(parseInt(obs.style.top) > 500){
            gameArea.removeChild(obs);
            obstacles.splice(index,1);
            score += 1;
            scoreEl.textContent = score;
            if(score % 10 === 0){
                stars += 1;
                starsEl.textContent = stars;
            }
        }
        // 충돌 체크
        const carRect = car.getBoundingClientRect();
        const obsRect = obs.getBoundingClientRect();
        if(!(carRect.right < obsRect.left || carRect.left > obsRect.right || carRect.bottom < obsRect.top || carRect.top > obsRect.bottom)){
            messageEl.textContent = "Игра окончена!";
            resetGame();
        }
    });
}

function resetGame(){
    score = 0;
    scoreEl.textContent = score;
    obstacles.forEach(obs => gameArea.removeChild(obs));
    obstacles = [];
    car.style.left = "175px";
}

function moveCar(){
    const left = parseInt(car.style.left);
    if(keys["ArrowLeft"] && left > 0) car.style.left = (left - carSpeed) + "px";
    if(keys["ArrowRight"] && left < 350) car.style.left = (left + carSpeed) + "px";
}

function nextStage(){
    if(level < stages.length){
        level += 1;
        levelEl.textContent = level;
        obstacleSpeed = stages[level-1].speed;
        for(let i=0;i<stages[level-1].obstacles;i++){
            createObstacle();
        }
        messageEl.textContent = `Стадия ${level} началась!`;
        setTimeout(()=>messageEl.textContent="",2000);
    } else {
        messageEl.textContent = "Вы прошли все стадии!";
    }
}

function gameLoop(){
    moveCar();
    moveObstacles();
    if(obstacles.length === 0){
        nextStage();
    }
    requestAnimationFrame(gameLoop);
}

// 초기 세팅
for(let i=0;i<stages[0].obstacles;i++){
    createObstacle();
}

gameLoop();
