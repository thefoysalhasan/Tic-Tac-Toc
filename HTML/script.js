// Game state variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'pvp';
let difficulty = 'easy';

// DOM Elements
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const gameModeSelect = document.getElementById('gameMode');
const difficultySelect = document.getElementById('difficulty');
const resultModal = document.getElementById('resultModal');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const playAgainButton = document.getElementById('playAgainButton');

// Winning combinations
const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
gameModeSelect.addEventListener('change', updateGameMode);
difficultySelect.addEventListener('change', updateDifficulty);
playAgainButton.addEventListener('click', closeModal);

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // If cell is already occupied or the game is inactive, ignore the click
    if (board[clickedCellIndex] !== '' || !gameActive) return;

    // Update board and display player's move
    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    // Check if the player won or the game is a draw
    if (checkWinner(currentPlayer)) {
        endGame(false);
        return;
    }

    if (board.every(cell => cell !== '')) {
        endGame(true);
        return;
    }

    // Switch turn or let AI play
    if (gameMode === 'ai' && currentPlayer === 'X') {
        currentPlayer = 'O';
        setTimeout(aiMove, 500); // Delay AI's move slightly for better UX
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function aiMove() {
    const emptyCells = board
        .map((val, idx) => val === '' ? idx : null)
        .filter(val => val !== null);

    // Random AI move (basic implementation)
    const aiChoice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[aiChoice] = 'O';
    cells[aiChoice].textContent = 'O';

    // Check if AI wins or it's a draw
    if (checkWinner('O')) {
        endGame(false);
    } else if (board.every(cell => cell !== '')) {
        endGame(true);
    } else {
        currentPlayer = 'X'; // Switch back to the player
    }
}

function checkWinner(player) {
    return winningCombos.some(combo =>
        combo.every(index => board[index] === player)
    );
}

function endGame(isDraw) {
    gameActive = false;

    resultTitle.textContent = isDraw ? 'Draw!' : `${currentPlayer} Wins!`;
    resultMessage.textContent = isDraw 
        ? 'No one wins this time.' 
        : currentPlayer === 'X' 
        ? 'Player X wins!' 
        : 'AI wins!';
    
    resultModal.style.display = 'block';
}

function resetGame() {
    board.fill('');
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
    resultModal.style.display = 'none';
}

function updateGameMode() {
    gameMode = gameModeSelect.value;
    difficultySelect.style.display = gameMode === 'ai' ? 'block' : 'none';
    resetGame();
}

function updateDifficulty() {
    difficulty = difficultySelect.value;
    resetGame();
}

function closeModal() {
    resultModal.style.display = 'none';
}
