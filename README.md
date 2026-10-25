# 🛠️ YouFix: Tool Rush

> **Gamified Emergency Workshop Diagnostics & Repair Simulation**  
> An interactive browser game built for the **YouFix Capstone Ecosystem**.

![YouFix Tool Rush](https://img.shields.io/badge/Platform-Web%20%2F%20Vercel-06b6d4?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Next.js%2014-React%2018%20%7C%20TailwindCSS%20%7C%20TypeScript-10b981?style=for-the-badge)
![Performance](https://img.shields.io/badge/60%20FPS-Web%20Audio%20Synthesizer-f59e0b?style=for-the-badge)

---

## 🚀 Project Vision & Purpose

**YouFix: Tool Rush** extends the **YouFix** brand into interactive entertainment by gamifying emergency workshop repairs. 

The game blends arcade action with rapid diagnostic problem-solving:
- **Core Directive**: Control the magnetic repair collector tray at the workshop floor. Catch vital falling repair tools while dodging dangerous electrical, thermal, and chemical hazards.
- **Progressive Difficulty**: Speeds, spawn frequencies, and hazard densities scale dynamically across 4 diagnostic tiers (*Apprentice*, *Technician*, *Master*, and *Cyber Specialist*).
- **Emergency Objectives**: Fulfill dynamic workshop repair directives (e.g. *"Hydraulic Cylinder Leak — Catch 3 Seal Tapes"*) to earn high-score multipliers.
- **Zero Asset Dependencies**: Uses a custom **Procedural Web Audio API Synthesizer** and crisp HTML5 Canvas vector rendering. Never fails to load, works 100% offline, and deploys instantly with zero missing asset errors.

---

## 🎮 Gameplay & Mechanics

### 1. Repair Tool Catalog (+Points & Combos)
| Tool | Base Points | Description & Ability |
| :--- | :---: | :--- |
| **Cyber Wrench** | `+10 pts` | Standard torque wrench. Essential for mechanical fastenings. |
| **Industrial Seal Tape** | `+15 pts` | Quick-patch adhesive for high-pressure fluid leaks. |
| **Precision Screwdriver** | `+20 pts` | Calibrated fastening for delicate cyberdeck components. |
| **Heavy Hydraulic Jack** | `+30 pts` | Heavy-duty lifter for undercarriage stabilization. |
| **Digital Multimeter** | `+40 pts` | High-voltage diagnostic measurement device. |
| **Overdrive Golden Wrench** | `+100 pts` | Rare prototype. **Grants 6s invulnerability shield & clears hazards!** |

### 2. Workshop Hazards (-1 Integrity Cell)
- **Electrical Arc Spark**: High-voltage electrical discharge.
- **Toxic Exhaust Fume**: Choking fumes that obscure visibility.
- **Thermal Flash Flame**: Runaway combustion blast.
- **Synthetic Oil Spill**: Destabilizes magnetic collector traction.

### 3. Steering & Controls
- **Desktop Keyboard**:
  - `[A]` / `[D]` or `[←]` / `[→]`: Steer magnetic collector left / right.
  - `[Spacebar]` *(Hold)*: Overdrive Thruster Boost (1.8x movement speed).
  - `[P]` or `[ESC]`: Pause / Resume shift.
  - `[M]`: Mute / Unmute procedural audio synthesizer.
- **Mouse & Pointer**:
  - Direct pointer tracking: Smoothly follows cursor across the workshop floor.
- **Mobile & Touch**:
  - Touch-drag directly on canvas.
  - Virtual on-screen touch steering arrows + instant Overdrive Boost button.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Library**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing, zero `any`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Cyber-workshop dark theme, frosted glass backdrop blur, neon glows)
- **Sound Engine**: Custom Web Audio API procedural synthesizer (zero audio files needed)
- **Rendering**: Optimized HTML5 2D Canvas with `requestAnimationFrame` loop (60 FPS locked, delta time physics)
- **Persistence**: `localStorage` telemetry & top-5 leaderboard tracking

---

## 📦 Directory Structure

```plaintext
YouFix Tool Rush/
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind cyber theme & custom animations
│   │   ├── layout.tsx          # App Router root layout & SEO metadata
│   │   └── page.tsx            # View state coordinator (Home <-> Game)
│   ├── components/
│   │   ├── ToolRushGame.tsx    # Master 60FPS canvas game engine & loop
│   │   ├── HomeScreen.tsx      # Cyberpunk hero card & game start screen
│   │   ├── HUD.tsx             # Heads-Up Display (Score, Combo, Lives, Tier)
│   │   ├── GameOverModal.tsx   # Shift telemetry, accuracy, and leaderboard
│   │   ├── PauseModal.tsx      # Diagnostic pause overlay
│   │   └── InstructionsModal.tsx # Full field manual & tool catalog
│   ├── lib/
│   │   ├── audio.ts            # Procedural Web Audio API sound synthesizer
│   │   └── constants.ts        # Tool/hazard configs, tiers, and objectives
│   └── types/
│       └── game.ts             # TypeScript interfaces and data models
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── README.md
```

---

## 🚀 Running Locally

Ensure you have **Node.js** (v18.17+ or v20+) installed on your machine.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. **Open the Game in Your Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deploy to Vercel (1-Click Ready)

This codebase is configured for instant, zero-configuration deployment to [Vercel](https://vercel.com):

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial YouFix: Tool Rush release"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Import the project in your [Vercel Dashboard](https://vercel.com/new).
3. Click **Deploy** — Vercel will automatically detect Next.js and build it into a global edge deployment.

---

## 🏆 Capstone Showcase Highlights

- **Brand Integration**: Deeply aligns with the YouFix ethos of mechanical precision, safety adherence, and fast problem resolution.
- **Production Polish**: Neon glow visual aesthetics, particle spark physics, screen shake impact, retro audio cues, and mobile responsiveness.
- **Zero Latency**: Procedural audio synthesizer generates sound waves on-the-fly with 0ms network latency.

*Built with precision for the YouFix project ecosystem.*
