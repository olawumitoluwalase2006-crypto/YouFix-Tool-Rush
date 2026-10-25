'use client';

import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../lib/audio';

interface PauseModalProps {
  score: number;
  isMuted: boolean;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  score,
  isMuted,
  onResume,
  onRestart,
  onHome,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl shadow-cyan-950/80 text-white text-center">
        <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-1">Diagnostics Paused</div>
        <h2 className="text-3xl font-black font-mono tracking-tight uppercase mb-4 text-white">
          Work Order on Hold
        </h2>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-6">
          <span className="text-xs font-mono text-slate-400">Current Score: </span>
          <strong className="text-2xl font-mono text-cyan-300 font-bold ml-1">{score.toLocaleString()}</strong>
        </div>

        <div className="flex flex-col gap-3 font-mono">
          <button
            onClick={() => {
              soundEngine.playUI();
              onResume();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black uppercase tracking-wider shadow-neon-cyan flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Resume Work Order [P]</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playUI();
              onRestart();
            }}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 hover:text-white font-bold uppercase flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Shift</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                soundEngine.playUI();
                onToggleMute();
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center justify-center gap-2"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'Audio: Muted' : 'Audio: Active'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playUI();
                onHome();
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Workshop Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
