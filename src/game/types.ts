export interface Piece {
  shape: number[][];
  type: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  shape: number[][];
  type: number;
  position: Position;
}

export interface GhostPiece {
  shape: number[][];
  position: Position;
}

export interface GameState {
  board: number[][];
  activeBlock: Tetromino | null;
  ghostBlock: GhostPiece | null;
  nextPieces: Tetromino[];
  holdPiece: Tetromino | null;
  canHold: boolean;
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  isPaused: boolean;
}

export interface TetrominoTemplate {
  type: number;
  shape: number[][];
  rotations: number[][][];
}

export enum TetrominoType {
  I = 1,
  O = 2,
  T = 3,
  S = 4,
  Z = 5,
  J = 6,
  L = 7
}

export enum GameSpeed {
  DEFAULT = 1000,
  MIN = 100,
  SOFT_DROP = 50,
  LEVEL_FACTOR = 0.85
}

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  nextPiecesCount: number;
  pointsPerLine: number[];
  linesPerLevel: number;
}
