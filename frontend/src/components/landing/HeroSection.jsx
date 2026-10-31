import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, AlertCircle, FileText, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-forest-50/70 via-white to-slate-50">
      
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-forest-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Environmental Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-100 border border-forest-200 text-forest-800 text-xs sm:text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-forest-600" />
            <span>Digital Environmental Grievance & Resolution Platform</span>
          </div>
        </div>

        {/* Hero Title & Description */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Empowering Citizens for a <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 via-emerald-600 to-teal-700">
              Cleaner, Pollution-Free
            </span> Tomorrow
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Report environmental violations in real time with verifiable photographic evidence. Connect seamlessly with authorized pollution officers for rapid investigation, tracking, and resolution.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-forest-600 hover:bg-forest-700 shadow-md shadow-forest-600/30 hover:shadow-lg hover:shadow-forest-600/40 transition-all transform active:scale-98"
            >
              Report an Incident
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#categories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs hover:shadow-sm transition-all"
            >
              Explore Categories
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2 rounded-lg bg-forest-100 text-forest-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Lifecycle</p>
                <p className="text-sm font-bold text-slate-800">100% Verifiable</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Authority</p>
                <p className="text-sm font-bold text-slate-800">Officer Verified</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Redressal</p>
                <p className="text-sm font-bold text-slate-800">Direct Actions</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Accountability</p>
                <p className="text-sm font-bold text-slate-800">Audit History</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

