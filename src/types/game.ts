export type ItemCategory = 'tool' | 'hazard';

export type ToolType = 
  | 'wrench' 
  | 'duct-tape' 
  | 'hydraulic-jack' 
  | 'screwdriver' 
  | 'multimeter' 
  | 'gold-wrench';

export type HazardType = 
  | 'spark' 
  | 'smoke' 
  | 'fire' 
  | 'oil-slick';

export interface FallingItem {
  id: string;
  category: ItemCategory;
  type: ToolType | HazardType;
  label: string;
  points: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  glowColor: string;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  targetX: number;
  hasShield: boolean;
  shieldDuration: number;
  lastHitTime: number;
}

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export type DifficultyTier = 'APPRENTICE' | 'TECHNICIAN' | 'MASTER' | 'CYBER_SPECIALIST';

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  opacity: number;
  scale: number;
}

export interface RepairObjective {
  id: string;
  title: string;
  targetTool: ToolType;
  required: number;
  collected: number;
  bonusPoints: number;
  description: string;
}

export interface GameStats {
  score: number;
  highScore: number;
  lives: number;
  maxLives: number;
  tier: DifficultyTier;
  combo: number;
  maxCombo: number;
  multiplier: number;
  toolsCaught: number;
  hazardsAvoided: number;
  hazardsHit: number;
  activeObjective: RepairObjective | null;
}

export interface HighScoreRecord {
  score: number;
  tier: DifficultyTier;
  date: string;
  accuracy: number;
  toolsCaught: number;
  maxCombo: number;
}
