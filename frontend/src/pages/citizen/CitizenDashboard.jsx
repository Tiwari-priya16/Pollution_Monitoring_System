import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, ShieldCheck, FileText, CheckCircle2, LogOut, Clock } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

export default function CitizenDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-700 font-bold text-2xl shadow-xs">
            {user?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome, {user?.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Citizen Portal
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Logged in as <span className="font-mono text-slate-700">{user?.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Role Profile & Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-forest-600" />
            Citizen Profile Credentials
          </h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-slate-400 font-medium uppercase tracking-wider">Full Name</dt>
              <dd className="font-semibold text-slate-800">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 font-medium uppercase tracking-wider">Email Address</dt>
              <dd className="font-mono text-slate-800 text-xs">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 font-medium uppercase tracking-wider">Phone</dt>
              <dd className="text-slate-800">{user?.phone || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 font-medium uppercase tracking-wider">Account Role</dt>
              <dd className="text-slate-800 capitalize font-medium">{user?.role}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 font-medium uppercase tracking-wider">Status</dt>
              <dd className="mt-1">
                <StatusBadge status={user?.isActive ? 'OPERATIONAL' : 'DISCONNECTED'} size="sm" />
              </dd>
            </div>
          </dl>
        </div>

        {/* Stage 2 Active Security Verification Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-forest-50/60 to-white rounded-2xl border border-forest-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-800 border border-forest-200 mb-4">
              <ShieldCheck className="w-4 h-4 text-forest-600" />
              Stage 2 Authentication & RBAC Active
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Secure Citizen Redressal Environment
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl mb-6">
              Your account has been cryptographically authenticated via JSON Web Tokens (JWT) and encrypted with bcrypt. Role-based guards strictly verify all requests on both client and server boundaries.
            </p>

            <div className="bg-white/80 rounded-xl p-4 border border-forest-200/60 space-y-2">
              <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-forest-600" />
                Upcoming Stage 3 Modules:
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                <li>Digital Complaint Submission with photographic proof uploads</li>
                <li>Automated Unique Tracking ID Generation (<code className="font-mono text-forest-700 bg-forest-50 px-1 rounded">PMS-YYYYMM-XXXX</code>)</li>
                <li>Real-time incident timeline and officer remarks inspection</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-forest-100 flex items-center justify-between text-xs text-slate-500">
            <span>Session ID: <code className="font-mono text-slate-700">{user?._id}</code></span>
            <span className="text-forest-700 font-semibold">Ready for Stage 3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
