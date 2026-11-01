import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, CheckCircle2, LogOut, Key, User, Clock, Users, BarChart3 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold text-2xl shadow-xs">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {user?.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                System Administrator
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Department: <span className="font-semibold text-slate-700">{user?.department || 'Environmental Protection Administration'}</span>
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

      {/* Profile & Security Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Administrator Credentials */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Key className="w-4 h-4 text-purple-600" />
            Administrative Clearance
          </h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-slate-400 font-medium uppercase tracking-wider">Admin Name</dt>
              <dd className="font-semibold text-slate-800">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 font-medium uppercase tracking-wider">Admin Email</dt>
              <dd className="font-mono text-slate-800 text-xs">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 font-medium uppercase tracking-wider">Access Tier</dt>
              <dd className="text-purple-700 font-bold uppercase text-xs">SUPER_ADMIN (Tier 1)</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 font-medium uppercase tracking-wider">System State</dt>
              <dd className="mt-1">
                <StatusBadge status="OPERATIONAL" size="sm" />
              </dd>
            </div>
          </dl>
        </div>

        {/* Stage 2 Active Security Scope */}
        <div className="md:col-span-2 bg-gradient-to-br from-purple-50/60 to-white rounded-2xl border border-purple-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 mb-4">
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              Highest System Privileges Authorized
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Central Administration Console
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl mb-6">
              You are authenticated with full administrative clearance. You have uninhibited authority over all platform sub-systems, audit trails, and user accounts.
            </p>

            <div className="bg-white/80 rounded-xl p-4 border border-purple-200/60 space-y-2">
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                Upcoming Stage 6 Management Modules:
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                <li>City-Wide Complaint Assignment & Officer Workload Balancing</li>
                <li>Pollution Category Breakdown Analytics & KPI Charts</li>
                <li>Officer Account Provisioning & Citizen Account Management</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between text-xs text-slate-500">
            <span>Privilege Level: <code className="font-mono text-purple-700 font-bold">ROOT_ADMIN_2026</code></span>
            <span className="text-purple-700 font-semibold">Active Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}

