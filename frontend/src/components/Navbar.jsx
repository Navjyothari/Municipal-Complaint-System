import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Globe, Sun, Moon, Bell, User, ChevronDown, X, LogOut, Settings } from 'lucide-react';
import ProfileModal from './ProfileModal';
import './Navbar.css';

const Navbar = () => {
  const [isLight, setIsLight] = useState(() => document.body.classList.contains('light-theme'));
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const notifRef = useRef(null);
  const langRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Sync theme
  useEffect(() => {
    if (isLight) document.body.classList.add('light-theme');
    else document.body.classList.remove('light-theme');
  }, [isLight]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (langRef.current && !langRef.current.contains(e.target)) setShowLangMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userConfig');
    navigate('/login');
  };

  const userConfig = (() => {
    try { return JSON.parse(localStorage.getItem('userConfig') || '{}'); } catch { return {}; }
  })();

  const notifications = [
    { id: 1, text: 'Your complaint MC-9000 is now In Progress.', time: '2m ago', unread: true },
    { id: 2, text: 'MC-8999 has been resolved by Public Works.', time: '1h ago', unread: true },
    { id: 3, text: 'New department assigned to MC-8998.', time: '3h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className="navbar">
        {/* Left brand logo area */}
        <Link to={userConfig.role === 'admin' ? '/admin' : '/user'} className="navbar-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-teal)" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>

        <div className="navbar-actions">
          {/* Language pill */}
          <div ref={langRef} style={{ position: 'relative' }}>
            <button className="nav-btn-pill" onClick={() => setShowLangMenu(v => !v)}>
              <Globe size={14} />
              <span className="text-xs">EN</span>
              <ChevronDown size={11} />
            </button>
            {showLangMenu && (
              <div className="nav-dropdown">
                {['English', 'हिन्दी', 'मराठी', 'தமிழ்'].map(lang => (
                  <button key={lang} className="nav-dropdown-item" onClick={() => setShowLangMenu(false)}>
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <div className="theme-toggle">
            <button
              className={`nav-icon-btn ${isLight ? 'active' : ''}`}
              onClick={() => setIsLight(true)}
              title="Light mode"
            >
              <Sun size={15} />
            </button>
            <button
              className={`nav-icon-btn ${!isLight ? 'active' : ''}`}
              onClick={() => setIsLight(false)}
              title="Dark mode"
            >
              <Moon size={15} />
            </button>
          </div>

          {/* Notifications */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button className="nav-icon-btn borderless" onClick={() => setShowNotifs(v => !v)} title="Notifications">
              <Bell size={17} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>
            {showNotifs && (
              <div className="nav-dropdown notif-dropdown">
                <div className="notif-header">
                  <span>Notifications</span>
                  <button onClick={() => setShowNotifs(false)}><X size={14} /></button>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                    <p>{n.text}</p>
                    <span>{n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User / Profile */}
          {location.pathname !== '/admin' && (
            <button
              className="nav-icon-btn borderless"
              onClick={() => setShowProfile(true)}
              title="Profile"
            >
              <User size={17} />
            </button>
          )}

          {/* Admin avatar with logout */}
          {location.pathname === '/admin' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: '0.85rem' }}>
                {userConfig.first_name?.[0] || 'A'}
              </div>
            </div>
          )}

          {/* Logout button */}
          <button className="nav-icon-btn borderless" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default Navbar;
