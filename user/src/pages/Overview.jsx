import { useState } from 'react';

const recentTx = [
  { id:'#TXN-8832', to:'Aroma Coffee Supplies',    amount:'+$342.00', type:'in',  status:'completed', time:'2 min ago', provider:'M-Pesa' },
  { id:'#TXN-8831', to:'Safari Mart Wholesale',     amount:'+$1,280',  type:'in',  status:'completed', time:'8 min ago', provider:'M-Pesa' },
  { id:'#TXN-8830', to:'Nile Tech Distributors',     amount:'-$4,592',  type:'out', status:'completed', time:'14 min ago',provider:'Braintree' },
  { id:'#TXN-8829', to:'Savannah Boutique',          amount:'+$215.50', type:'in',  status:'pending',   time:'19 min ago',provider:'PesaPal' },
  { id:'#TXN-8828', to:'Serengeti Safari Lodge',     amount:'+$8,200',  type:'in',  status:'completed', time:'27 min ago',provider:'M-Pesa' },
  { id:'#TXN-8827', to:'Pwani Fresh Produce',        amount:'-$560.00', type:'out', status:'failed',    time:'35 min ago',provider:'Braintree' },
];

function StatusBadge({ status }) {
  return (
    <span className={`status ${status}`}>
      <span className="dot" /> {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function Overview() {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <>
      {/* Balance Card */}
      <div className="balance-card animate-in">
        <div className="label">Available Balance</div>
        <div className="amount">
          {showBalance ? '$284,750.00' : '••••••'}
          <button onClick={() => setShowBalance(!showBalance)} style={{
            background: 'none', border: 'none', color: '#fff', opacity: 0.7,
            cursor: 'pointer', fontSize: '1rem', marginLeft: 12, verticalAlign: 'middle'
          }}>
            {showBalance ? '🙈' : '👁️'}
          </button>
        </div>
        <div className="change">
          <span>▲ +$12,430 (4.6%)</span> this month
        </div>
        <div className="actions">
          <button className="btn-primary">💸 Send Money</button>
          <button className="btn-secondary">📥 Request</button>
          <button className="btn-secondary">📄 Statements</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-row">
        {[
          { icon: '💳', value: '1,247', label: 'Transactions (30d)' },
          { icon: '📈', value: '$342K', label: 'Total Received' },
          { icon: '💼', value: '12',    label: 'Active Payment Links' },
          { icon: '⭐', value: '4.9',   label: 'Avg. Rating' },
        ].map((s, i) => (
          <div key={i} className="stat-box animate-in">
            <div className="top">
              <span className="icon">{s.icon}</span>
              <span style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 600 }}>↑</span>
            </div>
            <div className="value">{s.value}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid-2">
        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <span className="action">View All →</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Counterparty</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTx.map(tx => (
                    <tr key={tx.id}>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{tx.id}</td>
                      <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.to}</td>
                      <td style={{
                        fontWeight: 600,
                        color: tx.type === 'in' ? 'var(--success)' : tx.status === 'failed' ? 'var(--danger)' : 'var(--text)'
                      }}>
                        {tx.amount}
                      </td>
                      <td><StatusBadge status={tx.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer">
            🔄 Auto-updates every 30 seconds
          </div>
        </div>

        {/* Quick Actions / Spending */}
        <div className="card">
          <div className="card-header">
            <h3>Spending by Provider</h3>
            <span className="action">Details →</span>
          </div>
          <div className="card-body">
            {[
              { provider: 'M-Pesa',   pct: 58, color: '#0D9488', amount: '$198K' },
              { provider: 'Braintree',pct: 25, color: '#D4A843', amount: '$85K' },
              { provider: 'PesaPal',  pct: 17, color: '#4C2A9E', amount: '$58K' },
            ].map(p => (
              <div key={p.provider} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{p.provider}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{p.amount} ({p.pct}%)</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-primary)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}

            <div style={{ marginTop: 20, padding: 14, background: 'var(--teal-bg)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--teal)', fontWeight: 600, marginBottom: 4 }}>
                💡 Tip
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Using M-Pesa Paybill saves you 1.2% in processing fees compared to card payments.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Links Quick View */}
      <div className="card">
        <div className="card-header">
          <h3>Active Payment Links</h3>
          <span className="action">+ New Link</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Link</th><th>Amount</th><th>Status</th><th>Created</th><th>Payments</th></tr>
              </thead>
              <tbody>
                {[
                  { name:'Invoice #042 — Web Dev',       amount:'$4,200',  status:'active',   created:'2 days ago',   payments:1 },
                  { name:'Consulting Retainer — June',   amount:'$2,500',  status:'active',   created:'1 week ago',  payments:3 },
                  { name:'Product Order — Aroma Coffee', amount:'$890',    status:'paid',     created:'2 weeks ago',  payments:1 },
                  { name:'Donation — Wildlife Fund',     amount:'Any',     status:'active',   created:'1 month ago',  payments:24 },
                ].map((l, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{l.name}</td>
                    <td style={{ fontWeight: 600 }}>{l.amount}</td>
                    <td><span className={`status ${l.status === 'paid' ? 'completed' : 'pending'}`}><span className="dot" />{l.status.charAt(0).toUpperCase() + l.status.slice(1)}</span></td>
                    <td style={{ color: 'var(--text-dim)' }}>{l.created}</td>
                    <td style={{ fontWeight: 600 }}>{l.payments}</td>
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