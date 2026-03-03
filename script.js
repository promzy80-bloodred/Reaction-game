// ===========================
// GET HTML ELEMENTS
// ===========================
const box = document.getElementById("box");                 // The clickable box
const scoreDisplay = document.getElementById("score");      // Current score
const highScoreDisplay = document.getElementById("highScore"); // High score
const gameArea = document.getElementById("gameArea");       // Container for the box
const startButton = document.getElementById("startButton"); // Start button
const difficultySelect = document.getElementById("difficulty"); // Difficulty dropdown

// ===========================
// CREATE DYNAMIC ELEMENTS
// ===========================
const timerDisplay = document.createElement("p");           // Timer display
timerDisplay.textContent = "Time: 30";
document.body.insertBefore(timerDisplay, gameArea);

const comboDisplay = document.createElement("p");           // Combo display
comboDisplay.textContent = "Combo: 0x";
document.body.insertBefore(comboDisplay, gameArea);

// ===========================
// CREATE LEVEL DISPLAY
// ===========================
const levelDisplay = document.createElement("p"); // Create level text
levelDisplay.textContent = "Level: 1"; // Default level
document.body.insertBefore(levelDisplay, gameArea); // Add above game area

// ===========================
// CREATE LIVES DISPLAY
// ===========================
const livesDisplay = document.createElement("p"); // Create lives text
livesDisplay.textContent = "Lives: 3"; // Default lives
document.body.insertBefore(livesDisplay, gameArea); // Add above game area

// ===========================
// INITIALIZE VARIABLES
// ===========================
let score = 0;
let highScore = localStorage.getItem("reactionHighScore") || 0;
highScoreDisplay.textContent = highScore;

let timeLeft = 30;
let gameActive = false;

let comboCount = 0;
const comboTimeout = 2000; // 2 seconds between clicks to maintain combo
let comboTimer;

let boxSize = 60;      // Default box size
let shrinkRate = 5;    // Pixels box shrinks per interval
let gameTime = 30;     // Default game time

const clickSound = new Audio("click.mp3"); // Sound file for click (make sure it exists)

// ===========================
// LEVEL SYSTEM VARIABLES
// ===========================
let level = 1;          // Starting level
let pointsPerLevel = 50; // Points needed to level up
// ===========================
// LIVES SYSTEM VARIABLE
// ===========================
let lives = 3; // Player starts with 3 lives

// ===========================
// GLOBAL TIMER VARIABLE
// ===========================
let timer; // Store timer globally so we can clear it properly

// ===========================
// FUNCTION TO GENERATE RANDOM COLOR
// ===========================
function randomColor() {
    const colors = ["red","green","blue","orange","purple","yellow","pink"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ===========================
// FUNCTION TO MOVE BOX (MOBILE SAFE)
// ===========================
function moveBox() {
    if (!gameActive) return; // Stop if game is not active

    let maxX = gameArea.clientWidth - box.clientWidth;
    let maxY = gameArea.clientHeight - box.clientHeight;

    if (maxX < 0) maxX = 0;
    if (maxY < 0) maxY = 0;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    box.style.left = randomX + "px";
    box.style.top = randomY + "px";
}

// ===========================
// BOX CLICK HANDLER FUNCTION
// ===========================
function boxClickHandler(event) {
    event.stopPropagation(); // Prevent click from reaching gameArea
    if (!gameActive) return;

    // -------- COMBO LOGIC --------
    comboCount++;
    comboDisplay.textContent = "Combo: " + comboCount + "x";

    
    // ===========================
// COMBO LEVEL EFFECTS
// ===========================

// Remove all combo effect classes first
box.classList.remove("combo-glow", "combo-super", "combo-ultra", "combo-insane");

// Apply effect based on combo level
if (comboCount >= 20) {
    box.classList.add("combo-insane");
} 
else if (comboCount >= 15) {
    box.classList.add("combo-ultra");
} 
else if (comboCount >= 10) {
    box.classList.add("combo-super");
} 
else if (comboCount >= 5) {
    box.classList.add("combo-glow");
}

    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => {
        comboCount = 0;
        comboDisplay.textContent = "Combo: 0x";

         // Remove glow when combo resets
    // Remove all combo effect classes when combo resets
    box.classList.remove("combo-glow", "combo-super", "combo-ultra", "combo-insane");
    }, comboTimeout);

    // -------- SCORE CALCULATION --------
    score += comboCount; // Score is multiplied by combo
    scoreDisplay.textContent = score;

    // ===========================
// LEVEL UP LOGIC
// ===========================

// Check if player reached next level
if (score >= level * pointsPerLevel) {

    level++; // Increase level
    levelDisplay.textContent = "Level: " + level; // Update display

    // Increase difficulty each level
    shrinkRate += 1; // Box shrinks faster

}

    // -------- SOUND EFFECT --------
    clickSound.currentTime = 0;
    clickSound.play();

    // -------- COLOR CHANGE --------
    box.style.backgroundColor = randomColor();

    // -------- SHRINK BOX BASED ON DIFFICULTY --------
    if (score % 5 === 0) {
        let currentSize = box.clientWidth;
        if (currentSize > 20) { // Minimum size limit
            box.style.width = (currentSize - shrinkRate) + "px";
            box.style.height = (currentSize - shrinkRate) + "px";
        }
    }

    // -------- MOVE BOX --------
    moveBox();

    // -------- HIGH SCORE CHECK --------
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem("reactionHighScore", highScore);
    }
}

// ===========================
// START GAME FUNCTION
// ===========================
function startGame() {

    // Clear previous timer if it exists
    clearInterval(timer);

    // Reset lives when game starts
    lives = 3;
    livesDisplay.textContent = "Lives: 3";

    // Reset level when game starts
    level = 1;
    levelDisplay.textContent = "Level: 1";

    // -------- RESET GAME VARIABLES --------
    score = 0;
    comboCount = 0;
    scoreDisplay.textContent = score;
    comboDisplay.textContent = "Combo: 0x";

    gameActive = true;

     

    // -------- SET DIFFICULTY --------
    const selectedDifficulty = difficultySelect.value;

    if (selectedDifficulty === "easy") {
        boxSize = 70;
        shrinkRate = 3;
        gameTime = 45;
    } else if (selectedDifficulty === "medium") {
        boxSize = 60;
        shrinkRate = 5;
        gameTime = 30;
    } else if (selectedDifficulty === "hard") {
        boxSize = 50;
        shrinkRate = 7;
        gameTime = 20;
    }

    box.style.width = boxSize + "px";
    box.style.height = boxSize + "px";
    box.style.display = "block"; // Show box

    timeLeft = gameTime;
    timerDisplay.textContent = "Time: " + timeLeft;

    // -------- MOVE BOX INITIALLY --------
    moveBox();

    // -------- START TIMER --------
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = "Time: " + timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            gameActive = false;
            box.style.display = "none";
            alert("Game Over! Your score: " + score);
        }
    }, 1000);
}

// ===========================
// ADD EVENT LISTENERS (AFTER FUNCTIONS)
// ===========================
box.addEventListener("click", boxClickHandler);       // Desktop click
box.addEventListener("touchstart", boxClickHandler);  // Mobile touch
startButton.addEventListener("click", startGame);    // Start button

// ===========================
// DETECT MISSED CLICKS
// ===========================
gameArea.addEventListener("click", function(event) {

    // If game is not active, do nothing
    if (!gameActive) return;

    // If the click target is NOT the box
    if (event.target !== box) {

        lives--; // Reduce life
        livesDisplay.textContent = "Lives: " + lives; // Update display

        // Check if no lives left
          if (lives <= 0) {
        gameActive = false;
        clearInterval(timer); // STOP TIMER
        box.style.display = "none";
        alert("Game Over! You ran out of lives. Score: " + score);
        }
    }
});