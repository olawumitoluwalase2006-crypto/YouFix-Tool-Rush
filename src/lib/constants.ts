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
    color: '#34d399', // emerald-400
    glowColor: 'rgba(52, 211, 153, 0.8)',
    weight: 35,
    description: 'Fundamental torquing tool. Fast & reliable.',
  },
  'duct-tape': {
    type: 'duct-tape',
    label: 'Industrial Seal Tape',
    points: 15,
    color: '#6ee7b7', // emerald-300
    glowColor: 'rgba(110, 231, 183, 0.8)',
    weight: 25,
    description: 'Quick-patch emergency sealing adhesive.',
  },
  screwdriver: {
    type: 'screwdriver',
    label: 'Precision Screwdriver',
    points: 20,
    color: '#22d3ee', // cyan-400
    glowColor: 'rgba(34, 211, 238, 0.8)',
    weight: 20,
    description: 'Fine electronics calibrate & fastening.',
  },
  'hydraulic-jack': {
    type: 'hydraulic-jack',
    label: 'Heavy Hydraulic Jack',
    points: 30,
    color: '#2dd4bf', // teal-400
    glowColor: 'rgba(45, 212, 191, 0.8)',
    weight: 12,
    description: 'High-capacity stabilizer for heavy machinery.',
  },
  multimeter: {
    type: 'multimeter',
    label: 'Digital Multimeter',
    points: 40,
    color: '#67e8f9', // cyan-300
    glowColor: 'rgba(103, 232, 249, 0.8)',
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
    color: '#f87171', // red-400
    glowColor: 'rgba(248, 113, 113, 0.95)',
    weight: 35,
    description: 'High-voltage leakage. Blasts circuit breaker.',
  },
  smoke: {
    type: 'smoke',
    label: 'Toxic Exhaust Fume',
    color: '#fb923c', // amber-400 / orange
    glowColor: 'rgba(251, 146, 60, 0.85)',
    weight: 25,
    description: 'Choking smoke reduces workshop visibility.',
  },
  fire: {
    type: 'fire',
    label: 'Thermal Flash Flame',
    color: '#ef4444', // red-500
    glowColor: 'rgba(239, 68, 68, 0.95)',
    weight: 25,
    description: 'Rogue thermal runaway explosion hazard.',
  },
  'oil-slick': {
    type: 'oil-slick',
    label: 'Synthetic Oil Spill',
    color: '#f43f5e', // rose-500
    glowColor: 'rgba(244, 63, 94, 0.9)',
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
