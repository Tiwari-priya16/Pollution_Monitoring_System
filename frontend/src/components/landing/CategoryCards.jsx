import React from 'react';
import { Wind, Droplets, Trash2, Volume2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'air',
    title: 'Air Pollution',
    icon: Wind,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    description: 'Industrial emissions, heavy vehicle exhaust, open crop burning, and uncontained construction dust.',
    examples: ['Chimney dark smoke', 'Traffic smog clusters', 'Waste incineration'],
    urgency: 'Immediate Health Hazard'
  },
  {
    id: 'water',
    title: 'Water Pollution',
    icon: Droplets,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    description: 'Untreated sewage overflow, toxic factory chemical discharge, and plastic dumping into rivers and lakes.',
    examples: ['Lake foam & scum', 'Illegal drain discharge', 'Oil spillage'],
    urgency: 'Ecosystem Threat'
  },
  {
    id: 'land',
    title: 'Land Pollution',
    icon: Trash2,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Unregulated municipal waste dumps, dangerous plastic accumulation, and hazardous industrial residue.',
    examples: ['Illegal roadside dumping', 'Debris piles', 'Biomedical waste'],
    urgency: 'Sanitation Hazard'
  },
  {
    id: 'noise',
    title: 'Noise Pollution',
    icon: Volume2,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    description: 'Excessive construction noise in silence zones, unregulated night loudspeakers, and heavy industrial plant hum.',
    examples: ['Decibel law violations', 'Unmuffled generators', 'Late night events'],
    urgency: 'Civic Quality of Life'
  }
];

export default function CategoryCards() {
  return (
    <section id="categories" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
            Supported Classifications
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Targeted Pollution Categories
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3">
            Every complaint submitted to the platform is tagged to a specific environmental category to ensure swift assignment to specialized pollution officers.
          </p>
        </div>

        {/* 4 Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                className="group relative flex flex-col justify-between bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-forest-500/40 hover:shadow-xl hover:shadow-forest-500/5 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${cat.bgColor} ${cat.color} flex items-center justify-center border ${cat.borderColor} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-tight text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">
                      {cat.urgency}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-forest-700 transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/70">
                  <p className="text-xs font-medium text-slate-500 mb-2">Common Violations:</p>
                  <ul className="space-y-1">
                    {cat.examples.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest-500"></span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className="mt-5 w-full inline-flex items-center justify-between text-xs font-semibold text-forest-700 group-hover:text-forest-800 transition-colors"
                  >
                    <span>Report {cat.title.split(' ')[0]}</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

