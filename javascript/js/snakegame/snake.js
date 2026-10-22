// 캔버스 객체 생성
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 변수 설정
let score = 0;
const cellSize = 20
let arrow = "ArrowRight";
let directionChanged = false;
const cellX = canvas.width / cellSize;
const cellY = canvas.height / cellSize;
const score_html = document.getElementById("score");
const allowkey = ["ArrowUp","ArrowDown","ArrowRight","ArrowLeft"]
const btnRestart = document.querySelector("#btn-restart");

// 키보드 이벤트 설정
window.addEventListener("keydown", function (event) {
    
    const newArrow = event.key;

    if(!allowkey.includes(newArrow)) {
        return;
    }

    event.preventDefault();

    if (arrow === "ArrowRight") {
        if (newArrow === "ArrowLeft") {
            return;
        }
    }
    if (arrow === "ArrowLeft") {
        if (newArrow === "ArrowRight") {
            return;
        }
    }
    if (arrow === "ArrowUp") {
        if (newArrow === "ArrowDown") {
            return;
        }
    }
    if (arrow === "ArrowDown") {
        if (newArrow === "ArrowUp") {
            return;
        }
    }

    if (directionChanged || arrow === newArrow) {
        return;
    }

    arrow = newArrow;
    directionChanged = true;
});

// 재시작 이벤트 설정
btnRestart.addEventListener("click",(e) => {
    restartGame();
})

// 초기 뱀 위치
let snakes = [
    {x : 5, y :3}, // head
    {x : 4, y :3},
    {x : 3, y :3},
    {x : 2, y :3} // tail
]

const color = {
    head: "#d7ff9c",
    body: "#a3f76b",
    grid: "#24404a",
    food: "#ff8a85"
};

// 맵 그리기
function drawMap() {
    ctx.strokeStyle = color.grid;
    ctx.lineWidth = 0.5;

    for (let x = 0; x < canvas.width; x += cellSize) {
        for (let y = 0; y < canvas.height; y += cellSize) {
            ctx.strokeRect(x, y, cellSize, cellSize);
        }
    }
}

// 뱀 그리기
function drawSnake() {
    for(let i = 0; i < snakes.length ; i++) {
        let x = snakes[i]["x"] * cellSize
        let y = snakes[i]["y"] * cellSize

        if (i === 0) {
            ctx.fillStyle = color.head;
        } else {
            ctx.fillStyle = color.body;
        }

        ctx.fillRect(x,y,cellSize,cellSize)
    }
}

// 뱀 움직임 구현
function moveSnake(moveX,moveY) {
    let newHead = {
        x : snakes[0]["x"] + moveX,
        y : snakes[0]["y"] + moveY
    }

    const isflag = checkWallCollision(newHead);

    if(isflag) {
        const result = {
            "status" : "finish",
            "message" : "Game over(wall)"
        }
        return result;
    }

    const isEating = foods["x"] === newHead["x"] && foods["y"] === newHead["y"];

    snakes.unshift(newHead);

    if (!isEating) {
        snakes.pop();
    }

    const bodyflag = checkSelfCollision(newHead);

    if(bodyflag) {
        const result = {
            "status" : "finish",
            "message" : "Game over(body)"
        }

        return result
    }

    if(isEating) {
        score += 10;
        score_html.textContent = score;

        if (snakes.length === cellX * cellY) {
            // 게임 클리어 처리
            return {
                status: "clear",
                message: "Game Clear!"
            };
        }
        
        createFood();

    }

    const result = {
        "status" : "playing"
    }

    return result;
}

let foods = {}

// 먹이 생성
function createFood() {

    let xCoordinate = Math.floor(Math.random() * cellX);
    let yCoordinate = Math.floor(Math.random() * cellY);

    while(true) {
        let isOverlap = false;

        for (let i = 0; i < snakes.length; i++) {
            if (snakes[i]["x"] === xCoordinate && snakes[i]["y"] === yCoordinate) {
                isOverlap = true;
                break;
            }
        }

        if(!isOverlap) {
            foods.x = xCoordinate;
            foods.y = yCoordinate;
            break;
        } else {
            xCoordinate = Math.floor(Math.random() * cellX);
            yCoordinate = Math.floor(Math.random() * cellY);
        }
    }
}

// 벽 충돌 감지
function checkWallCollision(newHead) {
    if(newHead.x < 0 || newHead.x >= cellX || newHead.y < 0 || newHead.y >= cellY) {
        return true;
    }

    return false;
}

// 몸충돌 감지
function checkSelfCollision(newHead) {
    // 0은 머리이기 때문에 제외
    for(let i = 1 ; i < snakes.length ; i++) {
        if (snakes[i]["x"] === newHead["x"] && snakes[i]["y"] === newHead["y"]) {
            return true;
        }
    }

    return false;
}

// 재시작
function restartGame() {
    // 1. 기존 타이머 종료
    // 루프에서 종료했는데 또 넣은 이유는 중복 방지를 위함
    clearInterval(interverID);

    // 2. 점수 초기화
    score = 0;
    score_html.textContent = score;

    // 3. 뱀 위치 초기화
    snakes = [
        {x: 5, y: 3},
        {x: 4, y: 3},
        {x: 3, y: 3},
        {x: 2, y: 3}
    ];

    // 4. 이동 방향 초기화
    arrow = "ArrowRight";
    directionChanged = false;

    // 5. 새로운 먹이 생성
    createFood();

    // 6. Canvas 초기화 및 다시 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawSnake();
    drawFood();

    // 7. 새로운 타이머 시작
    interverID = setInterval(gameLoop, 150);

    // 8. 재시작 버튼 숨기기
    btnRestart.hidden = true;
}

// 음식 그리기
function drawFood() {
    let x = foods["x"] * cellSize;
    let y = foods["y"] * cellSize;

    ctx.fillStyle = color.food;
    ctx.fillRect(x,y,cellSize,cellSize)
}

// 게임 루프 설정
function gameLoop() {
    let moveX = 0;
    let moveY = 0;

    if (arrow === "ArrowRight") {
        moveX = 1
    }
    if (arrow === "ArrowLeft") {
        moveX = -1
    }
    if (arrow === "ArrowUp") {
        moveY = -1
    }
    if (arrow === "ArrowDown") {
        moveY = 1
    }
    
    const result = moveSnake(moveX,moveY);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    

    if (result.status === "playing") {
        drawSnake();
        drawFood();
    }

    if (result.status !== "playing") {
        clearInterval(interverID);
        btnRestart.hidden = false;
        alert(result.message);
        return;
    }

    directionChanged = false;

}

// 초기 화면 표시
drawMap();
drawSnake();
createFood();
drawFood();

// 0.2초 단위로 루프 함수 실행
let interverID = setInterval(gameLoop, 150);