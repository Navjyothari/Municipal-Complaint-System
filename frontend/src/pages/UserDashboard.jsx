import React, { useState, useEffect } from 'react';
import { Plus, Home, Lightbulb, Trash2, MoreVertical, User, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './DashboardPages.css';

const UserDashboard = () => {
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
      case 'infrastructure': return <Home size={20} />;
      case 'electricity': return <Lightbulb size={20} />;
      case 'sanitation': return <Trash2 size={20} />;
      default: return <AlertCircle size={20} />;
    }
  };

  return (
    <>
      <div className="welcome-card">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back, Citizen</h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Monitor and track your reported municipal issues.</p>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <div className="card" style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Reports Submitted</span>
              <span style={{ color: 'var(--brand-teal)', fontWeight: 600 }}>{complaints.length}</span>
            </div>
          </div>
        </div>
        
        <Link to="/report" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> Add Complaint
        </Link>
      </div>

      <div className="reports-layout" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
        <div className="compact-list">
          <div className="compact-list-header">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 500 }}>Your Complaints</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-surface" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', backgroundColor: 'var(--bg-surface-hover)' }}>All</button>
            </div>
          </div>
          
          {isLoading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>You haven't submitted any complaints yet.</p>
              <Link to="/report" style={{ color: 'var(--brand-teal)', marginTop: '1rem', display: 'inline-block' }}>Submit your first report</Link>
            </div>
          ) : (
            complaints.map(complaint => (
              <div key={complaint.id} className="compact-item">
                <div className="compact-item-left">
                  <div className="report-icon-container" style={{ width: '40px', height: '40px' }}>
                    {getIcon(complaint.category)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 500 }}>{complaint.title}</span>
                      <span className={`badge ${getStatusClass(complaint.status)}`} style={{ fontSize: '0.6rem' }}>
                        {complaint.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Ref: #{complaint.ref_number} • Submitted {new Date(complaint.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Urgency</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500, color: complaint.urgency === 'high' ? '#f87171' : 'inherit' }}>
                      {complaint.urgency.toUpperCase()}
                    </div>
                  </div>
                  <button className="nav-icon-btn"><MoreVertical size={18}/></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div className="card">
             <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-teal)', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>SYSTEM HEALTH</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
               <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                 <div style={{ width: '82%', height: '100%', backgroundColor: 'var(--brand-teal)', borderRadius: '4px' }}></div>
               </div>
               <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--brand-teal)' }}>82%</div>
             </div>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>Average resolution speed has improved by 12% this month.</p>
          </div>
          
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-teal)', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>ACTIVE RESOLUTION</div>
            <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1 }}>{complaints.filter(c => c.status === 'in_progress').length}</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>Cases currently being addressed by municipal departments.</p>
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.05 }}>
               <User size={120} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
