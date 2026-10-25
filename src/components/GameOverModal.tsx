'use client';

import React, { useEffect, useState } from 'react';
import { GameStats, HighScoreRecord } from '../types/game';
import { TIER_SETTINGS } from '../lib/constants';
import { RotateCcw, Home, Trophy, Award, Flame, Crosshair, ShieldCheck, AlertTriangle } from 'lucide-react';
import { soundEngine } from '../lib/audio';

interface GameOverModalProps {
  stats: GameStats;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onRestart,
  onHome,
}) => {
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [leaderboard, setLeaderboard] = useState<HighScoreRecord[]>([]);

  useEffect(() => {
    soundEngine.playGameOver();

    try {
      const totalAttempts = stats.toolsCaught + stats.hazardsHit;
      const accuracy = totalAttempts > 0 
        ? Math.round((stats.toolsCaught / totalAttempts) * 100) 
        : 100;

      const newRecord: HighScoreRecord = {
        score: stats.score,
        tier: stats.tier,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        accuracy,
        toolsCaught: stats.toolsCaught,
        maxCombo: stats.maxCombo,
      };

      const existingRecordStr = localStorage.getItem('youfix_high_score_record');
      const existingRecord: HighScoreRecord | null = existingRecordStr ? JSON.parse(existingRecordStr) : null;

      if (!existingRecord || stats.score > existingRecord.score) {
        setIsNewRecord(true);
        localStorage.setItem('youfix_high_score_record', JSON.stringify(newRecord));
      }

      // Maintain top 5 local leaderboard
      const boardStr = localStorage.getItem('youfix_leaderboard');
      let currentBoard: HighScoreRecord[] = boardStr ? JSON.parse(boardStr) : [];
      currentBoard.push(newRecord);
      currentBoard.sort((a, b) => b.score - a.score);
      currentBoard = currentBoard.slice(0, 5);

      localStorage.setItem('youfix_leaderboard', JSON.stringify(currentBoard));
      setLeaderboard(currentBoard);
    } catch {
      // safe fallback for storage
    }
  }, [stats]);

  const tierConfig = TIER_SETTINGS[stats.tier];
  const totalInteractions = stats.toolsCaught + stats.hazardsHit;
  const accuracyPercent = totalInteractions > 0 
    ? Math.round((stats.toolsCaught / totalInteractions) * 100) 
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/80 relative overflow-hidden text-white">
        
        {/* Top Warning Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 shadow-neon-rose" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-500/50 text-rose-400 text-xs font-mono tracking-widest uppercase mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Integrity Compromised • Shift Over</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight uppercase">
            Work Order Terminated
          </h2>

          {isNewRecord && (
            <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-sm font-bold shadow-neon-amber animate-bounce">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>NEW PERSONAL BEST RECORD!</span>
            </div>
          )}
        </div>

        {/* Score Display Card */}
        <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-5 text-center mb-6 shadow-inner-glow">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1">Final Workshop Score</div>
          <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
            {stats.score.toLocaleString()}
          </div>
          
          <div className="mt-2 inline-block px-3 py-0.5 rounded-full text-xs font-mono font-bold"
               style={{
                 color: tierConfig.color,
                 backgroundColor: `${tierConfig.color}20`,
                 border: `1px solid ${tierConfig.color}60`
               }}>
            Achieved: {tierConfig.badge} • {tierConfig.name}
          </div>
        </div>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-center">
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-center text-cyan-400 mb-1">
              <Crosshair className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold font-mono text-white">{stats.toolsCaught}</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Tools Caught</div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-center text-amber-400 mb-1">
              <Flame className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold font-mono text-white">{stats.maxCombo}x</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Max Combo</div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-center text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold font-mono text-white">{accuracyPercent}%</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Diagnostics</div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-center text-rose-400 mb-1">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold font-mono text-white">{stats.hazardsHit}</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Hazards Hit</div>
          </div>
        </div>

        {/* Top 3 Local Leaderboard Snapshot */}
        {leaderboard.length > 0 && (
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 mb-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase mb-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Trophy className="w-3.5 h-3.5" /> High Score Terminal
              </span>
              <span>Score / Rank</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              {leaderboard.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-300">
                    #{idx + 1} • {item.date}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{item.tier}</span>
                    <strong className="text-cyan-400 font-bold">{item.score.toLocaleString()}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              soundEngine.playGoldTool();
              onRestart();
            }}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black font-mono text-sm uppercase tracking-wider shadow-neon-cyan transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 stroke-[3]" />
            <span>Repair Again [Space]</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playUI();
              onHome();
            }}
            className="py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-cyan-300 hover:text-white font-mono text-sm font-bold uppercase transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Workshop Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
