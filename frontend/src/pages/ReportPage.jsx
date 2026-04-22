import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './ReportPage.css';
import {
  Send, UploadCloud, CheckCircle, X, FileImage,
  AlertTriangle, Zap, Activity, MapPin
} from 'lucide-react';
import './ReportPage.css';

const CATEGORIES = [
  'Infrastructure',
  'Sanitation',
  'Water Supply',
  'Electrical',
  'Public Works',
  'Other',
];

const ReportPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [urgency, setUrgency] = useState('medium');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submittedRef, setSubmittedRef] = useState('');

  // ── File drop helpers ─────────────────────────────────────────
  const addFiles = (incoming) => {
    const valid = Array.from(incoming).filter(
      (f) => f.size <= 20 * 1024 * 1024 && /\.(jpg|jpeg|png|heic)$/i.test(f.name)
    );
    setFiles((prev) => [...prev, ...valid].slice(0, 5)); // max 5 files
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Please fill in the title and description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');

      // 1. Create complaint
      const res = await fetch('http://localhost:5000/api/v1/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          urgency,
          location_lat: 19.033,
          location_lng: 73.0297,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Submission failed. Please try again.');
        return;
      }

      const complaintId = data.data.id;
      setSubmittedRef(data.data.ref_number);

      // 2. Upload files if any
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((f) => formData.append('evidence', f));
        await fetch(`http://localhost:5000/api/v1/complaints/${complaintId}/evidence`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        const userConfig = JSON.parse(localStorage.getItem('userConfig') || '{}');
        navigate(userConfig.role === 'admin' ? '/admin' : '/user');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success Screen ─────────────────────────────────────────────
  if (success) {
    return (
      <div className="rp-success">
        <div className="rp-success-card">
          <CheckCircle size={64} className="rp-success-icon" />
          <h1>Report Submitted!</h1>
          <p className="rp-success-ref">Reference: <strong>{submittedRef}</strong></p>
          <p>Our municipal team will review your report shortly. Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  const urgencyIcons = { low: <Activity size={14} />, medium: <Zap size={14} />, high: <AlertTriangle size={14} /> };

  return (
    <div className="rp-root">
      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Main Grid ── */}
      <form onSubmit={handleSubmit} className="rp-grid">
        {/* LEFT COLUMN */}
        <div className="rp-left">
          <div className="rp-headline">
            <h1>Submit New <span className="rp-teal">Civic<br />Report</span></h1>
            <p>Help improve your city by reporting issues like potholes, garbage, water logging, or streetlight problems. Provide accurate details for faster resolution.</p>
          </div>

          {/* Step connector */}
          <div className="rp-step-line" />

          {/* Step 1 */}
          <div className="rp-step">
            <div className="rp-step-dot"><span /></div>
            <div className="rp-step-body">
              <h3 className="rp-step-title">Report Details</h3>

              {error && (
                <div className="rp-error">
                  <AlertTriangle size={14} /> {error}
                </div>
              )}

              {/* Title */}
              <div className="rp-field">
                <label>TITLE / SUBJECT</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Pothole on Market Road"
                  required
                />
              </div>

              {/* Category */}
              <div className="rp-field">
                <label>CATEGORY</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Description */}
              <div className="rp-field">
                <label>DESCRIPTION</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the severity and impact of the issue…"
                  required
                />
              </div>

              {/* Urgency */}
              <div className="rp-field">
                <label>URGENCY LEVEL</label>
                <div className="rp-urgency">
                  {['low', 'medium', 'high'].map((u) => (
                    <button
                      key={u}
                      type="button"
                      className={`rp-urgency-btn rp-urgency-${u} ${urgency === u ? 'active' : ''}`}
                      onClick={() => setUrgency(u)}
                    >
                      {urgencyIcons[u]}
                      {u.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rp-step">
            <div className="rp-step-dot"><span /></div>
            <div className="rp-step-body">
              <h3 className="rp-step-title">Finalize &amp; Submit</h3>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="rp-right">
          {/* Map */}
          <div className="rp-map">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop"
              alt="Map view of the city"
            />
            <div className="rp-map-pin">
              <MapPin size={20} className="rp-teal" />
              <span>Location auto-detected</span>
            </div>
          </div>

          {/* Evidence Upload */}
          <div className="rp-evidence-section">
            <div className="rp-evidence-left">
              <p className="rp-evidence-label">EVIDENCE UPLOADED</p>
              <div
                className={`rp-dropzone ${isDragging ? 'dragging' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.heic"
                  style={{ display: 'none' }}
                  onChange={(e) => addFiles(e.target.files)}
                />
                <UploadCloud size={36} className="rp-upload-icon" />
                <p className="rp-dropzone-main">Drag and drop imagery or click to browse</p>
                <p className="rp-dropzone-sub">JPG, PNG, HEIC UP TO 20MB PER FILE</p>
              </div>

              {/* File previews */}
              {files.length > 0 && (
                <div className="rp-file-list">
                  {files.map((f, i) => (
                    <div key={i} className="rp-file-chip">
                      <FileImage size={12} />
                      <span>{f.name.length > 20 ? f.name.slice(0, 18) + '…' : f.name}</span>
                      <button type="button" onClick={() => removeFile(i)}><X size={10} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Analysis Card */}
            <div className="rp-ai-card">
              <h4>Automated Analysis</h4>
              <p>
                Object detection confirms:{' '}
                <span className="rp-teal rp-bold">
                  {category === 'Infrastructure' ? 'Class 3 Road Damage' :
                   category === 'Sanitation' ? 'Waste Accumulation' :
                   category === 'Water Supply' ? 'Pipe Leakage Detected' :
                   category === 'Electrical' ? 'Power Infrastructure Issue' :
                   'Municipal Issue Detected'}
                </span>. Priority adjusted based on location traffic density.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="rp-submit"
            disabled={isSubmitting}
          >
            <Send size={18} />
            {isSubmitting ? 'Submitting…' : 'Submit Formal Complaint'}
          </button>
        </div>
      </form>

      {/* ── Footer ── */}
      <footer className="rp-footer">
        <div className="rp-footer-left">
          <span className="rp-teal rp-bold">Municipal Excellence</span>
          <p>© 2024 Municipal Excellence Strategy. Built for Civic Architects.</p>
        </div>
        <div className="rp-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Accessibility</a>
          <a href="#">Contact Support</a>
          <a href="#">Global Office</a>
        </div>
        <div className="rp-footer-icons">
          <button className="rp-nav-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></button>
          <button className="rp-nav-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></button>
        </div>
      </footer>
    </div>
  );
};

export default ReportPage;
