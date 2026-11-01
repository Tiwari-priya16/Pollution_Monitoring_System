import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, Calendar, User, AlertTriangle } from 'lucide-react';
import { getComplaintById } from '../../services/complaintService';
import StatusBadge from '../../components/common/StatusBadge';
import Timeline from '../../components/complaints/Timeline';
import { getImageUrl, formatDate, formatDateTime, categoryIcon } from '../../utils/complaintUtils';

export default function ComplaintDetail() {
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getComplaintById(complaintId);
        setComplaint(res.complaint);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('Access denied. You can only view your own complaints.');
        } else if (err.response?.status === 404) {
          setError(`Complaint "${complaintId}" not found.`);
        } else {
          setError(err.response?.data?.message || 'Failed to load complaint details.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [complaintId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <svg className="animate-spin w-8 h-8 text-forest-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Error</h2>
        <p className="text-slate-500 text-sm">{error}</p>
        <Link
          to="/citizen/complaints"
          className="inline-flex items-center gap-2 text-sm text-forest-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Complaints
        </Link>
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back */}
      <Link
        to="/citizen/complaints"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-forest-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Complaints
      </Link>

      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-2xl">{categoryIcon(complaint.category)}</span>
              <span className="font-mono text-sm text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
                {complaint.complaintId}
              </span>
              <StatusBadge status={complaint.status} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{complaint.title}</h1>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-4 text-sm text-slate-500 border-t border-slate-100 pt-4">
          <span className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-slate-400" />
            {complaint.category}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            {complaint.location?.address}, {complaint.location?.city}
            {complaint.location?.landmark ? ` (near ${complaint.location.landmark})` : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            Submitted: {formatDate(complaint.createdAt)}
          </span>
          {complaint.citizenId?.name && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              {complaint.citizenId.name}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Description + Image */}
        <div className="lg:col-span-3 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">Description</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
          </div>

          {/* Evidence Image */}
          {complaint.imageUrl && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Evidence Photo</h2>
              </div>
              <img
                src={getImageUrl(complaint.imageUrl)}
                alt={`Evidence for ${complaint.complaintId}`}
                className="w-full max-h-96 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Rejection reason */}
          {complaint.status === 'REJECTED' && complaint.rejectionReason && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-rose-800 mb-1">Rejection Reason</h3>
              <p className="text-sm text-rose-700">{complaint.rejectionReason}</p>
            </div>
          )}

          {/* Resolution details */}
          {complaint.status === 'RESOLVED' && complaint.resolutionDetails?.remarks && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
              <h3 className="text-sm font-bold text-emerald-800">Resolution Details</h3>
              <p className="text-sm text-emerald-700">{complaint.resolutionDetails.remarks}</p>
              {complaint.resolutionDetails.resolvedAt && (
                <p className="text-xs text-emerald-600">
                  Resolved on: {formatDateTime(complaint.resolutionDetails.resolvedAt)}
                </p>
              )}
              {complaint.resolutionDetails.proofImageUrl && (
                <img
                  src={getImageUrl(complaint.resolutionDetails.proofImageUrl)}
                  alt="Resolution proof"
                  className="mt-3 rounded-xl max-h-60 object-cover border border-emerald-200"
                />
              )}
            </div>
          )}
        </div>

        {/* Right: Status Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">Status History</h2>
            <Timeline history={complaint.statusHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}

