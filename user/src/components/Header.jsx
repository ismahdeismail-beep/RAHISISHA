export default function Header({ title, subtitle }) {
  return (
    <header className="header" style={{ paddingLeft: 48 }}>
      <div className="header-left">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="header-right">
        <div className="header-search">
          <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>🔍</span>
          <input type="text" placeholder="Search..." />
        </div>
        <button className="header-btn" title="Notifications">
          🔔
          <span className="dot"></span>
        </button>
      </div>
    </header>
  );
}