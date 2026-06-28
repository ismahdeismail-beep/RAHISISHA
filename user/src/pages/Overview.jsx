import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const recentTx = [
  { id:'#TXN-8832', to:'Aroma Coffee Supplies',    amount:'+$342.00', type:'in',  status:'completed', time:'2 min ago', provider:'M-Pesa' },
  { id:'#TXN-8831', to:'Safari Mart Wholesale',     amount:'+$1,280',  type:'in',  status:'completed', time:'8 min ago', provider:'M-Pesa' },
  { id:'#TXN-8830', to:'Nile Tech Distributors',     amount:'-$4,592',  type:'out', status:'completed', time:'14 min ago',provider:'Braintree' },
  { id:'#TXN-8829', to:'Savannah Boutique',          amount:'+$215.50', type:'in',  status:'pending',   time:'19 min ago',provider:'PesaPal' },
  { id:'#TXN-8828', to:'Serengeti Safari Lodge',     amount:'+$8,200',  type:'in',  status:'completed', time:'27 min ago',provider:'M-Pesa' },
];

function StatusBadge({ s }) {
  return <span className={`status ${s}`}><span className="dot" />{s.charAt(0).toUpperCase()+s.slice(1)}</span>;
}

export default function Overview() {
  const navigate = useNavigate();
  const [showBal, setShowBal] = useState(true);

  return (
    <>
      {/* ─── Balance Card ─── */}
      <div className="balance-card anim">
        <div className="top">
          <div>
            <div className="label">Available Balance</div>
            <div className="amount">
              {showBal ? '$284,750.00' : '••••••'}
              <button className="eye-btn" onClick={() => setShowBal(!showBal)} aria-label="Toggle balance">
                {showBal ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="change"><span>▲ +$12,430 (4.6%)</span> this month</div>
          </div>
        </div>
        <div className="actions">
          <button className="btn-p" onClick={() => navigate('/send')}>💸 Send</button>
          <button className="btn-s" onClick={() => navigate('/send')}>📥 Request</button>
          <button className="btn-s">📄 Statement</button>
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div className="stats-row">
        {[
          { icon:'💳', val:'1,247', label:'Transactions (30d)' },
          { icon:'📈', val:'$342K', label:'Total Received' },
          { icon:'🔗', val:'12',    label:'Active Links' },
          { icon:'⭐', val:'4.9',   label:'Rating' },
        ].map((s,i) => (
          <div key={i} className={`stat-box anim anim-${i+1}`}>
            <span className="icon">{s.icon}</span>
            <div className="value">{s.val}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ─── Recent Activity + Spending ─── */}
      <div className="grid-2">
        {/* Recent */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <a className="action" onClick={() => navigate('/transactions')} style={{ cursor:'pointer' }}>View All →</a>
          </div>
          <div className="card-body" style={{ padding:0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>ID</th><th>Counterparty</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {recentTx.map(tx => (
                    <tr key={tx.id} style={{ cursor:'pointer' }} onClick={() => navigate('/transactions')}>
                      <td style={{ fontSize:'0.75rem', color:'var(--text-dim)' }}>{tx.id}</td>
                      <td style={{ maxWidth:130, overflow:'hidden', textOverflow:'ellipsis' }}>{tx.to}</td>
                      <td style={{ fontWeight:600, color: tx.type==='in'?'var(--success)':'var(--text)' }}>{tx.amount}</td>
                      <td><StatusBadge s={tx.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Spending */}
        <div className="card">
          <div className="card-header">
            <h3>Spending by Provider</h3>
            <a className="action" onClick={() => navigate('/transactions')} style={{ cursor:'pointer' }}>Details →</a>
          </div>
          <div className="card-body">
            {[
              { name:'M-Pesa',   pct:58, color:'#0D9488', val:'$198K' },
              { name:'Braintree',pct:25, color:'#D4A843', val:'$85K' },
              { name:'PesaPal',  pct:17, color:'#4C2A9E', val:'$58K' },
            ].map(p => (
              <div key={p.name} className="prov-bar">
                <div className="row">
                  <span>{p.name}</span>
                  <span>{p.val} ({p.pct}%)</span>
                </div>
                <div className="track"><div className="fill" style={{ width:`${p.pct}%`, background:p.color }} /></div>
              </div>
            ))}
            <div className="tip-box">
              <div className="head">💡 Tip</div>
              <div className="body">M-Pesa Paybill saves 1.2% vs card payments.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Payment Links ─── */}
      <div className="card">
        <div className="card-header">
          <h3>Active Payment Links</h3>
          <a className="action" onClick={() => navigate('/payment-links')} style={{ cursor:'pointer' }}>+ New Link</a>
        </div>
        <div className="card-body" style={{ padding:0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Link</th><th>Amount</th><th>Status</th><th>Created</th><th>Payments</th></tr>
              </thead>
              <tbody>
                {[
                  { name:'Invoice #042 — Web Dev',      amt:'$4,200',  st:'active', created:'2 days ago',  pay:1 },
                  { name:'Consulting Retainer — June',  amt:'$2,500',  st:'active', created:'1 week ago',  pay:3 },
                  { name:'Product Order — Aroma Coffee',amt:'$890',    st:'active', created:'2 weeks ago', pay:1 },
                  { name:'Donation — Wildlife Fund',    amt:'Any',     st:'active', created:'1 month ago', pay:24 },
                ].map((l,i) => (
                  <tr key={i} style={{ cursor:'pointer' }} onClick={() => navigate('/payment-links')}>
                    <td style={{ fontWeight:500 }}>{l.name}</td>
                    <td style={{ fontWeight:600 }}>{l.amt}</td>
                    <td><span className={`status ${l.st}`}><span className="dot" />{l.st.charAt(0).toUpperCase()+l.st.slice(1)}</span></td>
                    <td style={{ color:'var(--text-dim)', fontSize:'0.78rem' }}>{l.created}</td>
                    <td style={{ fontWeight:600 }}>{l.pay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}