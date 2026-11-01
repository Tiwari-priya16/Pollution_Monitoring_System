import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, FileText, CheckCircle2, Clock, PlusCircle,
  ChevronRight, RefreshCw, AlertCircle, LogOut,
  Eye, XCircle, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMyComplaints } from '../../services/complaintService';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate, categoryIcon } from '../../utils/complaintUtils';

// Stat card colour variants
const statVariants = {
  total:    { bg: 'bg-slate-50',   border: 'border-slate-200',   icon: Layers,        iconBg: 'bg-slate-100',   iconColor: 'text-slate-600' },
  pending:  { bg: 'bg-blue-50',    border: 'border-blue-200',    icon: Clock,         iconBg: 'bg-blue-100',    iconColor: 'text-blue-600'  },
  active:   { bg: 'bg-amber-50',   border: 'border-amber-200',   icon: Eye,           iconBg: 'bg-amber-100',   iconColor: 'text-amber-600' },
  resolved: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2,  iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600'},
  rejected: { bg: 'bg-rose-50',    border: 'border-rose-200',    icon: XCircle,       iconBg: 'bg-rose-100',    iconColor: 'text-rose-600'  }
};

function StatCard({ label, value, variant }) {
  const v = statVariants[variant];
  const Icon = v.icon;
  return (
    <div className={`rounded-2xl border p-5 flex items-center gap-4 ${v.bg} ${v.border}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${v.iconBg}`}>
        <Icon className={`w-5 h-5 ${v.iconColor}`} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyComplaints('', 1, 100); // load up to 100 for stats
      setComplaints(res.complaints || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  // Compute stats
  const total     = complaints.length;
  const pending   = complaints.filter((c) => c.status === 'SUBMITTED').length;
  const active    = complaints.filter((c) => ['UNDER REVIEW', 'VERIFIED', 'IN PROGRESS'].includes(c.status)).length;
  const resolved  = complaints.filter((c) => c.status === 'RESOLVED').length;
  const rejected  = complaints.filter((c) => c.status === 'REJECTED').length;

  // Recent 5 complaints
  const recent = complaints.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">

      {/* Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-700 font-bold text-2xl shadow-sm">
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

        <div className="flex items-center gap-3">
          <Link
            to="/citizen/report"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Report Pollution
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <svg className="animate-spin w-7 h-7 text-forest-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-5">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <p className="text-sm text-rose-700 flex-1">{error}</p>
          <button onClick={fetchComplaints} className="text-xs text-rose-600 hover:underline flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard label="Total Submitted"  value={total}    variant="total"    />
            <StatCard label="Pending Review"   value={pending}  variant="pending"  />
            <StatCard label="Under Review"     value={active}   variant="active"   />
            <StatCard label="Resolved"         value={resolved} variant="resolved" />
            <StatCard label="Rejected"         value={rejected} variant="rejected" />
          </div>

          {/* Recent Complaints */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-forest-600" />
                Recent Complaints
              </h2>
              <Link
                to="/citizen/complaints"
                className="text-xs text-forest-600 hover:text-forest-700 font-semibold flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="text-4xl">🌿</div>
                <p className="text-slate-500 text-sm font-medium">No complaints submitted yet.</p>
                <Link
                  to="/citizen/report"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Submit Your First Complaint
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recent.map((c) => (
                  <li key={c.complaintId}>
                    <Link
                      to={`/citizen/complaints/${c.complaintId}`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-xl">{categoryIcon(c.category)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-xs text-slate-400">{c.complaintId}</span>
                          <StatusBadge status={c.status} size="sm" />
                        </div>
                        <p className="text-sm font-semibold text-slate-800 truncate">{c.title}</p>
                        <p className="text-xs text-slate-400">{c.location?.city} &bull; {formatDate(c.createdAt)}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* Profile card at bottom */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <User className="w-4 h-4 text-forest-600" />
          Citizen Profile
        </h3>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-xs text-slate-400 font-medium uppercase tracking-wider">Name</dt>
            <dd className="font-semibold text-slate-800 mt-0.5">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400 font-medium uppercase tracking-wider">Email</dt>
            <dd className="font-mono text-slate-700 text-xs mt-0.5 break-all">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400 font-medium uppercase tracking-wider">Phone</dt>
            <dd className="text-slate-800 mt-0.5">{user?.phone || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400 font-medium uppercase tracking-wider">Role</dt>
            <dd className="capitalize font-medium text-slate-800 mt-0.5">{user?.role}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
