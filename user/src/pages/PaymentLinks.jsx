import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const links = [
  { id:'#PL-001', desc:'Website Dev — Invoice #042',        amt:'$4,200.00', st:'active',   created:'Jun 26', pay:1, url:'https://rahisisha.co/pay/pl_aB3xK9' },
  { id:'#PL-002', desc:'Consulting Retainer — June',        amt:'$2,500.00', st:'active',   created:'Jun 20', pay:3, url:'https://rahisisha.co/pay/pl_mN7qR2' },
  { id:'#PL-003', desc:'Product Order — Aroma Coffee',       amt:'$890.00',   st:'active',   created:'Jun 14', pay:1, url:'https://rahisisha.co/pay/pl_pW5sH8' },
  { id:'#PL-004', desc:'Donation — Kenya Wildlife Fund',     amt:'Any',       st:'active',   created:'Jun 01', pay:24, url:'https://rahisisha.co/pay/pl_dF1jL4' },
  { id:'#PL-005', desc:'Photography — Natalie W.',            amt:'$1,500.00', st:'inactive', created:'May 28', pay:0, url:'https://rahisisha.co/pay/pl_xG9vM6' },
  { id:'#PL-006', desc:'Q3 Subscription — Premium Plan',     amt:'$299/mo',   st:'active',   created:'May 15', pay:6, url:'https://rahisisha.co/pay/pl_zC2bN7' },
];

export default function PaymentLinks() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(null);

  const copy = (id, url) => {
    navigator.clipboard?.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      {/* Summary */}
      <div className="stats-row" style={{ gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div className="stat-box"><div className="value">{links.filter(l=>l.st==='active').length}</div><div className="label">Active</div></div>
        <div className="stat-box"><div className="value">35</div><div className="label">Payments</div></div>
        <div className="stat-box"><div className="value" style={{ color:'var(--success)' }}>+$4,690</div><div className="label">Collected</div></div>
      </div>

      {/* Create form */}
      <div className="card" style={{ marginBottom:16 }}>
        <div className="card-header"><h3>Create Payment Link</h3></div>
        <div className="card-body">
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'flex-end' }}>
            <div className="form-group" style={{ flex:1, minWidth:140, marginBottom:0 }}>
              <label>Amount</label>
              <input type="text" placeholder="49.99 or Any" />
            </div>
            <div className="form-group" style={{ flex:2, minWidth:200, marginBottom:0 }}>
              <label>Description</label>
              <input type="text" placeholder="What is this for?" />
            </div>
            <button className="btn btn-p" style={{ marginBottom:1 }}>🔗 Generate</button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <h3 style={{ fontSize:'0.92rem', fontWeight:700, marginBottom:10 }}>Your Links</h3>
      <div className="link-grid">
        {links.map(l => (
          <div key={l.id} className="link-card">
            <div className="top">
              <div className="amount">{l.amt}</div>
              <span className={`status ${l.st}`}><span className="dot" />{l.st.charAt(0).toUpperCase()+l.st.slice(1)}</span>
            </div>
            <div className="desc">{l.desc}</div>
            <div className="url-field">
              <span>{l.url}</span>
              <button className="cpy" onClick={() => copy(l.id, l.url)}>
                {copied === l.id ? '✓' : 'Copy'}
              </button>
            </div>
            <div className="meta">
              <span>📅 {l.created}</span>
              <span>💰 {l.pay} payment{l.pay!==1?'s':''}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}