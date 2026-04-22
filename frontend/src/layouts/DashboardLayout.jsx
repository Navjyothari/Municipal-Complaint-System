import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="content-container">
          <Outlet />
        </main>
        
        <footer style={{ padding: '0 2.5rem 2rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <div>
            <span style={{color: 'var(--brand-teal)', fontWeight: '600'}}>Municipal Excellence</span>
            <p style={{marginTop: '4px'}}>© 2024 Municipal Excellence Strategy. Built for Civic Architects.</p>
          </div>
          <div style={{display: 'flex', gap: '1.5rem'}}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Accessibility</a>
            <a href="#">Contact Support</a>
            <a href="#">Global Office</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
