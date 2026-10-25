'use client';

import React, { useEffect, useState } from 'react';
import { Play, Wrench, ShieldAlert, Zap, Flame, Award, Crosshair, ArrowRight, Volume2, Sparkles } from 'lucide-react';
import { TOOLS_CONFIG, HAZARDS_CONFIG } from '../lib/constants';
import { HighScoreRecord } from '../types/game';
import { soundEngine } from '../lib/audio';

interface HomeScreenProps {
  onStartGame: () => void;
  onOpenHelp: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, onOpenHelp }) => {
  const [highScore, setHighScore] = useState<HighScoreRecord | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('youfix_high_score_record');
      if (saved) {
        setHighScore(JSON.parse(saved));
      }
    } catch {
      // safe fallback
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4 sm:p-6 text-white animate-fadeIn">
      {/* Brand Header & Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4 shadow-neon-cyan">
        <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
        <span>YouFix Brand Ecosystem • Capstone Interactive Release</span>
      </div>

      {/* Main Hero Card */}
      <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-cyan-950/50 relative overflow-hidden">
        {/* Cyber Neon Accents */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-500" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white mb-2 uppercase drop-shadow-[0_0_25px_rgba(6,182,212,0.8)]">
            You<span className="text-cyan-400">Fix</span>: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-amber-400">Tool Rush</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            Gamifying emergency workshop repairs. Test your reaction speed, precision diagnostics, and hazard avoidance under extreme pressure. Catch vital repair tools to restore failing systems while dodging lethal electrical sparks and toxic thermal leaks.
          </p>

          {/* High Score Preview Banner (If exists) */}
          {highScore && (
            <div className="mb-6 inline-flex items-center gap-4 px-5 py-2.5 rounded-xl bg-slate-950/90 border border-amber-500/40 text-amber-300 font-mono text-sm shadow-neon-amber">
              <Award className="w-5 h-5 text-amber-400" />
              <span>RECORD SCORE: <strong className="text-white text-base">{highScore.score.toLocaleString()}</strong></span>
              <span className="text-xs text-amber-400/80">({highScore.tier} • {highScore.accuracy}% ACCURACY)</span>
            </div>
          )}

          {/* Big Glowing Start Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={() => {
                soundEngine.playGoldTool();
                onStartGame();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black font-mono text-lg uppercase tracking-wider shadow-neon-cyan hover:shadow-[0_0_35px_rgba(6,182,212,0.9)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 group"
            >
              <Play className="w-6 h-6 fill-slate-950 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>Start Tool Rush</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                soundEngine.playUI();
                onOpenHelp();
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-cyan-300 hover:text-white font-mono text-sm font-bold uppercase transition flex items-center justify-center gap-2"
            >
              <Crosshair className="w-4 h-4" />
              <span>Field Manual</span>
            </button>
          </div>
        </div>

        {/* Workshop Quick Intel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-6">
          {/* Collect Section */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-cyan-500/20">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>Essential Repair Tools (+Points)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {Object.values(TOOLS_CONFIG).slice(0, 4).map((tool) => (
                <div key={tool.type} className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-200">{tool.label}</span>
                  <span className="text-cyan-400 font-bold">+{tool.points}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-amber-300 font-mono flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Catching Golden Wrench grants +100 PTS and shield aura!</span>
            </div>
          </div>

          {/* Hazards Section */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-rose-500/20">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Lethal Safety Hazards (-1 Life)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {Object.values(HAZARDS_CONFIG).map((haz) => (
                <div key={haz.type} className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-300">{haz.label}</span>
                  <span className="text-rose-400 font-bold">-1 LIFE</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-rose-300/80 font-mono flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Dodging hazards maintains your combo multiplier streak.</span>
            </div>
          </div>
        </div>

        {/* Controls Info Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-4">
            <span>Controls: <strong className="text-cyan-300">[A / D]</strong> or <strong className="text-cyan-300">[Arrows]</strong> or <strong className="text-cyan-300">Mouse Drag</strong></span>
            <span>Boost: <strong className="text-amber-300">[Spacebar]</strong></span>
          </div>
          <div className="text-slate-500">
            YouFix Capstone • Vercel Ready • 60 FPS Engine
          </div>
        </div>
      </div>
    </div>
  );
};
