import React, { useState, useEffect } from 'react';
import { Filter, Plus, Droplet, Lightbulb, TreePine, Clock, User, Play, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './DashboardPages.css';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/v1/complaints', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setComplaints(data.data);
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'badge-pending';
      case 'in_progress': return 'badge-progress';
      case 'resolved': return 'badge-resolved';
      default: return '';
    }
  };

  const getIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'infrastructure': return <Droplet size={24} />;
      case 'electricity': return <Lightbulb size={24} />;
      case 'sanitation': return <TreePine size={24} />;
      default: return <AlertCircle size={24} />;
    }
  };

  return (
    <>
      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <h4>Municipal HQ</h4>
          <h1>Complaint Intelligence</h1>
          <p>Overview of civil complaints and their urgency.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-surface">
            <Filter size={16} /> Filters
          </button>
          <Link to="/report" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> New Case
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card featured">
          <div className="stat-title">Total Activity</div>
          <div className="stat-value">{complaints.length}</div>
          <div className="stat-subtext"><span className="positive">+12.4%</span> from previous quarter</div>
          <svg className="stat-icon-bg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        </div>
        <div className="stat-card">
          <div>
            <div className="mini-stat-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-teal)" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              <span>Infrastructure</span>
            </div>
            <div className="mini-stat-value">{complaints.filter(c => c.category === 'Infrastructure').length}</div>
          </div>
          <div className="progress-track">
            <div className="progress-fill teal" style={{ width: `${(complaints.filter(c => c.category === 'Infrastructure').length / (complaints.length || 1)) * 100}%` }}></div>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="mini-stat-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffb8b8" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              <span>Sanitation</span>
            </div>
            <div className="mini-stat-value">{complaints.filter(c => c.category === 'Sanitation').length}</div>
          </div>
          <div className="progress-track">
            <div className="progress-fill pink" style={{ width: `${(complaints.filter(c => c.category === 'Sanitation').length / (complaints.length || 1)) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="reports-layout">
        <div>
          <h2 className="section-title">Reports</h2>
          
          {isLoading ? (
            <p>Loading reports...</p>
          ) : complaints.length === 0 ? (
            <div className="report-card">
              <div className="report-details">
                <p style={{ color: 'var(--text-muted)' }}>No reports found in the system.</p>
              </div>
            </div>
          ) : (
            complaints.map(complaint => (
              <div key={complaint.id} className="report-card">
                <div className={`report-icon-container ${complaint.category === 'Infrastructure' ? 'teal' : ''}`}>
                  {getIcon(complaint.category)}
                </div>
                <div className="report-details">
                  <h3>{complaint.title}</h3>
                  <div className="report-meta">
                    <span className="report-meta-item"><User size={14}/> {complaint.user_id}</span>
                    <span className="report-meta-item"><Clock size={14}/> {new Date(complaint.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="report-badges">
                    <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>{complaint.category}</span>
                    <span className={`badge ${getStatusClass(complaint.status)}`}>{complaint.status.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>
                <div className="report-actions">
                  <button className="btn btn-surface" onClick={() => alert('Log Activity functional soon!')}>Log Activity</button>
                  <button className="btn btn-primary" onClick={() => alert('Assignment functional soon!')}>Assign Team</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 1.5rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 500}}>Live<br/>Monitoring</h3>
                <span className="badge" style={{ backgroundColor: 'var(--brand-teal)', color: '#000', borderRadius: '12px' }}>● LIVE FEED</span>
              </div>
              
              <div style={{ position: 'relative', height: '140px', backgroundColor: '#111', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Play size={20} fill="currentColor" style={{ marginLeft: '4px' }}/>
                  </button>
                </div>
                <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                  Sector 04 - West
                </div>
              </div>
            </div>

            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '4px', backgroundColor: 'var(--brand-teal)', borderRadius: '2px' }}></div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>Recent Activity</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>System scanning for anomalies...</div>
                </div>
              </div>
              <button className="btn btn-surface" style={{ width: '100%', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>View Incident Logs</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
