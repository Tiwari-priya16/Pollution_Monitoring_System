import React from 'react';
import { Users, Shield, BarChart3, Check } from 'lucide-react';

const roles = [
  {
    role: 'For Citizens',
    icon: Users,
    tagline: 'Direct Civic Voice & Real-Time Tracking',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    features: [
      'Submit reports in under 60 seconds with photographic evidence',
      'Auto-generated tracking ID for 100% public transparency',
      'Live visual timeline showing every officer review and remark',
      'Elimination of physical office visits and manual paper petitions'
    ]
  },
  {
    role: 'For Pollution Officers',
    icon: Shield,
    tagline: 'Actionable Queue & Verified Field Workflows',
    badgeBg: 'bg-blue-100 text-blue-800',
    features: [
      'Prioritized case queue organized by pollution category & location',
      'Clear verification interface with invalid report rejection filters',
      'Add step-by-step investigation notes and remediation milestones',
      'Log photographic proof of resolution upon case closure'
    ]
  },
  {
    role: 'For Administrators',
    icon: BarChart3,
    tagline: 'System Oversight & Environmental Intelligence',
    badgeBg: 'bg-purple-100 text-purple-800',
    features: [
      'Comprehensive high-level KPI dashboard of all civic grievances',
      'Automated category breakdown (Air, Water, Land, Noise)',
      'Assign and reallocate cases to certified environmental officers',
      'Audit log monitoring to ensure no complaint is left unaddressed'
    ]
  }
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
            Collaborative Governance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Designed for Every Stakeholder
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3">
            A cohesive three-tier ecosystem creating full synergy between the general public and municipal environmental protection agencies.
          </p>
        </div>

        {/* 3 Role Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-800">
                      <Icon className="w-6 h-6 text-forest-600" />
                    </div>
                    <div>
                      <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${item.badgeBg}`}>
                        {item.role}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {item.role}
                  </h3>
                  <p className="text-xs text-forest-700 font-semibold mb-6">
                    {item.tagline}
                  </p>

                  <div className="space-y-3.5">
                    {item.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <p className="text-sm text-slate-600 leading-snug">
                          {feat}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-8 border-t border-slate-200/80 text-xs text-slate-400 font-medium">
                  Configured for Stage 2 Role-Based Access
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

