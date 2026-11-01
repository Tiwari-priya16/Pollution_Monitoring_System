import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, RefreshCw, ChevronRight, Filter } from 'lucide-react';
import { getMyComplaints } from '../../services/complaintService';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate, categoryIcon } from '../../utils/complaintUtils';

const STATUS_OPTIONS = ['', 'SUBMITTED', 'UNDER REVIEW', 'VERIFIED', 'IN PROGRESS', 'RESOLVED', 'REJECTED'];

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchComplaints = async (status = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyComplaints(status);
      setComplaints(res.complaints || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(statusFilter);
  }, [statusFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Complaints</h1>
          <p className="mt-1 text-sm text-slate-500">All pollution reports submitted by you.</p>
        </div>
        <Link
          to="/citizen/report"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          New Report
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-slate-400" />
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              statusFilter === s
                ? 'bg-forest-600 text-white border-forest-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-forest-400'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
        <button
          onClick={() => fetchComplaints(statusFilter)}
          className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-forest-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin w-8 h-8 text-forest-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : error ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-rose-600 font-medium">{error}</p>
          <button
            onClick={() => fetchComplaints(statusFilter)}
            className="text-sm text-forest-600 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="text-5xl">📋</div>
          <p className="text-slate-500 font-medium">No complaints found{statusFilter ? ` with status "${statusFilter}"` : ''}.</p>
          <Link
            to="/citizen/report"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Submit Your First Complaint
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <Link
              key={c.complaintId}
              to={`/citizen/complaints/${c.complaintId}`}
              className="block bg-white rounded-2xl border border-slate-200 hover:border-forest-300 hover:shadow-sm transition-all p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-lg">{categoryIcon(c.category)}</span>
                    <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {c.complaintId}
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base truncate">{c.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {c.category} &bull; {c.location?.city} &bull; {formatDate(c.createdAt)}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
