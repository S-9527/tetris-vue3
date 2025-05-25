import { reactive, onUnmounted } from 'vue';
import { 
  GameState, 
  Tetromino, 
  GhostPiece, 
  TetrominoTemplate
} from '../game/types';
import { 
  GAME_CONFIG, 
  TETROMINO_TEMPLATES, 
  getRandomTetromino, 
  calculateSpeed 
} from '../game/config';

export function useGameEngine() {
  // Initialize game state with default values
  const gameState = reactive<GameState>({
    board: [],
    activeBlock: null,
    ghostBlock: null,
    nextPieces: [],
    holdPiece: null,
    canHold: true,
    score: 0,
    level: 0,
    lines: 0,
    gameOver: false,
    isPaused: false
  });
  
  // Game timer
  let gameTimer: number | null = null;
  
  // Reset/initialize the game board
  const initializeBoard = () => {
    const { boardWidth, boardHeight } = GAME_CONFIG;
    gameState.board = Array(boardHeight).fill(0).map(() => Array(boardWidth).fill(0));
  };
  
  // Create a new tetromino
  const createTetromino = (template: TetrominoTemplate): Tetromino => {
    const { boardWidth } = GAME_CONFIG;
    const shapeWidth = template.shape[0].length;
    
    return {
      shape: JSON.parse(JSON.stringify(template.shape)),
      type: template.type,
      position: {
        x: Math.floor((boardWidth - shapeWidth) / 2),
        y: 0
      }
    };
  };
  
  // Fill the next pieces queue
  const fillNextPieces = () => {
    while (gameState.nextPieces.length < GAME_CONFIG.nextPiecesCount) {
      const template = getRandomTetromino();
      gameState.nextPieces.push(createTetromino(template));
    }
  };
  
  // Get the next piece from the queue
  const getNextPiece = (): Tetromino => {
    const nextPiece = gameState.nextPieces.shift()!;
    fillNextPieces();
    return nextPiece;
  };
  
  // Spawn a new active tetromino
  const spawnTetromino = () => {
    if (gameState.gameOver) return;
    
    // Get the next piece
    gameState.activeBlock = getNextPiece();
    
    // Check if game is over (collision at spawn)
    if (checkCollision(gameState.activeBlock)) {
      gameState.gameOver = true;
      stopGame();
    }
    
    // Update ghost piece
    updateGhostPiece();
  };
  
  // Check if the tetromino collides with the board or boundaries
  const checkCollision = (tetromino: Tetromino | null): boolean => {
    if (!tetromino) return false;
    
    const { shape, position } = tetromino;
    const { boardWidth, boardHeight } = GAME_CONFIG;
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardRow = position.y + row;
          const boardCol = position.x + col;
          
          // Check boundaries
          if (
            boardRow < 0 || 
            boardRow >= boardHeight || 
            boardCol < 0 || 
            boardCol >= boardWidth
          ) {
            return true;
          }
          
          // Check collision with other blocks
          if (boardRow >= 0 && gameState.board[boardRow][boardCol] !== 0) {
            return true;
          }
        }
      }
    }
    
    return false;
  };
  
  // Lock the tetromino into the board
  const lockTetromino = () => {
    if (!gameState.activeBlock) return;
    
    const { shape, position, type } = gameState.activeBlock;
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardRow = position.y + row;
          const boardCol = position.x + col;
          
          if (boardRow >= 0 && boardCol >= 0) {
            gameState.board[boardRow][boardCol] = type;
          }
        }
      }
    }
    
    // Check for completed lines
    clearLines();
    
    // Allow holding again
    gameState.canHold = true;
    
    // Spawn a new tetromino
    spawnTetromino();
  };
  
  // Clear completed lines
  const clearLines = () => {
    const { boardHeight, boardWidth, pointsPerLine, linesPerLevel } = GAME_CONFIG;
    let clearedLines = 0;
    
    // Check each row for a complete line
    for (let row = boardHeight - 1; row >= 0; row--) {
      if (gameState.board[row].every(cell => cell !== 0)) {
        // Remove the line and add a new empty line at the top
        gameState.board.splice(row, 1);
        gameState.board.unshift(Array(boardWidth).fill(0));
        clearedLines++;
        row++; // Check the same row again as rows have shifted
      }
    }
    
    if (clearedLines > 0) {
      // Update score, lines and level
      gameState.score += pointsPerLine[Math.min(clearedLines - 1, pointsPerLine.length - 1)] * (gameState.level + 1);
      gameState.lines += clearedLines;
      
      // Check for level up
      const newLevel = Math.floor(gameState.lines / linesPerLevel);
      if (newLevel > gameState.level) {
        gameState.level = newLevel;
        updateGameSpeed();
      }
    }
  };
  
  // Move the active tetromino
  const moveTetromino = (direction: 'left' | 'right' | 'down'): boolean => {
    if (!gameState.activeBlock || gameState.gameOver || gameState.isPaused) return false;
    
    const newPosition = { ...gameState.activeBlock.position };
    
    switch (direction) {
      case 'left':
        newPosition.x -= 1;
        break;
      case 'right':
        newPosition.x += 1;
        break;
      case 'down':
        newPosition.y += 1;
        break;
    }
    
    // Create a temporary tetromino with the new position
    const tempTetromino = {
      ...gameState.activeBlock,
      position: newPosition
    };
    
    // Check if the move is valid
    if (!checkCollision(tempTetromino)) {
      gameState.activeBlock.position = newPosition;
      
      // Update ghost piece if moving left/right
      if (direction === 'left' || direction === 'right') {
        updateGhostPiece();
      }
      
      return true;
    }
    
    // If moving down and collision, lock the tetromino
    if (direction === 'down') {
      lockTetromino();
    }
    
    return false;
  };
  
  // Rotate the active tetromino
  const rotateTetromino = (): boolean => {
    if (!gameState.activeBlock || gameState.gameOver || gameState.isPaused) return false;
    
    const { type, position } = gameState.activeBlock;
    
    // Find the tetromino template
    const template = TETROMINO_TEMPLATES.find(t => t.type === type);
    if (!template) return false;
    
    // Get current rotation index
    const currentShape = JSON.stringify(gameState.activeBlock.shape);
    let rotationIndex = template.rotations.findIndex(
      rotation => JSON.stringify(rotation) === currentShape
    );
    
    // Get next rotation
    rotationIndex = (rotationIndex + 1) % template.rotations.length;
    const newShape = template.rotations[rotationIndex];
    
    // Create a temporary tetromino with the new rotation
    const tempTetromino = {
      ...gameState.activeBlock,
      shape: newShape
    };
    
    // Check if the rotation is valid
    if (!checkCollision(tempTetromino)) {
      gameState.activeBlock.shape = newShape;
      updateGhostPiece();
      return true;
    }
    
    // Try wall kicks (offset the position to make the rotation valid)
    const offsets = [
      { x: 1, y: 0 },   // Try right
      { x: -1, y: 0 },  // Try left
      { x: 0, y: -1 },  // Try up
      { x: 2, y: 0 },   // Try 2 spaces right
      { x: -2, y: 0 }   // Try 2 spaces left
    ];
    
    for (const offset of offsets) {
      const kickPosition = {
        x: position.x + offset.x,
        y: position.y + offset.y
      };
      
      const kickTetromino = {
        ...tempTetromino,
        position: kickPosition
      };
      
      if (!checkCollision(kickTetromino)) {
        gameState.activeBlock.shape = newShape;
        gameState.activeBlock.position = kickPosition;
        updateGhostPiece();
        return true;
      }
    }
    
    return false;
  };
  
  // Hard drop the tetromino
  const hardDrop = () => {
    if (!gameState.activeBlock || gameState.gameOver || gameState.isPaused) return;
    
    // Move down until collision
    while (moveTetromino('down')) {}
  };
  
  // Update the ghost piece position
  const updateGhostPiece = () => {
    if (!gameState.activeBlock || gameState.gameOver) {
      gameState.ghostBlock = null;
      return;
    }
    
    // Create a copy of the active tetromino
    const ghostPiece: GhostPiece = {
      shape: JSON.parse(JSON.stringify(gameState.activeBlock.shape)),
      position: { ...gameState.activeBlock.position }
    };
    
    // Move the ghost piece down until collision
    while (true) {
      const newY = ghostPiece.position.y + 1;
      const tempGhost = {
        ...ghostPiece,
        position: { ...ghostPiece.position, y: newY }
      };
      
      // Convert to Tetromino type for collision check
      const tempTetromino = {
        ...tempGhost,
        type: gameState.activeBlock.type
      } as Tetromino;
      
      if (checkCollision(tempTetromino)) {
        break;
      }
      
      ghostPiece.position.y = newY;
    }
    
    // Only show ghost if it's in a different position than the active block
    if (ghostPiece.position.y > gameState.activeBlock.position.y) {
      gameState.ghostBlock = ghostPiece;
    } else {
      gameState.ghostBlock = null;
    }
  };
  
  // Hold the current tetromino
  const holdCurrentPiece = () => {
    if (!gameState.activeBlock || !gameState.canHold || gameState.gameOver || gameState.isPaused) return;
    
    const currentType = gameState.activeBlock.type;
    let template: TetrominoTemplate;
    
    // If there's already a held piece, swap them
    if (gameState.holdPiece) {
      template = TETROMINO_TEMPLATES.find(t => t.type === gameState.holdPiece!.type)!;
      gameState.activeBlock = createTetromino(template);
    } else {
      // Otherwise, get the next piece
      spawnTetromino();
    }
    
    // Update hold piece
    template = TETROMINO_TEMPLATES.find(t => t.type === currentType)!;
    gameState.holdPiece = createTetromino(template);
    
    // Prevent holding again until a piece is placed
    gameState.canHold = false;
    
    // Update ghost piece
    updateGhostPiece();
  };
  
  // Update game tick
  const updateGameTick = () => {
    if (gameState.gameOver || gameState.isPaused) return;
    
    moveTetromino('down');
  };
  
  // Update game speed based on level
  const updateGameSpeed = () => {
    const speed = calculateSpeed(gameState.level);
    
    if (gameTimer) {
      clearInterval(gameTimer);
    }
    
    gameTimer = window.setInterval(updateGameTick, speed);
  };
  
  // Start the game
  const startGame = () => {
    initializeBoard();
    fillNextPieces();
    spawnTetromino();
    gameState.gameOver = false;
    gameState.isPaused = false;
    gameState.score = 0;
    gameState.level = 0;
    gameState.lines = 0;
    updateGameSpeed();
  };
  
  // Stop the game
  const stopGame = () => {
    if (gameTimer) {
      clearInterval(gameTimer);
      gameTimer = null;
    }
  };
  
  // Reset the game
  const resetGame = () => {
    stopGame();
    gameState.nextPieces = [];
    gameState.holdPiece = null;
    gameState.canHold = true;
    startGame();
  };
  
  // Toggle pause state
  const togglePause = () => {
    if (gameState.gameOver) return;
    
    gameState.isPaused = !gameState.isPaused;
    
    if (gameState.isPaused) {
      stopGame();
    } else {
      updateGameSpeed();
    }
  };
  
  // Movement functions
  const moveLeft = () => {
    if (gameState.isPaused || gameState.gameOver) return;
    moveTetromino('left');
  };
  
  const moveRight = () => {
    if (gameState.isPaused || gameState.gameOver) return;
    moveTetromino('right');
  };
  
  const moveDown = () => {
    if (gameState.isPaused || gameState.gameOver) return;
    moveTetromino('down');
  };
  
  const rotateBlock = () => {
    if (gameState.isPaused || gameState.gameOver) return;
    rotateTetromino();
  };
  
  // Clean up on component unmount
  onUnmounted(() => {
    stopGame();
  });
  
  // Initialize game
  startGame();
  
  return {
    gameState,
    resetGame,
    moveLeft,
    moveRight,
    moveDown,
    rotateBlock,
    hardDrop,
    holdCurrentPiece,
    togglePause
  };
}
