import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/overview',      label: 'Overview',        icon: '📊' },
  { to: '/send',          label: 'Send Money',      icon: '💸' },
  { to: '/transactions',  label: 'Transactions',    icon: '📋' },
  { to: '/payment-links', label: 'Payment Links',   icon: '🔗' },
  { to: '/profile',       label: 'Profile',         icon: '👤' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99
        }} onClick={() => setOpen(false)} />
      )}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="logo">R</div>
          <div>
            <h2><span>RAHI</span>SHISHA</h2>
            <span className="ver">My Dashboard</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-label">Menu</div>
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className="icon">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">JM</div>
          <div className="info">
            <div className="name">Jane Mwangi</div>
            <div className="role">Premium Merchant</div>
          </div>
        </div>
      </aside>

      <button className="header-btn mobile-toggle" onClick={() => setOpen(!open)} style={{
        position: 'fixed', top: 12, left: 12, zIndex: 101, background: '#fff'
      }}>
        {open ? '✕' : '☰'}
      </button>
    </>
  );
}