import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',              label: 'Dashboard',     icon: '📊', exact: true },
  { to: '/transactions',  label: 'Transactions',  icon: '💳', badge: 'Live' },
  { to: '/wallets',       label: 'Wallets',       icon: '🏦' },
  { to: '/analytics',     label: 'Analytics',     icon: '📈' },
];

const secondary = [
  { to: '#', label: 'Settings',  icon: '⚙️' },
  { to: '#', label: 'Support',   icon: '❓' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* mobile overlay */}
      {open && <div style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:99
      }} onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="logo">R</div>
          <div>
            <h2><span>RAHI</span>SHISHA</h2>
            <span className="ver">v1.0.0 · Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-label">Main</div>
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.exact}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className="icon">{l.icon}</span>
              {l.label}
              {l.badge && <span className="badge">{l.badge}</span>}
            </NavLink>
          ))}

          <div className="sidebar-label" style={{ marginTop: 24 }}>System</div>
          {secondary.map(l => (
            <a key={l.label} href={l.to} className="sidebar-link">
              <span className="icon">{l.icon}</span>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">IM</div>
          <div className="info">
            <div className="name">Ismael</div>
            <div className="role">Merchant Admin</div>
          </div>
        </div>
      </aside>

      {/* mobile toggle */}
      <button className="header-btn mobile-toggle" onClick={() => setOpen(!open)} style={{
        position:'fixed', top:12, left:12, zIndex:101
      }}>
        {open ? '✕' : '☰'}
      </button>
    </>
  );
}