import React from "react";
import { CheckCircle } from "lucide-react";

export function ModernCyber() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-8 font-sans">
      {/* Certificate Container */}
      <div className="relative w-full max-w-5xl aspect-[1.414/1] bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden group">
        
        {/* Decorative Tech Background Elements */}
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        {/* Glowing Orbs */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

        {/* Accent Borders */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-500" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500" />
        <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-cyan-500 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-transparent to-emerald-500" />

        {/* Circuit Board Accents */}
        <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-cyan-500/30" />
        <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-emerald-500/30" />
        
        <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-slate-700/50" />
        <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-slate-700/50" />

        {/* Main Content Layout */}
        <div className="relative z-10 flex flex-col h-full p-16">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-16">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <img src="/__mockup/images/lock-logo.png" alt="GetCyberRight" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wider text-white">GET<span className="text-cyan-400">CYBER</span>RIGHT</h1>
                <p className="text-slate-400 text-sm uppercase tracking-[0.2em]">Cybersecurity Education</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium tracking-wide">
                <CheckCircle className="w-4 h-4" />
                VERIFIED CREDENTIAL
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col justify-center max-w-3xl">
            <p className="text-slate-400 uppercase tracking-widest text-sm mb-4 font-semibold">Certificate of Completion</p>
            <p className="text-slate-300 text-lg mb-2">This acknowledges that</p>
            
            {/* Name */}
            <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 tracking-tight">
              Sarah Mitchell
            </h2>
            
            <p className="text-slate-300 text-lg mb-4">has successfully completed the certification requirements for</p>
            
            {/* Course Name */}
            <h3 className="text-3xl font-bold text-cyan-400 mb-8 inline-block relative">
              Cyber Safety Fundamentals
              <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
            </h3>
          </div>

          {/* Footer */}
          <div className="mt-auto grid grid-cols-3 gap-8 items-end border-t border-slate-800 pt-8">
            
            {/* Date & ID */}
            <div className="col-span-1 space-y-4">
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Date of Issue</p>
                <p className="text-slate-200 font-mono text-sm">April 9, 2026</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Certificate ID</p>
                <p className="text-slate-200 font-mono text-sm text-emerald-400/90">GCR-2026-04-0847</p>
              </div>
            </div>

            {/* Seal */}
            <div className="col-span-1 flex justify-center pb-4">
              <div className="w-24 h-24 rounded-full border border-slate-700 bg-slate-800/50 flex items-center justify-center relative backdrop-blur-sm group-hover:border-cyan-500/50 transition-colors duration-700">
                <div className="absolute inset-2 rounded-full border border-dashed border-slate-600 animate-[spin_60s_linear_infinite]" />
                <img src="/__mockup/images/lock-logo.png" alt="GCR Seal" className="w-12 h-12 object-contain" />
              </div>
            </div>

            {/* Signature */}
            <div className="col-span-1 text-right">
              <div className="inline-block text-left">
                <div className="mb-2 w-48 h-12 flex items-end">
                  {/* Mock Signature using a cursive-like font or just styled text */}
                  <span className="text-3xl text-slate-300 font-serif italic tracking-wider opacity-80" style={{ fontFamily: '"Playfair Display", serif' }}>Jude Annan</span>
                </div>
                <div className="border-t border-slate-700 pt-2">
                  <p className="text-slate-200 font-medium text-sm">Jude Annan, CISM</p>
                  <p className="text-slate-500 text-xs mt-0.5">Founder &amp; Chief Security Strategist</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
