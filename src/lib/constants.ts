import { ToolType, HazardType, DifficultyTier, RepairObjective } from '../types/game';

export interface ToolConfig {
  type: ToolType;
  label: string;
  points: number;
  color: string;
  glowColor: string;
  weight: number; // spawn probability weight
  description: string;
}

export interface HazardConfig {
  type: HazardType;
  label: string;
  color: string;
  glowColor: string;
  weight: number;
  description: string;
}

export const TOOLS_CONFIG: Record<ToolType, ToolConfig> = {
  wrench: {
    type: 'wrench',
    label: 'Cyber Wrench',
    points: 10,
    color: '#38bdf8', // sky-400
    glowColor: 'rgba(56, 189, 248, 0.7)',
    weight: 35,
    description: 'Fundamental torquing tool. Fast & reliable.',
  },
  'duct-tape': {
    type: 'duct-tape',
    label: 'Industrial Seal Tape',
    points: 15,
    color: '#34d399', // emerald-400
    glowColor: 'rgba(52, 211, 153, 0.7)',
    weight: 25,
    description: 'Quick-patch emergency sealing adhesive.',
  },
  screwdriver: {
    type: 'screwdriver',
    label: 'Precision Screwdriver',
    points: 20,
    color: '#fbbf24', // amber-400
    glowColor: 'rgba(251, 191, 36, 0.7)',
    weight: 20,
    description: 'Fine electronics calibrate & fastening.',
  },
  'hydraulic-jack': {
    type: 'hydraulic-jack',
    label: 'Heavy Hydraulic Jack',
    points: 30,
    color: '#a78bfa', // purple-400
    glowColor: 'rgba(167, 139, 250, 0.7)',
    weight: 12,
    description: 'High-capacity stabilizer for heavy machinery.',
  },
  multimeter: {
    type: 'multimeter',
    label: 'Digital Multimeter',
    points: 40,
    color: '#f43f5e', // rose-500
    glowColor: 'rgba(244, 63, 94, 0.7)',
    weight: 8,
    description: 'Critical voltage & diagnostic testing.',
  },
  'gold-wrench': {
    type: 'gold-wrench',
    label: 'Overdrive Golden Wrench',
    points: 100,
    color: '#facc15', // yellow-400
    glowColor: 'rgba(250, 204, 21, 0.95)',
    weight: 3,
    description: 'Legendary prototype. Clears screen & gives temporary shield!',
  },
};

export const HAZARDS_CONFIG: Record<HazardType, HazardConfig> = {
  spark: {
    type: 'spark',
    label: 'Electrical Arc Spark',
    color: '#60a5fa', // electric blue
    glowColor: 'rgba(96, 165, 250, 0.9)',
    weight: 35,
    description: 'High-voltage leakage. Blasts circuit breaker.',
  },
  smoke: {
    type: 'smoke',
    label: 'Toxic Exhaust Fume',
    color: '#94a3b8', // slate-400
    glowColor: 'rgba(148, 163, 184, 0.6)',
    weight: 25,
    description: 'Choking smoke reduces workshop visibility.',
  },
  fire: {
    type: 'fire',
    label: 'Thermal Flash Flame',
    color: '#ef4444', // red-500
    glowColor: 'rgba(239, 68, 68, 0.9)',
    weight: 25,
    description: 'Rogue thermal runaway explosion hazard.',
  },
  'oil-slick': {
    type: 'oil-slick',
    label: 'Synthetic Oil Spill',
    color: '#1e293b', // slate-800 with purple sheen
    glowColor: 'rgba(147, 51, 234, 0.8)',
    weight: 15,
    description: 'Slippery fluid that destabilizes mechanics.',
  },
};

export interface TierSetting {
  name: string;
  minScore: number;
  baseSpeed: number;
  spawnIntervalMs: number;
  hazardProbability: number;
  color: string;
  badge: string;
}

export const TIER_SETTINGS: Record<DifficultyTier, TierSetting> = {
  APPRENTICE: {
    name: 'Apprentice Mechanic',
    minScore: 0,
    baseSpeed: 3.2,
    spawnIntervalMs: 1100,
    hazardProbability: 0.22,
    color: '#38bdf8',
    badge: 'TIER I',
  },
  TECHNICIAN: {
    name: 'Certified Technician',
    minScore: 250,
    baseSpeed: 4.8,
    spawnIntervalMs: 850,
    hazardProbability: 0.32,
    color: '#34d399',
    badge: 'TIER II',
  },
  MASTER: {
    name: 'Master Craftsman',
    minScore: 800,
    baseSpeed: 6.6,
    spawnIntervalMs: 650,
    hazardProbability: 0.42,
    color: '#f59e0b',
    badge: 'TIER III',
  },
  CYBER_SPECIALIST: {
    name: 'Cybernetic Specialist',
    minScore: 1600,
    baseSpeed: 8.8,
    spawnIntervalMs: 500,
    hazardProbability: 0.50,
    color: '#ec4899',
    badge: 'OVERDRIVE',
  },
};

export const REPAIR_OBJECTIVES_POOL: Omit<RepairObjective, 'id' | 'collected'>[] = [
  {
    title: 'Hydraulic Cylinder Leak',
    targetTool: 'duct-tape',
    required: 3,
    bonusPoints: 120,
    description: 'Seal 3 high-pressure fluid leaks immediately!',
  },
  {
    title: 'Engine Manifold Breakdown',
    targetTool: 'wrench',
    required: 4,
    bonusPoints: 150,
    description: 'Tighten 4 loose cylinder head bolts.',
  },
  {
    title: 'Cyber Deck Short Circuit',
    targetTool: 'screwdriver',
    required: 3,
    bonusPoints: 160,
    description: 'Fasten 3 terminal ground screws on the mainboard.',
  },
  {
    title: 'Chassis Alignment Malfunction',
    targetTool: 'hydraulic-jack',
    required: 2,
    bonusPoints: 200,
    description: 'Support the mainframe with 2 heavy jacks.',
  },
  {
    title: 'High-Voltage Power Surge',
    targetTool: 'multimeter',
    required: 2,
    bonusPoints: 250,
    description: 'Calibrate frequency rails using 2 multimeters.',
  },
];
