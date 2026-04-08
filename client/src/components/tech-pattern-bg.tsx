"use client";

import { motion } from "framer-motion";

interface TechPatternBgProps {
  variant?: "circuit" | "radar" | "matrix" | "pulse";
  className?: string;
}

export function TechPatternBg({ variant = "circuit", className = "" }: TechPatternBgProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {variant === "circuit" && <CircuitPattern />}
      {variant === "radar" && <RadarPattern />}
      {variant === "matrix" && <MatrixPattern />}
      {variant === "pulse" && <PulsePattern />}
    </div>
  );
}

function CircuitPattern() {
  return (
    <>
      {/* Circuit board traces - complex interconnected lines */}
      <svg className="absolute top-0 right-0 w-96 h-96 opacity-[0.06] dark:opacity-[0.1]" viewBox="0 0 300 300">
        {/* Horizontal traces */}
        <path d="M0 50 H80 L100 70 H200 L220 50 H300" fill="none" className="stroke-teal-500" strokeWidth="2"/>
        <path d="M0 120 H60 L80 100 H150 L170 120 H250 L270 100 H300" fill="none" className="stroke-cyan-500" strokeWidth="1.5"/>
        <path d="M0 200 H40 L60 180 H120 L140 200 H180 L200 180 H300" fill="none" className="stroke-teal-400" strokeWidth="1"/>
        {/* Vertical traces */}
        <path d="M80 0 V40 L100 60 V150 L80 170 V300" fill="none" className="stroke-cyan-400" strokeWidth="1.5"/>
        <path d="M200 0 V80 L180 100 V200 L200 220 V300" fill="none" className="stroke-teal-500" strokeWidth="1"/>
        {/* Connection nodes */}
        <circle cx="80" cy="50" r="6" className="fill-teal-500"/>
        <circle cx="100" cy="70" r="4" className="fill-cyan-400"/>
        <circle cx="200" cy="50" r="5" className="fill-teal-400"/>
        <circle cx="150" cy="120" r="4" className="fill-cyan-500"/>
        <circle cx="80" cy="170" r="5" className="fill-teal-500"/>
        <circle cx="180" cy="100" r="4" className="fill-cyan-400"/>
        {/* IC chip representation */}
        <rect x="130" y="140" width="40" height="30" rx="2" fill="none" className="stroke-teal-500" strokeWidth="2"/>
        <line x1="130" y1="150" x2="110" y2="150" className="stroke-teal-400" strokeWidth="1"/>
        <line x1="130" y1="160" x2="115" y2="160" className="stroke-teal-400" strokeWidth="1"/>
        <line x1="170" y1="150" x2="190" y2="150" className="stroke-teal-400" strokeWidth="1"/>
        <line x1="170" y1="160" x2="185" y2="160" className="stroke-teal-400" strokeWidth="1"/>
      </svg>

      {/* Floating microchip - bottom left */}
      <motion.svg 
        className="absolute bottom-20 left-10 w-40 h-40 opacity-[0.05] dark:opacity-[0.08]"
        viewBox="0 0 100 100"
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="25" y="25" width="50" height="50" rx="4" fill="none" className="stroke-teal-500" strokeWidth="2"/>
        {/* Pins */}
        {[30, 40, 50, 60, 70].map(x => (
          <line key={`top-${x}`} x1={x} y1="25" x2={x} y2="10" className="stroke-cyan-400" strokeWidth="2"/>
        ))}
        {[30, 40, 50, 60, 70].map(x => (
          <line key={`bot-${x}`} x1={x} y1="75" x2={x} y2="90" className="stroke-cyan-400" strokeWidth="2"/>
        ))}
        {[30, 40, 50, 60, 70].map(y => (
          <line key={`left-${y}`} x1="25" y1={y} x2="10" y2={y} className="stroke-teal-400" strokeWidth="2"/>
        ))}
        {[30, 40, 50, 60, 70].map(y => (
          <line key={`right-${y}`} x1="75" y1={y} x2="90" y2={y} className="stroke-teal-400" strokeWidth="2"/>
        ))}
        <circle cx="50" cy="50" r="8" className="fill-teal-500/30"/>
      </motion.svg>

      {/* Pulsing data nodes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-teal-400/50"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-cyan-400/40"
        animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />

      {/* Gradient backdrop */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-100/30 dark:bg-teal-900/20 rounded-full blur-3xl"/>
    </>
  );
}

function RadarPattern() {
  return (
    <>
      {/* Radar sweep with concentric circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg className="w-[500px] h-[500px] opacity-[0.08] dark:opacity-[0.12]" viewBox="0 0 400 400">
          {/* Concentric circles */}
          <circle cx="200" cy="200" r="50" fill="none" className="stroke-teal-400" strokeWidth="1"/>
          <circle cx="200" cy="200" r="100" fill="none" className="stroke-teal-500" strokeWidth="1"/>
          <circle cx="200" cy="200" r="150" fill="none" className="stroke-cyan-400" strokeWidth="1"/>
          <circle cx="200" cy="200" r="200" fill="none" className="stroke-teal-400" strokeWidth="0.5"/>
          {/* Cross lines */}
          <line x1="0" y1="200" x2="400" y2="200" className="stroke-teal-400/50" strokeWidth="0.5"/>
          <line x1="200" y1="0" x2="200" y2="400" className="stroke-teal-400/50" strokeWidth="0.5"/>
          <line x1="50" y1="50" x2="350" y2="350" className="stroke-cyan-400/30" strokeWidth="0.5"/>
          <line x1="350" y1="50" x2="50" y2="350" className="stroke-cyan-400/30" strokeWidth="0.5"/>
        </svg>
        
        {/* Animated sweep line */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[250px] h-[2px] origin-left"
          style={{ background: "linear-gradient(90deg, rgba(20,184,166,0.6) 0%, transparent 100%)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Detected threat blips */}
      <motion.div
        className="absolute top-[35%] left-[55%] w-3 h-3 rounded-full bg-red-500"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-[45%] left-[35%] w-2 h-2 rounded-full bg-yellow-500"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute top-[60%] left-[60%] w-2 h-2 rounded-full bg-green-500"
        animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />

      {/* Scanning wave expanding outward */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-teal-400/30"
        animate={{ width: [0, 400], height: [0, 400], opacity: [0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Corner scan lines */}
      <svg className="absolute top-0 left-0 w-32 h-32 opacity-[0.1]" viewBox="0 0 100 100">
        <path d="M0 30 L30 30 L30 0" fill="none" className="stroke-teal-500" strokeWidth="2"/>
        <circle cx="30" cy="30" r="4" className="fill-cyan-400"/>
      </svg>
      <svg className="absolute bottom-0 right-0 w-32 h-32 opacity-[0.1]" viewBox="0 0 100 100">
        <path d="M100 70 L70 70 L70 100" fill="none" className="stroke-teal-500" strokeWidth="2"/>
        <circle cx="70" cy="70" r="4" className="fill-cyan-400"/>
      </svg>
    </>
  );
}

function MatrixPattern() {
  const binaryStrings = [
    "01101001", "10110101", "01001101", "11010010", "00101101",
    "10011010", "01100110", "11001011", "00110100", "10101010"
  ];

  return (
    <>
      {/* Falling binary columns */}
      <div className="absolute inset-0">
        {[10, 25, 40, 55, 70, 85].map((left, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-500/10 dark:text-blue-400/15 font-mono text-xs tracking-widest"
            style={{ left: `${left}%`, top: 0 }}
            initial={{ y: -200 }}
            animate={{ y: ["0%", "100%"] }}
            transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear", delay: i * 0.8 }}
          >
            {binaryStrings.map((str, j) => (
              <div key={j} className="my-2">{str}</div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Encryption lock symbol */}
      <motion.svg 
        className="absolute top-20 right-20 w-24 h-24 opacity-[0.08] dark:opacity-[0.12]"
        viewBox="0 0 100 100"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="25" y="45" width="50" height="40" rx="4" className="fill-blue-500"/>
        <path d="M35 45 V30 C35 15 65 15 65 30 V45" fill="none" className="stroke-indigo-500" strokeWidth="6"/>
        <circle cx="50" cy="65" r="6" className="fill-white"/>
        <rect x="47" y="65" width="6" height="12" className="fill-white"/>
      </motion.svg>

      {/* Key symbols floating */}
      <motion.svg 
        className="absolute bottom-32 left-16 w-16 h-16 opacity-[0.06] dark:opacity-[0.1]"
        viewBox="0 0 100 100"
        animate={{ rotate: [0, 15, 0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="30" cy="30" r="20" fill="none" className="stroke-blue-400" strokeWidth="4"/>
        <rect x="45" y="25" width="45" height="10" rx="2" className="fill-indigo-400"/>
        <rect x="70" y="35" width="10" height="15" className="fill-indigo-400"/>
        <rect x="80" y="35" width="10" height="10" className="fill-indigo-400"/>
      </motion.svg>

      {/* Hash blocks */}
      <div className="absolute top-1/3 left-10 opacity-[0.05] dark:opacity-[0.08]">
        {[0, 1, 2].map(row => (
          <div key={row} className="flex gap-1 mb-1">
            {[0, 1, 2, 3, 4, 5].map(col => (
              <motion.div
                key={col}
                className="w-3 h-3 bg-blue-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: (row + col) * 0.1 }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Gradient backdrop */}
      <div className="absolute -top-20 right-0 w-[500px] h-[400px] bg-blue-100/20 dark:bg-blue-900/15 rounded-full blur-3xl"/>
      <div className="absolute -bottom-20 left-0 w-[400px] h-[300px] bg-indigo-100/20 dark:bg-indigo-900/15 rounded-full blur-3xl"/>
    </>
  );
}

function PulsePattern() {
  return (
    <>
      {/* Warning triangle pulse */}
      <motion.svg
        className="absolute top-20 right-20 w-32 h-32 opacity-[0.08] dark:opacity-[0.12]"
        viewBox="0 0 100 100"
        animate={{ scale: [1, 1.05, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <polygon points="50,10 90,85 10,85" fill="none" className="stroke-red-500" strokeWidth="3"/>
        <text x="50" y="65" textAnchor="middle" className="fill-red-500 text-3xl font-bold">!</text>
      </motion.svg>

      {/* EKG/heartbeat line */}
      <svg className="absolute top-1/3 left-0 w-full h-32 opacity-[0.06] dark:opacity-[0.1]" viewBox="0 0 1200 100" preserveAspectRatio="none">
        <motion.path
          d="M0 50 L200 50 L220 50 L230 20 L240 80 L250 30 L260 70 L270 50 L300 50 L500 50 L520 50 L530 10 L540 90 L550 20 L560 80 L570 50 L600 50 L800 50 L820 50 L830 25 L840 75 L850 35 L860 65 L870 50 L900 50 L1200 50"
          fill="none"
          className="stroke-red-500"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>

      {/* Expanding alert rings */}
      <div className="absolute bottom-1/3 left-1/4">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-red-500/30"
            style={{ width: 0, height: 0 }}
            animate={{ 
              width: [0, 150], 
              height: [0, 150], 
              opacity: [0.5, 0],
              x: [-75, -75],
              y: [-75, -75]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}
        <div className="w-4 h-4 rounded-full bg-red-500/50"/>
      </div>

      {/* Shield with crack */}
      <motion.svg
        className="absolute bottom-20 right-32 w-24 h-28 opacity-[0.06] dark:opacity-[0.1]"
        viewBox="0 0 80 100"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M40 5 L75 20 L75 50 C75 75 40 95 40 95 C40 95 5 75 5 50 L5 20 Z" 
          fill="none" className="stroke-orange-500" strokeWidth="3"/>
        <path d="M40 30 L45 45 L35 55 L42 70" fill="none" className="stroke-red-500" strokeWidth="2"/>
      </motion.svg>

      {/* Flashing dots */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-red-500"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-2/3 right-1/4 w-3 h-3 rounded-full bg-orange-500"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
      />
      <motion.div
        className="absolute bottom-1/4 left-2/3 w-2 h-2 rounded-full bg-red-400"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.6 }}
      />

      {/* Gradient orbs */}
      <div className="absolute -top-20 left-1/3 w-[500px] h-[300px] bg-red-900/10 rounded-full blur-3xl"/>
      <div className="absolute -bottom-20 right-1/4 w-[400px] h-[250px] bg-orange-900/10 rounded-full blur-3xl"/>
    </>
  );
}
