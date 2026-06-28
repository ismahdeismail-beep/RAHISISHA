import { useState } from 'react';

const links = [
  { id:'#PL-001', description:'Website Development — Invoice #042',   amount:'$4,200.00', status:'active',   created:'Jun 26, 2026', payments:1,  url:'https://rahisisha.co/pay/pl_aB3xK9' },
  { id:'#PL-002', description:'Consulting Retainer — June 2026',       amount:'$2,500.00', status:'active',   created:'Jun 20, 2026', payments:3,  url:'https://rahisisha.co/pay/pl_mN7qR2' },
  { id:'#PL-003', description:'Product Order — Aroma Coffee Co.',     amount:'$890.00',   status:'paid',     created:'Jun 14, 2026', payments:1,  url:'https://rahisisha.co/pay/pl_pW5sH8' },
  { id:'#PL-004', description:'Donation — Kenya Wildlife Fund',       amount:'Any amount', status:'active',   created:'Jun 01, 2026', payments:24, url:'https://rahisisha.co/pay/pl_dF1jL4' },
  { id:'#PL-005', description:'Photography Package — Natalie W.',      amount:'$1,500.00', status:'inactive', created:'May 28, 2026', payments:0,  url:'https://rahisisha.co/pay/pl_xG9vM6' },
  { id:'#PL-006', description:'Q3 Subscription — Premium Plan',        amount:'$299/mo',   status:'active',   created:'May 15, 2026', payments:6,  url:'https://rahisisha.co/pay/pl_zC2bN7' },
];

export default function PaymentLinks() {
  const [copiedId, setCopiedId] = useState(null);

  const copyLink = (id, url) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeCount = links.filter(l => l.status === 'active').length;
  const totalReceived = links.reduce((sum, l) => sum + (l.status === 'paid' ? parseFloat(l.amount.replace(/[^0-9.]/g,'')) : 0), 0);

  return (
    <>
      {/* Summary */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="stat-box">
          <div className="value">{activeCount}</div>
          <div className="label">Active Links</div>
        </div>
        <div className="stat-box">
          <div className="value">35</div>
          <div className="label">Total Payments</div>
        </div>
        <div className="stat-box">
          <div className="value" style={{ color: 'var(--success)' }}>+${totalReceived.toFixed(0)}</div>
          <div className="label">Collected via Links</div>
        </div>
      </div>

      {/* Create New */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3>Create Payment Link</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
              <label>Amount</label>
              <input type="text" placeholder="e.g. 49.99 or 'Any'" />
            </div>
            <div className="form-group" style={{ flex: 2, minWidth: 250, marginBottom: 0 }}>
              <label>Description</label>
              <input type="text" placeholder="What is this payment for?" />
            </div>
            <button className="btn btn-primary" style={{ marginBottom: 1 }}>
              🔗 Generate Link
            </button>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>Your Payment Links</h3>
      <div className="link-grid">
        {links.map(l => (
          <div key={l.id} className="link-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div className="amount">{l.amount}</div>
              <span className={`status ${l.status === 'paid' ? 'completed' : l.status === 'active' ? 'pending' : ''}`}>
                <span className="dot" />{l.status.charAt(0).toUpperCase() + l.status.slice(1)}
              </span>
            </div>
            <div className="description">{l.description}</div>
            <div className="url">
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.url}</span>
              <button className="copy-btn" onClick={() => copyLink(l.id, l.url)}>
                {copiedId === l.id ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="meta">
              <span>📅 {l.created}</span>
              <span>💰 {l.payments} payment{l.payments !== 1 ? 's' : ''}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}