import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';

export default function PlaceholderPage({ type = 'login' }) {
  const isLogin = type === 'login';
  const title = isLogin ? 'System Access Portal' : 'Citizen Registration';
  const subtitle = isLogin
    ? 'Role-based login for Citizens, Pollution Officers, and Administrators'
    : 'New citizen registration for digital environmental reporting';

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 text-center space-y-6">
        
        {/* Icon & Stage Badge */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-700 mb-4 shadow-xs">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full border border-forest-200">
            Stage 2 Deliverable
          </span>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Architecture Note */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 text-left space-y-2">
          <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-forest-600" />
            Security & Authentication Scope:
          </p>
          <ul className="text-xs text-slate-500 space-y-1.5 pl-5 list-disc">
            <li>JWT Bearer token state management</li>
            <li>Bcrypt password cryptographic hashing</li>
            <li>Strict Role-Based Access Control (RBAC)</li>
            <li>Citizen, Officer, and Admin dedicated dashboards</li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Public Landing Page
          </Link>
        </div>

      </div>
    </div>
  );
}

