const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const scoreHtml = document.querySelector("#score");
const btnReset = document.querySelector("#btn-restart");

// Playerの初期状態設定
let player = {
    x : 420,
    y : 280,
    size : 10,
    speed : 2,
    point : 0,
    eatting : 0,
    survive : true,
    level : 1
}

const fishType = [
    {
        name : "typeA",
        size : 6,
        speed : 0.6,
        range : 90,
        score : 1
    },
    {
        name : "typeB",
        size : 8,
        speed : 1,
        range : 110,
        score : 2
    },
    {
        name : "typeC",
        size : 14,
        speed : 1.2,
        range : 100,
        score : 3
    },
    {
        name : "typeD",
        size : 22,
        speed : 1.5,
        range : 130,
        score : 4
    },
    {
        name : "typeE",
        size : 34,
        speed : 1.8,
        range : 150,
        score : 5
    }
]

// 色
const color = {
    player : "red",
    typeA : "#FFDAC1",
    typeB : "#FFB7B2",
    typeC : "#E2F0CB",
    typeD : "#B5EAD7",
    typeE : "#C7CEEA"
}

// 空
const sky = {
    x : 0,
    y : 0,
    width : canvas.width,
    height : 100
}

const keys = {}
let fishs = []

window.addEventListener("keydown",(e) => {
    e.preventDefault();
    keys[e.key] = true;
}) // キーボードを押し

window.addEventListener("keyup",(e) => {
    e.preventDefault();
    keys[e.key] = false;
}) // キーボードから離れ

btnReset.addEventListener("click", () => {
    window.location.reload();
});

setInterval(() => {
    if (!player.survive) return;

    player.y += 1; // １秒ごとに沈下
},100);

setInterval(() => {
    if (!player.survive) return;

    let items;
    if(player.level === 1) {
        items = [
            {
                value : 1,
                probability : 0.55
            },
            {
                value : 2,
                probability : 0.35
            },
            {
                value : 3,
                probability : 0.10
            },
            {
                value : 4,
                probability : 0
            },
            {
                value : 5,
                probability : 0
            }
        ]
    }
    if(player.level === 2) {
        items = [
            {
                value : 1,
                probability : 0.40
            },
            {
                value : 2,
                probability : 0.30
            },
            {
                value : 3,
                probability : 0.20
            },
            {
                value : 4,
                probability : 0.10
            },
            {
                value : 5,
                probability : 0
            }
        ]
    }
    if(player.level === 3) {
        items = [
            {
                value : 1,
                probability : 0.30
            },
            {
                value : 2,
                probability : 0.25
            },
            {
                value : 3,
                probability : 0.25
            },
            {
                value : 4,
                probability : 0.15
            },
            {
                value : 5,
                probability : 0.05
            }
        ]
    }
    if(player.level === 4) {
        items = [
            {
                value : 1,
                probability : 0.25
            },
            {
                value : 2,
                probability : 0.25
            },
            {
                value : 3,
                probability : 0.25
            },
            {
                value : 4,
                probability : 0.15
            },
            {
                value : 5,
                probability : 0.10
            }
        ]
    }
    if(player.level === 5) {
        items = [
            {
                value : 1,
                probability : 0.20
            },
            {
                value : 2,
                probability : 0.25
            },
            {
                value : 3,
                probability : 0.25
            },
            {
                value : 4,
                probability : 0.20
            },
            {
                value : 5,
                probability : 0.10
            }
        ]
    }

    let type = getRandomNumber(items) - 1;

    if(fishs.length < 30) { // 30まで生成する
        fishs.push(
            {
                x: Math.floor(Math.random() * (canvas.width - fishType[type].size + 1)),
                y: Math.floor(Math.random() * (canvas.height - sky.height - fishType[type].size + 1)) + sky.height,
                size : fishType[type].size,
                color : color[fishType[type].name],
                speed : fishType[type].speed,
                range : fishType[type].range,
                score : fishType[type].score,
                directionX: 0,
                directionY: 0,
                directionTimer: 0,
                survive : true
            }
        )
    }
},1000);

function getRandomNumber(items) {
    let random = Math.random();
    let sum = 0;

    for(let item of items) {
        sum += item.probability;
        if(random < sum) {
            return item.value;
        }
    }
}

function playerLevel() {
    const point = player.point;

    if (point >= 130) {
        player.size = 36;
        player.level = 5;
    } else if (point >= 120) {
        player.size = 34;
        player.level = 5;
    } else if (point >= 80) {
        player.size = 26;
        player.level = 4;
    } else if (point >= 70) {
        player.size = 24;
        player.level = 4;
    } else if (point >= 60) {
        player.size = 22;
        player.level = 3;
    } else if (point >= 50) {
        player.size = 20;
        player.level = 3;
    } else if (point >= 40) {
        player.size = 18;
        player.level = 3;
    } else if (point >= 30) {
        player.size = 14;
        player.level = 2;
    } else if (point >= 20) {
        player.size = 12;
        player.level = 2;
    } else {
        player.size = 10;
        player.level = 1;
    }
}

// playerの動きについての関数
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

function wanderFish(fish) {

    // 방향 변경 타이머
    fish.directionTimer--;

    // 일정 시간이 지나면 새로운 방향 설정
    if (fish.directionTimer <= 0) {

        const angle = Math.random() * Math.PI * 2;

        fish.directionX = Math.cos(angle);
        fish.directionY = Math.sin(angle);

        // 60~180프레임마다 방향 변경
        fish.directionTimer = Math.floor(
            Math.random() * 121
        ) + 60;
    }

    // 자연 이동 속도는 기본 속도의 50%
    fish.x += fish.directionX * fish.speed * 0.5;
    fish.y += fish.directionY * fish.speed * 0.5;
}

function moveFish() {
    for(let fish of fishs) {
        const dx = fish.x - player.x;
        const dy = fish.y - player.y;
        const distance = Math.hypot(dx, dy);

        if (distance < fish.range && distance > 0) {
            if(fish.size < player.size) {
                // 魚の範囲に入りかつユーザより小さい
                // ユーザーから逃げる
                fish.x += (dx / distance) * fish.speed;
                fish.y += (dy / distance) * fish.speed;
            } else if(fish.size > player.size){
                // 魚の範囲に入りかつユーザより大きい
                // ユーザーを追いかける
                fish.x -= (dx / distance) * fish.speed;
                fish.y -= (dy / distance) * fish.speed;
            } else {
                // ユーザーと同じだったら自由に移動する。
                wanderFish(fish);
            }
        } else { // 探知範囲外では自由に移動する
            wanderFish(fish);
        }
    }
}

// 壁衝突判定
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
    for (let fish of fishs) {
        if (fish.x <= 0) {
            fish.x = 0;
            fish.directionX = Math.abs(fish.directionX);
        }

        if (fish.x >= canvas.width - fish.size) {
            fish.x = canvas.width - fish.size;
            fish.directionX = -Math.abs(fish.directionX);
        }

        if (fish.y >= canvas.height - fish.size) {
            fish.y = canvas.height - fish.size;
            fish.directionY = -Math.abs(fish.directionY);
        }

        if (fish.y <= sky.height) {
            fish.y = sky.height;
            fish.directionY = Math.abs(fish.directionY);
        }
    }
}

// playerと魚が衝突した際の判定
function collisionFish() {
    for (let fish of fishs) {
        if (!fish.survive) continue;

        if (
            player.x < fish.x + fish.size &&
            player.x + player.size > fish.x &&
            player.y < fish.y + fish.size &&
            player.y + player.size > fish.y 
        ) {
            if(fish.size < player.size) {
                fish.survive = false;
                player.eatting += 1;
                player.point += fish.score;
                scoreHtml.textContent = player.point;
                playerLevel();
            } else if (fish.size > player.size) {
                player.survive = false;
                alert("Game Over");
                break;
            }
        } 
    }

    fishs = fishs.filter(fish => fish.survive);
}

//　描く関数
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 空
    ctx.fillStyle = "blue";
    ctx.fillRect(sky.x,sky.y,sky.width,sky.height);

    // Player
    ctx.fillStyle = color.player;
    ctx.fillRect(player.x,player.y,player.size,player.size);

    //fish
    for(let fish of fishs) {
        if(fish.survive) {
            ctx.fillStyle = fish.color,
            ctx.fillRect(fish.x, fish.y,fish.size,fish.size);
        }
    }
}

function gameLoop() {
    if (!player.survive) {
        btnReset.hidden = false;
        return;
    }

    moveplayer();
    moveFish();
    collisionWall();
    collisionFish();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();