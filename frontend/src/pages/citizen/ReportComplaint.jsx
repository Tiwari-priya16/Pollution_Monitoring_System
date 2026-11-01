import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload, X, ImagePlus, CheckCircle2, AlertCircle,
  ArrowLeft, Send, FileImage
} from 'lucide-react';
import { submitComplaint } from '../../services/complaintService';

const CATEGORIES = ['Air Pollution', 'Water Pollution', 'Land Pollution', 'Noise Pollution'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const initialForm = {
  title: '',
  category: '',
  description: '',
  address: '',
  city: '',
  landmark: ''
};

export default function ReportComplaint() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null); // { complaintId }
  const [serverError, setServerError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const processImageFile = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: 'Only JPEG, PNG or WebP images are accepted.' }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, image: 'Image must be smaller than 5 MB.' }));
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  const handleFileSelect = (e) => {
    processImageFile(e.target.files[0]);
    e.target.value = ''; // reset so same file can be re-selected
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processImageFile(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    else if (form.title.trim().length > 120) newErrors.title = 'Title must not exceed 120 characters.';
    if (!form.category) newErrors.category = 'Please select a pollution category.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';
    if (!form.address.trim()) newErrors.address = 'Address is required.';
    if (!form.city.trim()) newErrors.city = 'City is required.';
    if (!imageFile) newErrors.image = 'Evidence image is required.';
    return newErrors;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('category', form.category);
      formData.append('description', form.description.trim());
      formData.append('address', form.address.trim());
      formData.append('city', form.city.trim());
      if (form.landmark.trim()) formData.append('landmark', form.landmark.trim());
      formData.append('image', imageFile);

      const res = await submitComplaint(formData);
      setSuccess({ complaintId: res.complaint.complaintId });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit complaint. Please try again.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success Screen ───────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Complaint Submitted!</h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Your pollution report has been received and registered. Authorities have been notified and will
          begin reviewing your complaint shortly.
        </p>
        <div className="bg-forest-50 border border-forest-200 rounded-2xl p-5 inline-block text-left mx-auto">
          <p className="text-xs text-forest-700 font-semibold uppercase tracking-wider mb-1">Tracking ID</p>
          <p className="font-mono text-xl font-bold text-forest-800">{success.complaintId}</p>
          <p className="text-xs text-slate-500 mt-1">Save this ID to track your complaint status.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/citizen/complaints"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-forest-600 hover:bg-forest-700 text-white transition-colors"
          >
            View My Complaints
          </Link>
          <button
            onClick={() => { setSuccess(null); setForm(initialForm); setImageFile(null); setImagePreview(null); }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/citizen/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-forest-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Report Pollution</h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in the details below to submit a pollution complaint. All fields marked with <span className="text-rose-500">*</span> are required.
        </p>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Complaint Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Complaint Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            maxLength={120}
            value={form.title}
            onChange={handleChange}
            placeholder="Brief title describing the pollution incident"
            className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500 ${
              errors.title ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.title ? (
              <p className="text-xs text-rose-600">{errors.title}</p>
            ) : <span />}
            <span className="text-xs text-slate-400">{form.title.length}/120</span>
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Pollution Category <span className="text-rose-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-slate-800 outline-none transition-all focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500 ${
              errors.category ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
            }`}
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-rose-600 mt-1">{errors.category}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Detailed Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the pollution incident in detail — what you observed, when it started, how severe it is, etc."
            className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-slate-800 placeholder-slate-400 outline-none transition-all resize-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500 ${
              errors.description ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
            }`}
          />
          {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
        </div>

        {/* Location */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-slate-700">
            Incident Location <span className="text-rose-500">*</span>
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="address" className="block text-xs font-medium text-slate-500 mb-1">Street Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. 12, MG Road, Near Bus Stand"
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500 ${
                  errors.address ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              />
              {errors.address && <p className="text-xs text-rose-600 mt-1">{errors.address}</p>}
            </div>
            <div>
              <label htmlFor="city" className="block text-xs font-medium text-slate-500 mb-1">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500 ${
                  errors.city ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              />
              {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="landmark" className="block text-xs font-medium text-slate-500 mb-1">Landmark <span className="text-slate-400">(optional)</span></label>
            <input
              id="landmark"
              name="landmark"
              type="text"
              value={form.landmark}
              onChange={handleChange}
              placeholder="e.g. Opposite City Park, near railway station"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500"
            />
          </div>
        </fieldset>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Evidence Photo <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-3">Upload a photo of the pollution site. Accepted: JPEG, PNG, WebP. Max size: 5 MB.</p>

          {!imagePreview ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${
                dragOver
                  ? 'border-forest-500 bg-forest-50'
                  : errors.image
                  ? 'border-rose-400 bg-rose-50/50'
                  : 'border-slate-300 hover:border-forest-400 hover:bg-forest-50/40'
              }`}
            >
              <ImagePlus className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-600">
                {dragOver ? 'Drop your image here' : 'Click or drag & drop to upload'}
              </p>
              <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP — up to 5 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="sr-only"
              />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={imagePreview}
                alt="Preview of evidence"
                className="w-full max-h-72 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200 flex items-center justify-center shadow-sm transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4 text-slate-700" />
              </button>
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-slate-700 flex items-center gap-1.5 border border-slate-200">
                <FileImage className="w-3.5 h-3.5 text-forest-600" />
                {imageFile?.name}
              </div>
            </div>
          )}
          {errors.image && <p className="text-xs text-rose-600 mt-1">{errors.image}</p>}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-forest-600 hover:bg-forest-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Submitting…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Complaint
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
