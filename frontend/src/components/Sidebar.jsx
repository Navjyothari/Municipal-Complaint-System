import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Settings, HelpCircle, LogOut, Plus, LayoutDashboard } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userConfig = (() => {
    try { return JSON.parse(localStorage.getItem('userConfig') || '{}'); } catch { return {}; }
  })();

  const isAdmin = userConfig.role === 'admin';
  const dashboardPath = isAdmin ? '/admin' : '/user';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userConfig');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        {/* Logo */}
        <div className="sidebar-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
            <path d="M18 14h-8"></path>
            <path d="M15 18h-5"></path>
            <path d="M10 6h8v4h-8V6Z"></path>
          </svg>
        </div>

        <nav className="sidebar-nav">
          {/* Dashboard */}
          <Link
            to={dashboardPath}
            className={`nav-item ${isActive(dashboardPath) ? 'active' : ''}`}
            title="Dashboard"
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          {/* New Report */}
          <Link
            to="/report"
            className={`nav-item ${isActive('/report') ? 'active' : ''}`}
            title="New Report"
          >
            <Plus size={18} />
            <span>New Report</span>
          </Link>

          {/* Settings (placeholder) */}
          <button
            className="nav-item"
            onClick={() => alert('Settings coming soon!')}
            title="Settings"
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-bottom">
        {/* User info chip */}
        {userConfig.first_name && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {userConfig.first_name[0]}{userConfig.last_name?.[0] || ''}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{userConfig.first_name} {userConfig.last_name}</span>
              <span className="sidebar-user-role">{userConfig.role}</span>
            </div>
          </div>
        )}

        <button
          className="nav-item secondary"
          onClick={() => alert('Support coming soon!')}
          title="Support"
        >
          <HelpCircle size={18} />
          <span>Support</span>
        </button>

        <button
          onClick={handleLogout}
          className="nav-item secondary logout"
          title="Logout"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
