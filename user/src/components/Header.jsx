export default function Header({ title, subtitle }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="header-right">
        <div className="header-search">
          <span>🔍</span>
          <input type="text" placeholder="Search payments..." />
        </div>
        <button className="header-btn">⚡</button>
        <button className="header-btn notif-btn">
          🔔
          <span className="dot"></span>
        </button>
      </div>
    </header>
  );
}