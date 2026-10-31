import React from 'react';
import { Camera, SearchCheck, Hammer, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Report with Evidence',
    icon: Camera,
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    description: 'Snap photographic evidence, select the pollution category, provide location landmarks, and submit. An instant unique tracking ID (e.g. PMS-2026-XXXX) is generated.'
  },
  {
    step: '02',
    title: 'Officer Field Review',
    icon: SearchCheck,
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    description: 'An authorized environmental officer inspects the photographic proof and location, verifying genuine incidents or marking invalid reports with a mandatory written justification.'
  },
  {
    step: '03',
    title: 'Remediation & Action',
    icon: Hammer,
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    description: 'Action notices, sanitation teams, or environmental citations are dispatched to the incident site. Live remarks and action records are logged directly into the system audit trail.'
  },
  {
    step: '04',
    title: 'Verification & Closure',
    icon: CheckCircle,
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    description: 'Once remediated, the officer submits resolution notes and photo proof, marking the ticket resolved. The citizen receives real-time closure verification on their timeline.'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
            Transparent Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            How The Redressal Process Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3">
            A structured, 4-stage lifecycle governed by state-machine integrity so complaints can never be ignored, lost, or closed without verifiable proof.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step}
                className="relative bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-slate-200">
                      {item.step}
                    </span>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-400">
                  <span>Stage {index + 1} of 4</span>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

