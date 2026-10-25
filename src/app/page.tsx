'use client';

import React, { useState } from 'react';
import { HomeScreen } from '../components/HomeScreen';
import { ToolRushGame } from '../components/ToolRushGame';
import { InstructionsModal } from '../components/InstructionsModal';
import { Wrench, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export default function Home() {
  const [view, setView] = useState<'HOME' | 'GAME'>('HOME');
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  return (
    <main className="min-h-screen relative flex flex-col justify-between p-3 sm:p-6 bg-slate-950 overflow-hidden">
      {/* Dynamic Background Cyber Workshop Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[300px] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-amber-600/10 rounded-full blur-[100px]" />
        {/* Subtle Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
      </div>

      {/* Top Header Navbar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between py-2 border-b border-cyan-500/20 mb-3">
        <div 
          onClick={() => setView('HOME')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:shadow-neon-cyan group-hover:border-cyan-400 transition-all">
            <Wrench className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <div className="font-mono font-black tracking-tight text-white text-base sm:text-lg flex items-center gap-1">
              YOU<span className="text-cyan-400">FIX</span>
              <span className="text-xs px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
                RUSH
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 -mt-1 hidden sm:block">
              Emergency Diagnostic Systems
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SYS_ONLINE 60FPS</span>
          </div>

          <button
            onClick={() => setShowInstructions(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Field Docs</span>
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-auto">
        {view === 'HOME' ? (
          <HomeScreen
            onStartGame={() => setView('GAME')}
            onOpenHelp={() => setShowInstructions(true)}
          />
        ) : (
          <ToolRushGame
            onReturnHome={() => setView('HOME')}
          />
        )}
      </div>

      {/* Instructions / Manual Modal */}
      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 pt-3 mt-4 border-t border-slate-900 text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-cyan-500" />
          <span>YouFix Capstone Ecosystem • Built with Next.js 14, React & Tailwind CSS</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>Zero External Assets</span>
          <span>•</span>
          <span>Web Audio API Synthesizer</span>
          <span>•</span>
          <span className="text-cyan-400 font-semibold">Vercel Ready</span>
        </div>
      </footer>
    </main>
  );
}
