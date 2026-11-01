import React from 'react';
import { CheckCircle2, Clock, XCircle, Eye, Wrench, ShieldCheck } from 'lucide-react';
import { formatDateTime } from '../../utils/complaintUtils';

const statusMeta = {
  SUBMITTED: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-300' },
  'UNDER REVIEW': { icon: Eye, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300' },
  VERIFIED: { icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-300' },
  'IN PROGRESS': { icon: Wrench, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-300' },
  RESOLVED: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-300' },
  REJECTED: { icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-300' }
};

export default function Timeline({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic">No status history available.</p>
    );
  }

  return (
    <div className="relative">
      {/* vertical connector line */}
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" aria-hidden="true" />

      <ol className="space-y-5 relative">
        {history.map((entry, idx) => {
          const meta = statusMeta[entry.status] || {
            icon: Clock,
            color: 'text-slate-500',
            bg: 'bg-slate-100',
            border: 'border-slate-300'
          };
          const Icon = meta.icon;
          const isLast = idx === history.length - 1;

          return (
            <li key={idx} className="flex items-start gap-4 pl-0">
              {/* Icon circle */}
              <div
                className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${meta.bg} ${meta.border}`}
              >
                <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
              </div>

              {/* Content */}
              <div className={`flex-1 bg-white rounded-xl border border-slate-200 p-4 ${isLast ? 'shadow-sm' : ''}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>
                    {entry.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDateTime(entry.timestamp)}
                  </span>
                </div>
                {entry.remarks && (
                  <p className="text-sm text-slate-600">{entry.remarks}</p>
                )}
                {entry.updatedBy && (
                  <p className="text-xs text-slate-400 mt-1">
                    By:{' '}
                    <span className="font-medium text-slate-600">
                      {entry.updatedBy?.name || 'System'}
                    </span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
