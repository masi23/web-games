const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const pixelSize = 40;
const speed = 2;

const bricks = [];

const colors = ["red", "yellow", "green", "#1c33ff"];

let gameOver = false;

class Brick {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.falling = true;
  }
}

let leftPressed = false;
let rightPressed = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") leftPressed = true;
  if (e.key === "ArrowRight") rightPressed = true;
});

function borderCollisionLeft(brick) {
  return brick.x <= 0;
}
function borderCollisionRight(brick) {
  return brick.x + brick.width >= canvas.width;
}

function willCollide(brick, dx, dy) {
  return bricks.some((b) => {
    if (b === brick) return false;

    return (
      brick.x + dx < b.x + b.width &&
      brick.x + dx + brick.width > b.x &&
      brick.y + dy < b.y + b.height &&
      brick.y + dy + brick.height > b.y
    );
  });
}

function hitBottom(brick) {
  return (
    brick.y + brick.height >= canvas.height || willCollide(brick, 0, pixelSize)
  );
}

function generateBrick() {
  const width = Math.floor(Math.random() * 4 + 1) * pixelSize;
  const height = Math.floor(Math.random() * 4 + 1) * pixelSize;
  const maxColumns = Math.floor((canvas.width - width) / pixelSize);
  const column = Math.floor(Math.random() * (maxColumns + 1));
  const x = column * pixelSize;
  const y = 0;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const newBrick = new Brick(x, y, width, height, color);
  bricks.push(newBrick);
}

function update() {
  const fallingBrick = bricks[bricks.length - 1];

  if (hitBottom(fallingBrick) && fallingBrick.y <= 0) {
    gameOver = true;
    return;
  }

  if (fallingBrick.falling) {
    if (!hitBottom(fallingBrick)) {
      fallingBrick.y += pixelSize;
    } else {
      console.log("hit bottom or another brick");

      fallingBrick.falling = false;
      generateBrick();
      return;
    }

    if (
      leftPressed &&
      !borderCollisionLeft(fallingBrick) &&
      !willCollide(fallingBrick, -pixelSize, 0)
    ) {
      fallingBrick.x -= pixelSize;
    }

    if (
      rightPressed &&
      !borderCollisionRight(fallingBrick) &&
      !willCollide(fallingBrick, pixelSize, 0)
    ) {
      fallingBrick.x += pixelSize;
    }

    leftPressed = false;
    rightPressed = false;
  }
}

function draw() {
  clear();
  bricks.forEach((brick) => {
    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
  });
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

generateBrick();
function loop() {
  if (!gameOver) {
    update();
    draw();
  } else {
    ctx.font = "bold 48px sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  }
}

setInterval(loop, 1000 / speed);
