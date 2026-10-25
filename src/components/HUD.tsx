'use client';

import React from 'react';
import { GameStats } from '../types/game';
import { TIER_SETTINGS, TOOLS_CONFIG } from '../lib/constants';
import { Heart, Volume2, VolumeX, Pause, Play, HelpCircle, Flame, ShieldAlert, Award } from 'lucide-react';
import { soundEngine } from '../lib/audio';

interface HUDProps {
  stats: GameStats;
  isMuted: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onOpenHelp: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  isMuted,
  isPaused,
  onToggleMute,
  onTogglePause,
  onOpenHelp,
}) => {
  const tierConfig = TIER_SETTINGS[stats.tier];
  const targetToolConfig = stats.activeObjective 
    ? TOOLS_CONFIG[stats.activeObjective.targetTool] 
    : null;

  return (
    <div className="w-full select-none">
      {/* Top Main Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 rounded-xl px-4 py-2.5 shadow-neon-cyan">
        
        {/* Score & Multiplier */}
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-cyan-400/80">Workshop Score</div>
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">
              {stats.score.toLocaleString()}
            </div>
          </div>

          {/* Combo Multiplier Tag */}
          {stats.combo > 1 && (
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/50 rounded-lg px-2.5 py-1 animate-pulse">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="font-mono font-bold text-amber-300 text-sm">
                x{stats.multiplier.toFixed(1)} <span className="text-[10px] text-amber-200">({stats.combo} STREAK)</span>
              </span>
            </div>
          )}
        </div>

        {/* Tier & Lives */}
        <div className="flex items-center gap-5">
          {/* Diagnostic Tier Badge */}
          <div className="hidden sm:flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Diagnostic Rank</span>
            <span 
              className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border transition-colors shadow-sm"
              style={{
                borderColor: tierConfig.color,
                color: tierConfig.color,
                backgroundColor: `${tierConfig.color}15`,
                boxShadow: `0 0 10px ${tierConfig.color}40`,
              }}
            >
              {tierConfig.badge} • {tierConfig.name}
            </span>
          </div>

          {/* Lives (Health Cells) */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Integrity Cells</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {Array.from({ length: stats.maxLives }).map((_, i) => {
                const isActive = i < stats.lives;
                return (
                  <div
                    key={i}
                    className={`transition-all duration-300 transform ${
                      isActive 
                        ? 'scale-100 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' 
                        : 'scale-90 opacity-25'
                    }`}
                  >
                    <Heart 
                      className={`w-6 h-6 ${
                        isActive 
                          ? 'text-rose-500 fill-rose-500' 
                          : 'text-slate-600 fill-slate-700'
                      }`} 
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 border-l border-slate-700/60 pl-3">
            <button
              onClick={() => {
                soundEngine.playUI();
                onTogglePause();
              }}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 transition"
              title={isPaused ? "Resume Game (P)" : "Pause Game (P)"}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                soundEngine.playUI();
                onToggleMute();
              }}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 transition"
              title={isMuted ? "Unmute Sound (M)" : "Mute Sound (M)"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => {
                soundEngine.playUI();
                onOpenHelp();
              }}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 transition"
              title="Help & Manual"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Emergency Objective Banner */}
      {stats.activeObjective && targetToolConfig && (
        <div className="mt-2 bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 border border-amber-500/50 rounded-xl px-4 py-2 flex items-center justify-between shadow-neon-amber backdrop-blur-sm animate-pulse-slow">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40">
              <ShieldAlert className="w-5 h-5 text-amber-400 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">EMERGENCY REPAIR DIRECTIVE</span>
                <span className="text-xs bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded font-mono font-bold">
                  +{stats.activeObjective.bonusPoints} PTS
                </span>
              </div>
              <div className="text-sm font-semibold text-white">
                {stats.activeObjective.title} — Catch {targetToolConfig.label}s!
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-amber-300">
                {stats.activeObjective.collected} / {stats.activeObjective.required}
              </div>
              <div className="w-24 sm:w-32 bg-slate-800 rounded-full h-2 mt-1 border border-amber-500/30 overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#f59e0b]"
                  style={{
                    width: `${Math.min(100, (stats.activeObjective.collected / stats.activeObjective.required) * 100)}%`
                  }}
                />
              </div>
            </div>
            <Award className="w-5 h-5 text-amber-400 hidden sm:block" />
          </div>
        </div>
      )}
    </div>
  );
};
