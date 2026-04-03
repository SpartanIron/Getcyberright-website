import { Shield, Lock } from "lucide-react";

export function BrandedCard() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-8">
      <div className="flex flex-col gap-8">
        <p className="text-neutral-400 text-sm font-medium tracking-wide uppercase text-center">
          Sample Article OG Image — How it would appear as a link preview card
        </p>

        <div className="w-[1200px] h-[630px] relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg shadow-2xl">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

          <div className="relative h-full flex flex-col justify-between p-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg tracking-tight">GetCyberRight</p>
                  <p className="text-emerald-400/80 text-xs font-medium tracking-wider uppercase">Cybersecurity Education</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-300/90 text-xs font-semibold uppercase tracking-wider">Cyber News</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-[900px]">
              <h1 className="text-[52px] leading-[1.1] font-extrabold text-white tracking-tight">
                Deepfake Video Call
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Impersonation Scam
                </span>
              </h1>
              <p className="mt-5 text-lg text-slate-300/90 leading-relaxed max-w-[700px]">
                Criminals are using AI to clone voices and faces in real-time video calls, impersonating family members to steal money.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">getcyberright.com</span>
                </div>
                <div className="h-4 w-px bg-slate-700" />
                <span className="text-slate-500 text-sm">Free Guide</span>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">
                <span className="text-emerald-400 text-sm font-semibold">Read Full Article →</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[600px] mx-auto bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700">
          <p className="text-neutral-400 text-xs font-medium px-4 pt-3 pb-2">
            How it looks in a LinkedIn feed:
          </p>
          <div className="px-4 pb-3">
            <p className="text-white text-sm leading-relaxed">
              Criminals are using AI to clone voices and faces in real-time video calls. The average victim loses $8,500. One step can protect your family.
            </p>
          </div>
          <div className="border-t border-neutral-700">
            <div className="flex gap-3 p-3">
              <div className="w-[120px] h-[80px] rounded bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-emerald-400/60" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white text-sm font-semibold leading-snug">Deepfake Video Call Impersonation Scam</p>
                <p className="text-neutral-500 text-xs mt-0.5">getcyberright.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
