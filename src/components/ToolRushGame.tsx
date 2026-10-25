'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  GameStatus, 
  GameStats, 
  FallingItem, 
  Player, 
  Particle, 
  FloatingText, 
  ToolType, 
  HazardType, 
  DifficultyTier 
} from '../types/game';
import { 
  TOOLS_CONFIG, 
  HAZARDS_CONFIG, 
  TIER_SETTINGS, 
  REPAIR_OBJECTIVES_POOL 
} from '../lib/constants';
import { soundEngine } from '../lib/audio';
import { HUD } from './HUD';
import { GameOverModal } from './GameOverModal';
import { PauseModal } from './PauseModal';
import { InstructionsModal } from './InstructionsModal';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';

interface ToolRushGameProps {
  onReturnHome: () => void;
}

export const ToolRushGame: React.FC<ToolRushGameProps> = ({ onReturnHome }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // High-level Game Status
  const [status, setStatus] = useState<GameStatus>('PLAYING');
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  // HUD stats state
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: 0,
    lives: 3,
    maxLives: 3,
    tier: 'APPRENTICE',
    combo: 0,
    maxCombo: 0,
    multiplier: 1.0,
    toolsCaught: 0,
    hazardsAvoided: 0,
    hazardsHit: 0,
    activeObjective: null,
  });

  // Game Logic References (Mutable inside 60FPS RAF loop)
  const gameStateRef = useRef({
    status: 'PLAYING' as GameStatus,
    score: 0,
    highScore: 0,
    lives: 3,
    maxLives: 3,
    tier: 'APPRENTICE' as DifficultyTier,
    combo: 0,
    maxCombo: 0,
    multiplier: 1.0,
    toolsCaught: 0,
    hazardsAvoided: 0,
    hazardsHit: 0,
    activeObjective: null as GameStats['activeObjective'],
    
    // Virtual resolution
    width: 800,
    height: 600,

    // Entities
    player: {
      x: 350,
      y: 530,
      width: 110,
      height: 22,
      speed: 550,
      targetX: 350,
      hasShield: false,
      shieldDuration: 0,
      lastHitTime: 0,
    } as Player,

    items: [] as FallingItem[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],

    // Spawning timers
    lastSpawnTime: 0,
    spawnInterval: 1100,
    lastFrameTime: performance.now(),
    screenShake: 0,

    // Input states
    keys: {
      left: false,
      right: false,
      boost: false,
    },
    touchSteer: 0, // -1 (left), 0 (none), 1 (right)
    isPointerActive: false,
    pointerX: 350,
  });

  // Pick random repair objective
  const spawnNewObjective = useCallback(() => {
    const randomTemplate = REPAIR_OBJECTIVES_POOL[Math.floor(Math.random() * REPAIR_OBJECTIVES_POOL.length)];
    gameStateRef.current.activeObjective = {
      ...randomTemplate,
      id: Math.random().toString(36).substring(2, 9),
      collected: 0,
    };
    setStats((prev) => ({
      ...prev,
      activeObjective: gameStateRef.current.activeObjective,
    }));
  }, []);

  // Update Game Stats state
  const syncStats = useCallback(() => {
    const s = gameStateRef.current;
    setStats({
      score: s.score,
      highScore: s.highScore,
      lives: s.lives,
      maxLives: s.maxLives,
      tier: s.tier,
      combo: s.combo,
      maxCombo: s.maxCombo,
      multiplier: s.multiplier,
      toolsCaught: s.toolsCaught,
      hazardsAvoided: s.hazardsAvoided,
      hazardsHit: s.hazardsHit,
      activeObjective: s.activeObjective,
    });
  }, []);

  // Reset shift / restart
  const restartGame = useCallback(() => {
    const s = gameStateRef.current;
    s.status = 'PLAYING';
    s.score = 0;
    s.lives = 3;
    s.tier = 'APPRENTICE';
    s.combo = 0;
    s.maxCombo = 0;
    s.multiplier = 1.0;
    s.toolsCaught = 0;
    s.hazardsAvoided = 0;
    s.hazardsHit = 0;
    s.items = [];
    s.particles = [];
    s.floatingTexts = [];
    s.player.x = s.width / 2 - s.player.width / 2;
    s.player.targetX = s.player.x;
    s.player.hasShield = false;
    s.player.shieldDuration = 0;
    s.screenShake = 0;
    s.lastFrameTime = performance.now();
    s.lastSpawnTime = performance.now();

    spawnNewObjective();
    syncStats();
    setStatus('PLAYING');
  }, [spawnNewObjective, syncStats]);

  // Audio mute toggle
  const handleToggleMute = useCallback(() => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  }, []);

  // Pause toggle
  const handleTogglePause = useCallback(() => {
    if (gameStateRef.current.status === 'GAMEOVER') return;
    const newStatus = gameStateRef.current.status === 'PAUSED' ? 'PLAYING' : 'PAUSED';
    gameStateRef.current.status = newStatus;
    gameStateRef.current.lastFrameTime = performance.now();
    setStatus(newStatus);
  }, []);

  // Initial setup: Load high score & initial objective
  useEffect(() => {
    try {
      const saved = localStorage.getItem('youfix_high_score_record');
      if (saved) {
        const record = JSON.parse(saved);
        gameStateRef.current.highScore = record.score || 0;
      }
    } catch {
      // safe fallback
    }

    spawnNewObjective();
    syncStats();
  }, [spawnNewObjective, syncStats]);

  // Handle window keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = gameStateRef.current.keys;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keys.left = true;
        gameStateRef.current.isPointerActive = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keys.right = true;
        gameStateRef.current.isPointerActive = false;
      }
      if (e.key === ' ') {
        e.preventDefault();
        keys.boost = true;
        if (gameStateRef.current.status === 'GAMEOVER') {
          restartGame();
        }
      }
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        handleTogglePause();
      }
      if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keys = gameStateRef.current.keys;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keys.right = false;
      }
      if (e.key === ' ') {
        keys.boost = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleTogglePause, handleToggleMute, restartGame]);

  // Pointer / Touch tracking handlers on canvas container
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = gameStateRef.current.width / rect.width;
    const clientX = e.clientX - rect.left;
    const canvasX = clientX * scaleX;

    gameStateRef.current.isPointerActive = true;
    gameStateRef.current.pointerX = Math.max(0, Math.min(gameStateRef.current.width - gameStateRef.current.player.width, canvasX - gameStateRef.current.player.width / 2));
  };

  // Main 60FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const gameLoop = (currentTime: number) => {
      const s = gameStateRef.current;
      const dt = Math.min((currentTime - s.lastFrameTime) / 1000, 0.1);
      s.lastFrameTime = currentTime;

      if (s.status === 'PLAYING') {
        // 1. UPDATE LOGIC
        // Difficulty scaling
        let currentTier: DifficultyTier = 'APPRENTICE';
        if (s.score >= TIER_SETTINGS.CYBER_SPECIALIST.minScore) {
          currentTier = 'CYBER_SPECIALIST';
        } else if (s.score >= TIER_SETTINGS.MASTER.minScore) {
          currentTier = 'MASTER';
        } else if (s.score >= TIER_SETTINGS.TECHNICIAN.minScore) {
          currentTier = 'TECHNICIAN';
        }
        s.tier = currentTier;
        const tierConfig = TIER_SETTINGS[currentTier];

        // Smooth speed scaling inside tier
        const speedScale = 1 + Math.min(s.score / 2500, 1.2);
        s.spawnInterval = tierConfig.spawnIntervalMs / speedScale;

        // Player Shield countdown
        if (s.player.hasShield) {
          s.player.shieldDuration -= dt;
          if (s.player.shieldDuration <= 0) {
            s.player.hasShield = false;
          }
        }

        // Screen Shake reduction
        if (s.screenShake > 0) {
          s.screenShake = Math.max(0, s.screenShake - dt * 25);
        }

        // Player Movement
        const moveSpeed = s.keys.boost ? s.player.speed * 1.75 : s.player.speed;
        
        if (s.isPointerActive) {
          // Smooth lerp to pointer
          const dx = s.pointerX - s.player.x;
          s.player.x += dx * Math.min(dt * 18, 1);
        } else {
          // Keyboard / touch button movement
          let dir = 0;
          if (s.keys.left || s.touchSteer < 0) dir -= 1;
          if (s.keys.right || s.touchSteer > 0) dir += 1;
          s.player.x += dir * moveSpeed * dt;
        }

        // Clamp player within boundaries
        s.player.x = Math.max(10, Math.min(s.width - s.player.width - 10, s.player.x));

        // Spawn Items
        if (currentTime - s.lastSpawnTime > s.spawnInterval) {
          s.lastSpawnTime = currentTime;
          
          const isHazard = Math.random() < tierConfig.hazardProbability;
          const spawnX = 30 + Math.random() * (s.width - 80);

          if (isHazard) {
            const hazards = Object.values(HAZARDS_CONFIG);
            const hazard = hazards[Math.floor(Math.random() * hazards.length)];
            s.items.push({
              id: Math.random().toString(36).substring(2, 9),
              category: 'hazard',
              type: hazard.type,
              label: hazard.label,
              points: 0,
              x: spawnX,
              y: -40,
              width: 32,
              height: 32,
              speed: (tierConfig.baseSpeed * 60 + Math.random() * 30) * speedScale,
              rotation: Math.random() * Math.PI,
              rotationSpeed: (Math.random() - 0.5) * 5,
              color: hazard.color,
              glowColor: hazard.glowColor,
            });
          } else {
            // Select tool weighted
            const tools = Object.values(TOOLS_CONFIG);
            const totalWeight = tools.reduce((acc, t) => acc + t.weight, 0);
            let rand = Math.random() * totalWeight;
            let selectedTool = tools[0];

            for (const tool of tools) {
              if (rand < tool.weight) {
                selectedTool = tool;
                break;
              }
              rand -= tool.weight;
            }

            s.items.push({
              id: Math.random().toString(36).substring(2, 9),
              category: 'tool',
              type: selectedTool.type,
              label: selectedTool.label,
              points: selectedTool.points,
              x: spawnX,
              y: -40,
              width: selectedTool.type === 'gold-wrench' ? 38 : 34,
              height: selectedTool.type === 'gold-wrench' ? 38 : 34,
              speed: (tierConfig.baseSpeed * 55 + Math.random() * 25) * speedScale,
              rotation: Math.random() * Math.PI,
              rotationSpeed: (Math.random() - 0.5) * 4,
              color: selectedTool.color,
              glowColor: selectedTool.glowColor,
            });
          }
        }

        // Update Falling Items & Collision
        const remainingItems: FallingItem[] = [];
        const playerBox = {
          x: s.player.x,
          y: s.player.y,
          width: s.player.width,
          height: s.player.height,
        };

        for (const item of s.items) {
          item.y += item.speed * dt;
          item.rotation += item.rotationSpeed * dt;

          // Check Collision with Player Tray
          const collides = 
            item.x + item.width * 0.8 > playerBox.x &&
            item.x + item.width * 0.2 < playerBox.x + playerBox.width &&
            item.y + item.height > playerBox.y &&
            item.y < playerBox.y + playerBox.height;

          if (collides) {
            if (item.category === 'tool') {
              // CATCH TOOL SUCCESS!
              s.toolsCaught += 1;
              s.combo += 1;
              if (s.combo > s.maxCombo) s.maxCombo = s.combo;

              // Calculate combo multiplier
              s.multiplier = Math.min(4.0, 1.0 + Math.floor(s.combo / 4) * 0.5);
              const earnedPoints = Math.round(item.points * s.multiplier);
              s.score += earnedPoints;

              // Special: Golden Wrench
              if (item.type === 'gold-wrench') {
                s.player.hasShield = true;
                s.player.shieldDuration = 6.0; // 6 seconds shield
                soundEngine.playGoldTool();
                s.floatingTexts.push({
                  id: Math.random().toString(),
                  text: `OVERDRIVE SHIELD! +${earnedPoints}`,
                  x: item.x,
                  y: item.y - 10,
                  color: '#facc15',
                  opacity: 1,
                  scale: 1.2,
                });
              } else {
                soundEngine.playCatchTool(s.multiplier);
                s.floatingTexts.push({
                  id: Math.random().toString(),
                  text: `+${earnedPoints}${s.combo > 3 ? ` (${s.multiplier.toFixed(1)}x)` : ''}`,
                  x: item.x,
                  y: item.y,
                  color: item.color,
                  opacity: 1,
                  scale: 1.0,
                });
              }

              // Check Objective
              if (s.activeObjective && s.activeObjective.targetTool === item.type) {
                s.activeObjective.collected += 1;
                if (s.activeObjective.collected >= s.activeObjective.required) {
                  // Objective Completed!
                  soundEngine.playObjectiveComplete();
                  s.score += s.activeObjective.bonusPoints;
                  s.floatingTexts.push({
                    id: Math.random().toString(),
                    text: `OBJECTIVE REPAIR COMPLETE! +${s.activeObjective.bonusPoints}`,
                    x: s.width / 2 - 120,
                    y: s.height / 2,
                    color: '#34d399',
                    opacity: 1,
                    scale: 1.3,
                  });
                  spawnNewObjective();
                }
              }

              // Sparks particles
              for (let i = 0; i < 14; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 40 + Math.random() * 160;
                s.particles.push({
                  id: Math.random().toString(),
                  x: item.x + item.width / 2,
                  y: item.y + item.height / 2,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed - 50,
                  color: item.color,
                  size: 2 + Math.random() * 3,
                  life: 0.5,
                  maxLife: 0.5,
                });
              }
            } else {
              // HAZARD COLLISION
              if (s.player.hasShield) {
                // Deflected by shield
                soundEngine.playUI();
                s.floatingTexts.push({
                  id: Math.random().toString(),
                  text: `HAZARD DEFLECTED!`,
                  x: item.x,
                  y: item.y,
                  color: '#38bdf8',
                  opacity: 1,
                  scale: 1.1,
                });
                for (let i = 0; i < 16; i++) {
                  s.particles.push({
                    id: Math.random().toString(),
                    x: item.x + item.width / 2,
                    y: item.y + item.height / 2,
                    vx: (Math.random() - 0.5) * 200,
                    vy: (Math.random() - 0.5) * 200,
                    color: '#38bdf8',
                    size: 3,
                    life: 0.4,
                    maxLife: 0.4,
                  });
                }
              } else {
                // TAKES DAMAGE
                s.lives -= 1;
                s.combo = 0;
                s.multiplier = 1.0;
                s.hazardsHit += 1;
                s.screenShake = 12;
                s.player.lastHitTime = currentTime;
                soundEngine.playHazardHit();

                s.floatingTexts.push({
                  id: Math.random().toString(),
                  text: `-1 INTEGRITY!`,
                  x: item.x,
                  y: item.y,
                  color: '#ef4444',
                  opacity: 1,
                  scale: 1.3,
                });

                // Violent spark burst
                for (let i = 0; i < 24; i++) {
                  s.particles.push({
                    id: Math.random().toString(),
                    x: item.x + item.width / 2,
                    y: item.y + item.height / 2,
                    vx: (Math.random() - 0.5) * 320,
                    vy: (Math.random() - 0.5) * 320,
                    color: '#ef4444',
                    size: 3 + Math.random() * 4,
                    life: 0.6,
                    maxLife: 0.6,
                  });
                }

                if (s.lives <= 0) {
                  s.status = 'GAMEOVER';
                  setStatus('GAMEOVER');
                }
              }
            }
          } else if (item.y > s.height + 40) {
            // Passed bottom
            if (item.category === 'hazard') {
              s.hazardsAvoided += 1;
            }
          } else {
            remainingItems.push(item);
          }
        }
        s.items = remainingItems;

        // Update Particles
        const aliveParticles: Particle[] = [];
        for (const p of s.particles) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 120 * dt; // gravity
          p.life -= dt;
          if (p.life > 0) aliveParticles.push(p);
        }
        s.particles = aliveParticles;

        // Update Floating Texts
        const aliveTexts: FloatingText[] = [];
        for (const ft of s.floatingTexts) {
          ft.y -= 45 * dt;
          ft.opacity -= 1.2 * dt;
          if (ft.opacity > 0) aliveTexts.push(ft);
        }
        s.floatingTexts = aliveTexts;

        // Periodically sync stats for HUD
        syncStats();
      }

      // 2. RENDER LOGIC
      ctx.save();

      // Screen Shake offset
      if (s.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * s.screenShake;
        const shakeY = (Math.random() - 0.5) * s.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // Background Cyber Workshop
      ctx.fillStyle = '#030712'; // dark slate
      ctx.fillRect(0, 0, s.width, s.height);

      // Subtle Cyber Grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < s.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, s.height);
        ctx.stroke();
      }
      for (let y = 0; y < s.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(s.width, y);
        ctx.stroke();
      }

      // Laser boundary line at bottom
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(0, s.player.y + s.player.height + 14);
      ctx.lineTo(s.width, s.player.y + s.player.height + 14);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Falling Items
      for (const item of s.items) {
        ctx.save();
        ctx.translate(item.x + item.width / 2, item.y + item.height / 2);
        ctx.rotate(item.rotation);

        // Glow Aura
        ctx.shadowColor = item.glowColor;
        ctx.shadowBlur = item.category === 'hazard' ? 14 : 10;

        if (item.category === 'tool') {
          // TOOL ICON DRAWING
          ctx.fillStyle = item.color;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;

          if (item.type === 'wrench' || item.type === 'gold-wrench') {
            // Wrench vector shape
            ctx.beginPath();
            ctx.arc(0, -10, 8, 0.8, Math.PI - 0.8, false);
            ctx.lineTo(-4, 12);
            ctx.arc(0, 12, 5, Math.PI, 0, false);
            ctx.lineTo(4, -10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          } else if (item.type === 'duct-tape') {
            // Circular roll of tape
            ctx.beginPath();
            ctx.arc(0, 0, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          } else if (item.type === 'screwdriver') {
            // Precision screwdriver
            ctx.fillStyle = item.color;
            ctx.fillRect(-4, -14, 8, 12); // handle
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(-2, -2, 4, 16); // shaft
            ctx.strokeRect(-2, -2, 4, 16);
          } else if (item.type === 'hydraulic-jack') {
            // Jack pyramid shape
            ctx.beginPath();
            ctx.moveTo(0, -14);
            ctx.lineTo(-12, 12);
            ctx.lineTo(12, 12);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          } else {
            // Multimeter box with screen
            ctx.fillRect(-11, -13, 22, 26);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-8, -10, 16, 9);
            ctx.strokeRect(-11, -13, 22, 26);
          }
        } else {
          // HAZARD DRAWING
          ctx.fillStyle = item.color;
          ctx.strokeStyle = '#fca5a5';
          ctx.lineWidth = 1.5;

          if (item.type === 'spark') {
            // Lightning Bolt
            ctx.beginPath();
            ctx.moveTo(2, -14);
            ctx.lineTo(-8, 0);
            ctx.lineTo(-1, 0);
            ctx.lineTo(-5, 14);
            ctx.lineTo(9, -2);
            ctx.lineTo(2, -2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          } else if (item.type === 'fire') {
            // Flame tongue
            ctx.beginPath();
            ctx.moveTo(0, -14);
            ctx.quadraticCurveTo(12, 0, 8, 12);
            ctx.quadraticCurveTo(0, 14, -8, 12);
            ctx.quadraticCurveTo(-12, 0, 0, -14);
            ctx.fill();
            ctx.stroke();
          } else if (item.type === 'smoke') {
            // Swirling smoke puff
            ctx.beginPath();
            ctx.arc(-4, 0, 9, 0, Math.PI * 2);
            ctx.arc(4, -3, 8, 0, Math.PI * 2);
            ctx.arc(2, 6, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          } else {
            // Oil slick drop
            ctx.beginPath();
            ctx.arc(0, 4, 10, 0, Math.PI);
            ctx.lineTo(0, -12);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        }

        ctx.restore();
      }

      // Draw Player Repair Basket / Mechanic Magnet Tray
      const p = s.player;
      ctx.save();

      // Thruster Exhaust Flames under player tray
      const isBoosting = s.keys.boost;
      ctx.fillStyle = isBoosting ? '#f59e0b' : '#06b6d4';
      ctx.shadowColor = isBoosting ? 'rgba(245, 158, 11, 0.9)' : 'rgba(6, 182, 212, 0.8)';
      ctx.shadowBlur = 12;

      const thrusterLeftX = p.x + 18;
      const thrusterRightX = p.x + p.width - 18;
      const flameHeight = isBoosting ? 18 + Math.random() * 8 : 8 + Math.random() * 4;

      // Left thruster
      ctx.beginPath();
      ctx.moveTo(thrusterLeftX - 6, p.y + p.height);
      ctx.lineTo(thrusterLeftX, p.y + p.height + flameHeight);
      ctx.lineTo(thrusterLeftX + 6, p.y + p.height);
      ctx.fill();

      // Right thruster
      ctx.beginPath();
      ctx.moveTo(thrusterRightX - 6, p.y + p.height);
      ctx.lineTo(thrusterRightX, p.y + p.height + flameHeight);
      ctx.lineTo(thrusterRightX + 6, p.y + p.height);
      ctx.fill();

      // Shield Bubble (if active)
      if (p.hasShield) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.ellipse(p.x + p.width / 2, p.y + p.height / 2, p.width / 2 + 14, 28, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Damage Flash
      const isRecentlyHit = currentTime - p.lastHitTime < 250;
      ctx.fillStyle = isRecentlyHit ? '#ef4444' : '#0f172a';
      ctx.strokeStyle = isRecentlyHit ? '#f87171' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.shadowColor = isRecentlyHit ? '#ef4444' : '#06b6d4';
      ctx.shadowBlur = 16;

      // Titanium Chassis
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.width, p.height, [8, 8, 4, 4]);
      ctx.fill();
      ctx.stroke();

      // Top Magnetic Catch Bar
      ctx.fillStyle = isRecentlyHit ? '#fca5a5' : '#38bdf8';
      ctx.fillRect(p.x + 6, p.y + 2, p.width - 12, 4);

      // Mechanic Status Lights
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x + 12, p.y + p.height - 7, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(p.x + p.width - 12, p.y + p.height - 7, 3, 0, Math.PI * 2);
      ctx.fill();

      // Center Brand Badge
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('YOUFIX REPAIR', p.x + p.width / 2, p.y + 14);

      ctx.restore();

      // Draw Particles
      for (const pt of s.particles) {
        ctx.save();
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Floating Points & Combo Texts
      for (const ft of s.floatingTexts) {
        ctx.save();
        ctx.font = `bold ${Math.round(14 * ft.scale)}px monospace`;
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = ft.opacity;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [syncStats, spawnNewObjective]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none"
    >
      {/* Heads-Up Display */}
      <div className="w-full mb-3">
        <HUD
          stats={stats}
          isMuted={isMuted}
          isPaused={status === 'PAUSED'}
          onToggleMute={handleToggleMute}
          onTogglePause={handleTogglePause}
          onOpenHelp={() => setShowInstructions(true)}
        />
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative w-full aspect-[4/3] max-h-[72vh] rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onPointerMove={handlePointerMove}
          className="w-full h-full block cursor-crosshair touch-none"
        />

        {/* In-Game Overlay Controls for Mobile / Touch Screens */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none sm:hidden">
          <div className="flex gap-2 pointer-events-auto">
            <button
              onPointerDown={() => { gameStateRef.current.touchSteer = -1; }}
              onPointerUp={() => { gameStateRef.current.touchSteer = 0; }}
              onPointerLeave={() => { gameStateRef.current.touchSteer = 0; }}
              className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/40 text-cyan-400 active:bg-cyan-500 active:text-slate-950 shadow-neon-cyan"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onPointerDown={() => { gameStateRef.current.touchSteer = 1; }}
              onPointerUp={() => { gameStateRef.current.touchSteer = 0; }}
              onPointerLeave={() => { gameStateRef.current.touchSteer = 0; }}
              className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/40 text-cyan-400 active:bg-cyan-500 active:text-slate-950 shadow-neon-cyan"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          <div className="pointer-events-auto">
            <button
              onPointerDown={() => { gameStateRef.current.keys.boost = true; }}
              onPointerUp={() => { gameStateRef.current.keys.boost = false; }}
              onPointerLeave={() => { gameStateRef.current.keys.boost = false; }}
              className="px-5 py-4 rounded-xl bg-amber-500/80 border border-amber-400 text-slate-950 font-bold active:bg-amber-400 flex items-center gap-1 shadow-neon-amber"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>BOOST</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="w-full mt-2.5 flex items-center justify-between text-xs font-mono text-slate-400 px-2">
        <div>
          Steer: <span className="text-cyan-400">[A / D]</span> or <span className="text-cyan-400">[← / →]</span> or <span className="text-cyan-400">Mouse Drag</span>
        </div>
        <div>
          Overdrive Boost: <span className="text-amber-400">[Spacebar]</span>
        </div>
        <div>
          Pause: <span className="text-slate-300">[P]</span>
        </div>
      </div>

      {/* Paused Overlay Modal */}
      {status === 'PAUSED' && (
        <PauseModal
          score={stats.score}
          isMuted={isMuted}
          onResume={handleTogglePause}
          onRestart={restartGame}
          onHome={onReturnHome}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Game Over Modal */}
      {status === 'GAMEOVER' && (
        <GameOverModal
          stats={stats}
          onRestart={restartGame}
          onHome={onReturnHome}
        />
      )}

      {/* Instructions / Field Manual Modal */}
      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}
    </div>
  );
};
