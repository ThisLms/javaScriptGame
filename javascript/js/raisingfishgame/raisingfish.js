const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d")

keys = {}

window.addEventListener("keydown", (e) => {
    e.preventDefault();
    keys[e.key] = true
});
window.addEventListener("keyup", (e) => {
    e.preventDefault();
    keys[e.key] = false
});

// 플레이어 초기 설정
let player = {
    x : 420,
    y : 280,
    color : "red",
    size : 10,
    speed : 2,
    cnt : 0 // 물고기를 먹을수록 증가 10마다 크기 증가
}

// 하늘 위치 설정
const sky = {
    x : 0,
    y : 0,
    width : canvas.width,
    height : 100
}

// 물고기가 담기는 배열
let fishs = []

// 타입 A 물고기
let fishTypeA = {
    color : "yellow",
    size : 6,
    speed : 0.5,
    range : 100
}

// 타입 B 물고기
let fishTypeB = {
    color : "black",
    size : 17,
    speed : 1.5,
    range : 30
}

// 중력 작용
setInterval(() => {
    player.y += 1;
}, 100);

// 랜덤으로 물고기 생성
setInterval(() => {
    fishs.push(
        {
            x : Math.floor(Math.random() * (canvas.width - 0 + 1) + 1),
            y : Math.floor(Math.random() * (canvas.height - sky.height + 1) + sky.height),
            size : fishTypeA.size,
            color : fishTypeA.color,
            speed : fishTypeA.speed,
            range : fishTypeA.range,
            flag : true
        }
    )
},100);

// 벽 충돌 판정 플레이어
function collisionWall() {
    if(player.x <= 0) {
        player.x = 0;
    }
    if(player.x >= canvas.width - player.size) {
        player.x = canvas.width - player.size;
    }
    if(player.y >= canvas.height - player.size) {
        player.y = canvas.height - player.size;
    }
    if(player.y <= sky.height) {
        player.y = sky.height;
    }
    for(let fish of fishs) {
        if(fish.y <= sky.height) {
            fish.y = sky.height;
        }
    }
}

// 물고기 충돌 판정
function collisionFish() {
    for (let fish of fishs) {
        if (!fish.flag) continue;

        if (
            player.x < fish.x + fish.size &&
            player.x + player.size > fish.x &&
            player.y < fish.y + fish.size &&
            player.y + player.size > fish.y
        ) {
            fish.flag = false;
            player.cnt += 1;

            if (player.cnt % 10 === 0) {
                player.size += 2;
            }
        }
    }
}

// 그림 그리기
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 하늘
    ctx.fillStyle = "blue";
    ctx.fillRect(sky.x,sky.y,sky.width,sky.height);

    // 플레이어
    ctx.fillStyle = player.color;

    console.log(player.size)
    // console.log(player.cnt)

    ctx.fillRect(player.x,player.y,player.size,player.size);

    // 물고기
    for (let fish of fishs) {
        if(fish.flag){
            ctx.fillStyle = fish.color,
            ctx.fillRect(fish.x, fish.y,fish.size,fish.size);
        }
    }
}

// 플레이어 움직임
function moveplayer() {
    if (keys['ArrowUp']) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown']) {
        player.y += player.speed;
    }
    if (keys['ArrowLeft']) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight']) {
        player.x += player.speed;
    }
}

// 물고기 움직임
// 플레이어가 다가갔을 때 도망침
function moveFish() {
    for (let fish of fishs) {
        const dx = fish.x - player.x;
        const dy = fish.y - player.y;
        const distance = Math.hypot(dx, dy);

        if (distance < fish.range && distance > 0) {
            if(fish.size < player.size) {
                 // 물고기의 범위에 들어오고 플레이어보다 크기가 작으면
                 // 플레이어로부터 도망침
                fish.x += (dx / distance) * fish.speed;
                fish.y += (dy / distance) * fish.speed;
            } else {
                // 물고기 범위에 들어오고 플레이어보다 크기가 크면
                // 플레이어에게 돌진함
                fish.x -= (dx / distance) * fish.speed;
                fish.y -= (dy / distance) * fish.speed;
            }
        }
    }
}

function gameLoop() {
    draw();
    moveFish();
    moveplayer();
    collisionFish();
    collisionWall();
    requestAnimationFrame(gameLoop); // 1초당 60번실행
}

gameLoop();