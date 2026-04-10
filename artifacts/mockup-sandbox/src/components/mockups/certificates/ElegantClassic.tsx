import React from "react";

export function ElegantClassic() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-8 font-serif">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
      `}} />
      
      {/* Certificate Container */}
      <div className="relative w-full max-w-5xl aspect-[1.414/1] bg-[#FCFBF8] shadow-2xl p-8 sm:p-12 box-border overflow-hidden">
        
        {/* Outer ornate border */}
        <div className="absolute inset-4 border-[6px] border-[#D4AF37] border-double opacity-80 pointer-events-none"></div>
        {/* Inner thin border */}
        <div className="absolute inset-6 border border-[#B8860B] opacity-40 pointer-events-none"></div>
        
        {/* Corner Ornaments */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#D4AF37]"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37]"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#D4AF37]"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#D4AF37]"></div>

        {/* Subtle Background Pattern / Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5 pointer-events-none"></div>

        <div className="relative h-full flex flex-col items-center justify-between text-center py-6 px-4">
          
          {/* Header */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-4">
              <svg className="w-12 h-12 text-[#0F172A]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" />
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#paint0_linear)"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#06B6D4" stopOpacity="0.8"/>
                    <stop offset="1" stopColor="#10B981" stopOpacity="0.8"/>
                  </linearGradient>
                </defs>
              </svg>
              <h1 className="text-3xl font-bold tracking-widest text-[#0F172A] uppercase font-sans">GetCyberRight</h1>
            </div>
            <p className="text-sm tracking-[0.25em] text-slate-500 uppercase font-sans font-medium">Cybersecurity Education Platform</p>
          </div>

          {/* Title Area */}
          <div className="flex flex-col items-center space-y-6 my-4">
            <h2 className="text-5xl md:text-6xl text-[#0F172A] font-playfair font-bold italic tracking-wide">
              Certificate of Completion
            </h2>
            <p className="text-xl text-slate-600 italic font-playfair">This is to proudly certify that</p>
          </div>

          {/* Recipient Area */}
          <div className="w-full flex flex-col items-center pb-2">
            <h3 className="text-5xl md:text-6xl font-playfair font-bold text-[#0F172A] mb-4 text-center px-12 pb-2 border-b-[3px] border-[#D4AF37]/40 min-w-[60%]">
              Sarah Mitchell
            </h3>
          </div>

          {/* Achievement Description */}
          <div className="max-w-3xl text-center space-y-6">
            <p className="text-xl text-slate-700 leading-relaxed font-playfair">
              has successfully completed all required coursework and demonstrated proficiency in the curriculum for
            </p>
            <h4 className="text-3xl md:text-4xl font-playfair font-bold text-[#0F172A] tracking-wide">
              Cyber Safety Fundamentals
            </h4>
            <p className="text-md text-slate-500 font-sans">
              Awarded in recognition of their commitment to personal and family digital security.
            </p>
          </div>

          {/* Footer Area */}
          <div className="w-full grid grid-cols-3 items-end mt-12 gap-8 px-12">
            {/* Left: Date */}
            <div className="flex flex-col items-center border-t-2 border-slate-300 pt-4 pb-2">
              <span className="text-xl font-playfair text-[#0F172A] font-semibold mb-1">April 9, 2026</span>
              <span className="text-[11px] tracking-widest text-slate-500 uppercase font-sans font-bold">Date of Issue</span>
            </div>

            {/* Center: Seal/Badge */}
            <div className="flex justify-center items-center -translate-y-4">
              <div className="w-28 h-28 rounded-full border-[5px] border-[#D4AF37] border-double flex items-center justify-center bg-[#FCFBF8] shadow-lg relative">
                <div className="absolute inset-1 border border-[#B8860B]/40 rounded-full"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full pointer-events-none"></div>
                <svg className="w-12 h-12 text-[#D4AF37]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
              </div>
            </div>

            {/* Right: Signature */}
            <div className="flex flex-col items-center border-t-2 border-slate-300 pt-2 pb-2">
              <span className="font-playfair italic font-medium text-4xl text-[#0F172A] mb-2 -translate-y-2">Jude Annan</span>
              <span className="text-sm font-bold text-[#0F172A] font-sans">Jude Annan, CISM</span>
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-sans mt-1">Founder & Chief Security Strategist</span>
            </div>
          </div>

          {/* Certificate ID */}
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-[11px] tracking-[0.2em] text-slate-400 font-sans font-medium">
              CERTIFICATE ID: GCR-2026-04-0847
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
