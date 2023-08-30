// Module for game board
const gameBoard = (() => {
  const board = new Array(9).fill('');

  const getBoard = () => board;

  const placeMarker = (index, marker) => {
    if (board[index] === '') {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board.fill('');
  };

  return { getBoard, placeMarker, resetBoard };
})();

// Player factory function
const createPlayer = (name, marker) => {
  return { name, marker };
};

// Module for game controller
const gameController = (() => {
  const player = createPlayer('YOU', 'X');
  const computer = createPlayer('Computer', 'O');
  let currentPlayer = player;
  let gameOver = false;

  const switchPlayer = () => {
    currentPlayer = (currentPlayer === player) ? computer : player;
  };

  const playComputerTurn = () => {
    const bestMove = getBestMove(gameBoard.getBoard(), computer.marker);
    gameController.playTurn(bestMove);
    updateUI();
  };

  const getBestMove = (board, marker) => {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = marker;
        let score = minimax(board, 0, false);
        board[i] = '';

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const scores = {
    X: -1,
    O: 1,
    draw: 0
  };

  const minimax = (board, depth, isMaximizing) => {
    const result = checkResult(board);
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = computer.marker;
          let score = minimax(board, depth + 1, false);
          board[i] = '';
          bestScore = Math.max(bestScore, score);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = player.marker;
          let score = minimax(board, depth + 1, true);
          board[i] = '';
          bestScore = Math.min(bestScore, score);
        }
      }
      return bestScore;
    }
  };

  const checkResult = (board) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]           // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every(cell => cell !== '')) {
      return 'draw';
    }

    return null;
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    currentPlayer = player;
    gameOver = false;
    updateUI();
  };

  const showAlert = (message) => {
    alert(message);
  };

  const playTurn = (index) => {
    if (!gameOver && gameBoard.placeMarker(index, currentPlayer.marker)) {
      const result = checkResult(gameBoard.getBoard());
      if (result === player.marker) {
        gameOver = true;
        showAlert(`${player.name} wins!`);
        updateUI();
      } else if (result === computer.marker) {
        gameOver = true;
        showAlert(`${computer.name} wins!`);
        updateUI();
      } else if (result === 'draw') {
        gameOver = true;
        showAlert("It's a draw!");
      } else {
        switchPlayer();
        if (currentPlayer === computer) {
          playComputerTurn();
        }
      }
    }
  };

  return { playTurn, resetGame };
})();

// Create the game board cells
const boardElement = document.getElementById('gameBoard');
for (let i = 0; i < 9; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('data-index', i);
  boardElement.appendChild(cell);
}

// Get all cell elements
const cells = document.querySelectorAll('.cell');

// Add event listeners to cells
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = parseInt(cell.getAttribute('data-index'));
    gameController.playTurn(index);
  });
});

// Reset button
const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
  gameController.resetGame();
});

// Update UI based on game state
const updateUI = () => {
  const board = gameBoard.getBoard();
  cells.forEach((cell, index) => {
    cell.textContent = board[index];
  });
};

// Initial UI update
updateUI();
