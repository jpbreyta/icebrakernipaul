// Get HTML elements
let board = document.getElementById("game-board");
let scoreDisplay = document.getElementById("score");
let startButton = document.getElementById("start-button");
let levelSelect = document.getElementById("level-select");

// Initial snake and game variables
let snake = [
  { x: 80, y: 80 },
  { x: 60, y: 80 },
  { x: 40, y: 80 }
];
let food = {};
let direction = "RIGHT";
let gameInterval;
let score = 0;
let gameSpeed = parseInt(levelSelect.value);
const boardSize = 400;
const segmentSize = 20;

// Draw the snake on the board
function drawSnake() {
  board.innerHTML = "";
  snake.forEach(segment => {
    let snakeSegment = document.createElement("div");
    snakeSegment.style.left = segment.x + "px";
    snakeSegment.style.top = segment.y + "px";
    snakeSegment.classList.add("snake");
    board.appendChild(snakeSegment);
  });
}

// Draw the food on the board
function drawFood() {
  let foodElement = document.createElement("div");
  foodElement.style.left = food.x + "px";
  foodElement.style.top = food.y + "px";
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// Generate a new food location on the grid
function generateFood() {
  let randomX = Math.floor(Math.random() * (boardSize / segmentSize)) * segmentSize;
  let randomY = Math.floor(Math.random() * (boardSize / segmentSize)) * segmentSize;
  food = { x: randomX, y: randomY };
}

// Update the game state on each interval
function updateGame() {
  let head = { ...snake[0] };

  // Change the head position based on the current direction
  if (direction === "RIGHT") head.x += segmentSize;
  if (direction === "LEFT") head.x -= segmentSize;
  if (direction === "UP") head.y -= segmentSize;
  if (direction === "DOWN") head.y += segmentSize;

  // Insert new head position
  snake.unshift(head);

  // Check for food collision
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }

  // Check for collisions with walls or self
  if (
    head.x < 0 || head.x >= boardSize ||
    head.y < 0 || head.y >= boardSize ||
    checkSelfCollision()
  ) {
    clearInterval(gameInterval);
    // Use SweetAlert2 for a modern game-over dialog.
    Swal.fire({
      title: 'Game Over!',
      text: `Final Score: ${score}`,
      icon: 'error',
      confirmButtonText: 'Try Again'
    }).then((result) => {
      if (result.isConfirmed) {
        startGame();
      }
    });
    return;
  }

  drawSnake();
  drawFood();
}

// Check for collisions with the snake's own body
function checkSelfCollision() {
  let head = snake[0];
  // Start from index 1 so that the head is not compared to itself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}

// Change direction with the arrow keys (prevent reversing directly)
function changeDirection(event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

// Start the game with the speed set by the level selector
function startGame() {
  score = 0;
  scoreDisplay.textContent = score;
  // Reset snake to initial state.
  snake = [
    { x: 80, y: 80 },
    { x: 60, y: 80 },
    { x: 40, y: 80 }
  ];
  direction = "RIGHT";
  generateFood();
  // Get the game speed from the level selector (lower interval = faster game)
  gameSpeed = parseInt(levelSelect.value);
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, gameSpeed);
}

// Add event listeners
document.addEventListener("keydown", changeDirection);
startButton.addEventListener("click", startGame);
