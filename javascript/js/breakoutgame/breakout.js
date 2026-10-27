const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreHtml = document.querySelector("#score");
const stageHtml = document.querySelector("#stage");
const livesHtml = document.querySelector("#lives");
const btnRestart = document.querySelector("#btn-restart");

const color = {
    white : "#FFFFFF",
    green : "#008000",
    red : "#FF0000",
    blue : "#0000FF"
}

const blockColer = [
    "green", // 1
    "Yellow", // 2
    "black" // 3
]

const gameInfo = {
    score : 0,
    life : 3,
    stage : 1
}

const paddle = {
    x : 340,
    y : 550,
    width : 120,
    height : 14,
    speed : 7
};

const ball = {
    x : 400,
    y : 542,
    radius : 7,
    line : 3,
    speed : 5,
    dx: 0,
    dy: 0
};

const blockType = [
    {
        name : "typeA",
        life : 1,
        color_code : 0,
        score : 100
    },
    {
        name : "typeB",
        life : 2,
        color_code : 1,
        score : 150
    },
    {
        name : "typeC",
        life : 3,
        color_code : 2,
        score : 200
    }
]

const blocks = [];

const angle = 15 * Math.PI / 180; // 초기 발사각

ball.dx = Math.sin(angle);
ball.dy = -Math.cos(angle);

const keys = {};
const allowkey = [
    "ArrowRight",
    "ArrowLeft",
    " ",
    "Space"
    ]

let stand_by = true;
let makeblock = false;

// 패들의 이동 이벤트
window.addEventListener("keydown", (e) => {
    e.preventDefault();

    if(!allowkey.includes(e.key)) {
        return;
    }

    keys[e.key] = true
});
window.addEventListener("keyup", (e) => {
    e.preventDefault();

    if(!allowkey.includes(e.key)) {
        return;
    }

    keys[e.key] = false
});

btnRestart.addEventListener("click", restartGame);

function standBy() {
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius;

    draw();

    // 공 발사
    if(keys[" "] || keys["Space"]) {
        stand_by = false;
    }
}

// 블록 생성
function makeBlock() {
    let num;
    // 50 개의 블록 생성
    for (let i = 0; i < 50; i++) {
        const col = i % 10;
        const row = Math.floor(i / 10);

        if(row === 3 && gameInfo.stage >= 2) {
            num = 1
        } else if(row === 1 && gameInfo.stage >= 3){
            num = 1
        } else {
            num = 0
        }

        blocks.push({
            x: 24 + col * 76,
            y: 70 + row * 28,
            width: 68,
            height: 20,
            life : blockType[num].life,
            color_code : blockType[num].color_code,
            score : blockType[num].score,
            flag: true
        });
    }
}

function drawBlock() {
    for (const block of blocks) {
        ctx.fillStyle = blockColer[block.color_code];

        if (block.flag) {
            ctx.fillRect(
                block.x,
                block.y,
                block.width,
                block.height
            );
        }
    }
}

function draw() {
    // 화면 초기화
    ctx.clearRect(0,0,canvas.width,canvas.height);

    stageHtml.textContent = gameInfo.stage;
    livesHtml.textContent = gameInfo.life;

    // 패들 그리기
    ctx.fillStyle = color.red;
    ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);

    // 공 그리기
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI * 2);
    ctx.strokeStyle = color.blue;
    ctx.lineWidth = ball.line;
    ctx.stroke();

    // 블럭 그리기
    drawBlock();
}

function movePaddle() {
    if (keys['ArrowLeft']) {
        paddle.x -= paddle.speed;
    }
    if (keys['ArrowRight']) {
        paddle.x += paddle.speed;
    }
}

function moveBall() {
    ball.x += ball.dx * ball.speed;
    ball.y += ball.dy * ball.speed;
}

function collisionPaddleWall() {
    if(paddle.x <= 8) {
        paddle.x = 8
    } else if(paddle.x + paddle.width >= canvas.width - 8) {
        paddle.x = (canvas.width - paddle.width) - 8;
    }
}

function collisionBall() {
    // 위쪽 벽
    if (ball.y - ball.radius <= 8 && ball.dy < 0) {

        ball.y = 8 + ball.radius;
        ball.dy *= -1;
    }

    // 왼쪽 벽
    if (ball.x - ball.radius <= 8 && ball.dx < 0) {
        ball.x = 8 + ball.radius;
        ball.dx *= -1;
    }

    // 오른쪽 벽
    if (ball.x + ball.radius >= canvas.width - 8 && ball.dx > 0) {
        ball.x = canvas.width - 8 - ball.radius;
        ball.dx *= -1;
    }
    
    // 바닥에 충돌
    if(ball.y >= canvas.height) {
        gameInfo.life -= 1;

        ball.dx = Math.sin(angle);
        ball.dy = -Math.cos(angle);

        stand_by = true;
        keys[" "] = false;
        keys["Space"] = false;
    }
}

function collisionBallPaddle() {
    if (
        ball.x + ball.radius >= paddle.x &&
        ball.x - ball.radius <= paddle.x + paddle.width &&
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.dy > 0
    ) {
        ball.y = paddle.y - ball.radius;
        ball.dy *= -1;
    }
}

function collisionBlock() {
    
    for(let block of blocks) {
        if (!block.flag) continue; // 이 코드가 없으면 없어진 블록이랑 충돌

        if(
            ball.x + ball.radius >= block.x &&
            ball.x - ball.radius <= block.x + block.width &&
            ball.y + ball.radius >= block.y &&
            ball.y - ball.radius <= block.y + block.height            
        ) {
            ball.dy *= -1;
            block.life -= 1;
            
            if(block.life === 0) {
                gameInfo.score += block.score;
                scoreHtml.textContent = gameInfo.score;
                block.flag = false;
            } else {
                block.color_code = block.life - 1;
            }

            break; // 한 프레임에 하나의 블록만 처리
        }
    }
}

function restartGame() {
    gameInfo.score = 0;
    gameInfo.life = 3;
    gameInfo.stage = 1;

    paddle.x = 340;

    ball.x = 400;
    ball.y = paddle.y - ball.radius;
    ball.dx = Math.sin(angle);
    ball.dy = -Math.cos(angle);

    blocks.length = 0;
    makeblock = false;
    stand_by = true;

    keys[" "] = false;
    keys["Space"] = false;

    scoreHtml.textContent = gameInfo.score;
    livesHtml.textContent = gameInfo.life;
    stageHtml.textContent = gameInfo.stage;

    btnRestart.hidden = true;

    requestAnimationFrame(gameLoop);
}

function stageClear() {
    if (blocks.length === 0) {
        return false;
    }

    for (const block of blocks) {
        if (block.flag) {
            return false;
        }
    }

    return true;
}

function gameLoop() {
    if (gameInfo.life === 0) {
        btnRestart.hidden = false;
        alert("Gameover");
        return;
    }

    if (!makeblock) {
        makeBlock();
        makeblock = true;
    }

    if(stageClear()) {
        gameInfo.stage += 1;

        blocks.length = 0;
        ball.speed += 2;
        makeblock = false;

        ball.dx = Math.sin(angle);
        ball.dy = -Math.cos(angle);

        stand_by = true;

        keys[" "] = false;
        keys["Space"] = false;
    }

    movePaddle();
    collisionPaddleWall();

    if (stand_by) {
        standBy();
    } else {
        moveBall();

        collisionBall();
        collisionBallPaddle();
        collisionBlock();
    }

    draw();

    requestAnimationFrame(gameLoop);
}

draw();

gameLoop();