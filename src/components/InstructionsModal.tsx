'use client';

import React from 'react';
import { X, Wrench, ShieldAlert, Zap, Flame, Key, Compass, Award } from 'lucide-react';
import { TOOLS_CONFIG, HAZARDS_CONFIG, TIER_SETTINGS } from '../lib/constants';
import { soundEngine } from '../lib/audio';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/80 text-white max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black font-mono uppercase tracking-tight text-white">
                Mechanic Operating Manual
              </h3>
              <p className="text-xs font-mono text-cyan-400">YouFix Tool Rush • Standard Protocol</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playUI();
              onClose();
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-6 text-sm">
          {/* Mission Objective */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4" /> 01. Mission Directives
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              As the emergency frontline mechanic for YouFix, your duty is to salvage repair operations by steering the magnetic tool collector. Collect falling repair tools to satisfy work orders and prevent catastrophic workshop failure.
            </p>
          </div>

          {/* Controls */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
              <Key className="w-4 h-4" /> 02. Steering Controls
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-cyan-400 font-bold">[A / D] or [← / →]</span>
                <p className="text-slate-400 mt-1">Steer collector left & right with momentum.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-amber-400 font-bold">[Spacebar] Hold</span>
                <p className="text-slate-400 mt-1">Overdrive thrusters for 1.8x travel speed.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-emerald-400 font-bold">Mouse / Touch Drag</span>
                <p className="text-slate-400 mt-1">Direct magnetic tracking to pointer position.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-purple-400 font-bold">[P] or [ESC]</span>
                <p className="text-slate-400 mt-1">Pause current shift diagnostics.</p>
              </div>
            </div>
          </div>

          {/* Tool Intel */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-2">
              <Wrench className="w-4 h-4" /> 03. Repair Tool Catalog
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {Object.values(TOOLS_CONFIG).map((tool) => (
                <div key={tool.type} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{tool.label}</span>
                    <span className="text-cyan-400 font-bold">+{tool.points} pts</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hazards */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> 04. Hazardous Safety Violations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {Object.values(HAZARDS_CONFIG).map((haz) => (
                <div key={haz.type} className="p-2 rounded-lg bg-slate-950/60 border border-rose-950/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">{haz.label}</span>
                    <span className="text-rose-500 font-bold">-1 LIFE</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{haz.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Scaling */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
              <Flame className="w-4 h-4" /> 05. Progressive Difficulty Ranks
            </h4>
            <div className="space-y-1 text-xs font-mono">
              {Object.entries(TIER_SETTINGS).map(([key, tier]) => (
                <div key={key} className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800">
                  <span style={{ color: tier.color }} className="font-bold">
                    {tier.badge} • {tier.name}
                  </span>
                  <span className="text-slate-400">Score &gt; {tier.minScore}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundEngine.playUI();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold uppercase text-xs tracking-wider transition"
          >
            Acknowledge Directives
          </button>
        </div>
      </div>
    </div>
  );
};
