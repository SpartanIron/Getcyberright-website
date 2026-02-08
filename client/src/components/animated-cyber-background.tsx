import { motion } from "framer-motion";

export function AnimatedCyberBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"></div>
      
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            x: [0, 100, 50, 0],
            y: [0, 50, 100, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-20%", left: "-10%" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-teal-500/15 blur-3xl"
          animate={{
            x: [0, -80, -40, 0],
            y: [0, 80, 40, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "30%", right: "-15%" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -60, 30, 0],
            scale: [1, 1.3, 0.85, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "-10%", left: "30%" }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-b from-cyan-400/40 to-transparent"
            style={{
              left: `${8 + i * 8}%`,
              width: "1px",
              height: "100%",
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scaleY: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
      }}>
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundPosition: ["0px 0px", "50px 50px"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="2" fill="rgba(6, 182, 212, 0.4)" />
            <circle cx="0" cy="50" r="1.5" fill="rgba(6, 182, 212, 0.3)" />
            <circle cx="100" cy="50" r="1.5" fill="rgba(6, 182, 212, 0.3)" />
            <circle cx="50" cy="0" r="1.5" fill="rgba(6, 182, 212, 0.3)" />
            <circle cx="50" cy="100" r="1.5" fill="rgba(6, 182, 212, 0.3)" />
            <path d="M50 50 L100 50" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.5" />
            <path d="M50 50 L0 50" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.5" />
            <path d="M50 50 L50 0" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.5" />
            <path d="M50 50 L50 100" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  );
}

export function AnimatedAIBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950"></div>
      
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/15 blur-3xl"
          animate={{
            x: [0, 80, 40, 0],
            y: [0, -60, 80, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-15%", right: "10%" }}
        />
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full bg-pink-500/10 blur-3xl"
          animate={{
            x: [0, -50, 50, 0],
            y: [0, 70, -30, 0],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "0%", left: "-10%" }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 12}%`,
              top: "50%",
            }}
          >
            {[...Array(5)].map((_, j) => (
              <motion.div
                key={j}
                className="absolute w-2 h-2 bg-purple-400/40 rounded-full"
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: j * 0.2 + i * 0.1,
                  ease: "easeInOut",
                }}
                style={{ left: j * 20, top: Math.sin(j) * 30 }}
              />
            ))}
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  );
}

export function AnimatedTechBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900"></div>
      
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-[550px] h-[550px] rounded-full bg-emerald-500/12 blur-3xl"
          animate={{
            x: [0, -70, 30, 0],
            y: [0, 40, -50, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "10%", left: "-5%" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-3xl"
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -80, 40, 0],
            scale: [1, 0.9, 1.2, 1],
          }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "-5%", right: "5%" }}
        />
      </div>

      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexagons" width="50" height="43.3" patternUnits="userSpaceOnUse">
            <polygon 
              points="25,0 50,12.5 50,37.5 25,50 0,37.5 0,12.5" 
              fill="none" 
              stroke="rgba(16, 185, 129, 0.3)" 
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  );
}
