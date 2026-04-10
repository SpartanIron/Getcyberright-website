import React from "react";
import { CheckCircle, Award } from "lucide-react";

export function ShieldBadge() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-8 font-sans">
      {/* Certificate Container */}
      <div 
        className="relative w-full max-w-[1024px] aspect-[1.414/1] bg-white shadow-2xl overflow-hidden rounded-xl border border-slate-200 flex flex-col"
        style={{
          backgroundImage: `
            radial-gradient(circle at 100% 0%, rgba(6, 182, 212, 0.05) 0%, transparent 25%),
            radial-gradient(circle at 0% 100%, rgba(16, 185, 129, 0.05) 0%, transparent 25%)
          `
        }}
      >
        {/* Top Border Accent */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-500" />
        
        {/* Background Decorative Logo (Faint) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <img src="/__mockup/images/lock-logo.png" alt="" className="w-[500px] h-[500px] object-contain" />
        </div>

        <div className="flex-1 p-12 md:p-16 flex flex-col relative z-10">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-lg">
                <img src="/__mockup/images/lock-logo.png" alt="GetCyberRight" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">GetCyberRight</h1>
                <p className="text-xs text-slate-500 tracking-widest uppercase font-medium">Cybersecurity Education</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Certificate of Completion</p>
              <p className="text-xs text-slate-400 font-mono bg-slate-100 px-3 py-1 rounded-full inline-block">ID: GCR-2026-04-0847</p>
            </div>
          </div>

          {/* Main Content Area - Split Layout */}
          <div className="flex-1 flex flex-col md:flex-row items-center gap-12">
            
            {/* Left: Big Badge */}
            <div className="hidden md:flex flex-col items-center justify-center w-1/3">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-[40px] opacity-20 rounded-full" />
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-1 rounded-[2rem] shadow-xl border border-slate-700">
                  <div className="bg-slate-900 rounded-[1.75rem] p-8 border border-slate-700 flex flex-col items-center justify-center h-64 w-64 text-center">
                    <img src="/__mockup/images/lock-logo.png" alt="GCR Badge" className="w-20 h-20 object-contain mb-4" />
                    <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">Verified</p>
                    <p className="text-white text-sm font-medium leading-tight">Cyber Safety<br/>Fundamentals</p>
                  </div>
                </div>
                {/* Floating Ribbon/Badge */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-full shadow-lg font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-2 border-white">
                  <Award className="w-4 h-4" />
                  Achiever
                </div>
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <p className="text-lg text-slate-500 font-medium uppercase tracking-widest">This certifies that</p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-5xl md:text-6xl font-serif text-slate-900 font-bold mb-2">
                  Sarah Mitchell
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto md:mx-0 rounded-full"></div>
              </div>

              <div className="mb-10 space-y-2">
                <p className="text-xl text-slate-600">
                  Has successfully completed the comprehensive training course
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  Cyber Safety Fundamentals
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Awarded On</p>
                    <p className="text-lg font-bold text-slate-900">April 9, 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer / Signatures */}
          <div className="mt-auto pt-12 flex justify-between items-end border-t border-slate-100">
            <div className="flex flex-col items-start">
              <div className="mb-2">
                {/* Simulated Signature */}
                <span className="font-serif text-3xl text-slate-800 italic opacity-80" style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}>
                  Jude Annan
                </span>
              </div>
              <div className="w-48 h-px bg-slate-300 mb-2" />
              <p className="font-bold text-slate-900 text-sm">Jude Annan, CISM</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Founder & Chief Security Strategist</p>
            </div>

            <div className="text-right">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center ml-auto shadow-md">
                <div className="w-18 h-18 rounded-full border border-slate-700 flex items-center justify-center">
                  <img src="/__mockup/images/lock-logo.png" alt="GCR Seal" className="w-10 h-10 object-contain" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
