import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPaymentLinks } from '../services/mock';

export default function PaymentLinks() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(null);
  const [links] = useState(mockPaymentLinks);

  const copy = (id, url) => {
    navigator.clipboard?.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const activeCount = links.filter(l=>l.status==='active').length;
  const totalPayments = links.reduce((s,l)=>s+l.payments, 0);
  const totalCollected = links
    .filter(l=>l.payments>0)
    .reduce((s,l) => s + parseFloat(l.amount.replace(/[$,]/g,'')) * l.payments, 0);

  return (
    <>
      {/* Summary */}
      <div className="stats-row" style={{ gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div className="stat-box"><div className="value">{activeCount}</div><div className="label">Active</div></div>
        <div className="stat-box"><div className="value">{totalPayments}</div><div className="label">Payments</div></div>
        <div className="stat-box"><div className="value" style={{ color:'var(--success)' }}>+${totalCollected.toLocaleString()}</div><div className="label">Collected</div></div>
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
            <button className="btn btn-p" style={{ marginBottom:1 }} onClick={() => alert('🔗 Payment link generation coming soon!')}>🔗 Generate</button>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <h3 style={{ fontSize:'0.92rem', fontWeight:700, marginBottom:10 }}>Your Links</h3>
      <div className="link-grid">
        {links.map(l => (
          <div key={l.id} className="link-card">
            <div className="top">
              <div className="amount">{l.amount}</div>
              <span className={`status ${l.status}`}><span className="dot" />{l.status.charAt(0).toUpperCase()+l.status.slice(1)}</span>
            </div>
            <div className="desc">{l.description}</div>
            <div className="url-field">
              <span>{l.url}</span>
              <button className="cpy" onClick={() => copy(l.id, l.url)}>
                {copied === l.id ? '✓' : 'Copy'}
              </button>
            </div>
            <div className="meta">
              <span>📅 {l.created}</span>
              <span>💰 {l.payments} payment{l.payments!==1?'s':''}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}