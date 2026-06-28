import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/overview',      label: 'Overview',        icon: '📊' },
  { to: '/send',          label: 'Send Money',      icon: '💸' },
  { to: '/transactions',  label: 'Transactions',    icon: '📋' },
  { to: '/payment-links', label: 'Payment Links',   icon: '🔗' },
  { to: '/profile',       label: 'Profile',         icon: '👤' },
];

export default function Sidebar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const initials = user ? (user.firstName?.[0] || '') + (user.lastName?.[0] || '') : 'U';

  return (
    <>
      {open && <div className="mobile-overlay" onClick={close} />}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="logo">R</div>
          <div><h2><span>RAHI</span>SHISHA</h2></div>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-label">Menu</div>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/overview'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={close}>
              <span className="icon">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="avatar">{initials}</div>
          <div className="info">
            <div className="name">{user?.firstName || 'User'} {user?.lastName || ''}</div>
            <div className="role">{user?.role === 'admin' ? 'Administrator' : 'Merchant'}</div>
          </div>
          <button onClick={onLogout} style={{
            background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer',
            fontSize:'0.85rem', padding:'4px', borderRadius:'50%', flexShrink:0
          }} title="Sign Out">🚪</button>
        </div>
      </aside>
      <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
        {open ? '✕' : '☰'}
      </button>
    </>
  );
}