import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const links = [
  { to: '/overview',      label: 'Overview',        icon: '📊' },
  { to: '/send',          label: 'Send Money',      icon: '💸' },
  { to: '/transactions',  label: 'Transactions',    icon: '📋' },
  { to: '/payment-links', label: 'Payment Links',   icon: '🔗' },
  { to: '/profile',       label: 'Profile',         icon: '👤' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setOpen(false);

  return (
    <>
      {open && <div className="mobile-overlay" onClick={close} />}

      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="logo">R</div>
          <div>
            <h2><span>RAHI</span>SHISHA</h2>
          </div>
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
          <div className="sidebar-label" style={{ marginTop: 20 }}>Support</div>
          <a className="sidebar-link" onClick={() => { close(); navigate('/overview'); /* placeholder */ }} style={{ cursor: 'pointer' }}>
            <span className="icon">❓</span> Help Center
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">JM</div>
          <div className="info">
            <div className="name">Jane Mwangi</div>
            <div className="role">Premium Merchant</div>
          </div>
        </div>
      </aside>

      <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? '✕' : '☰'}
      </button>
    </>
  );
}