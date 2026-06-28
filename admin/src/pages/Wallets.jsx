const wallets = [
  { provider:'M-Pesa',   balance:'$1,284,500', holder:'RAHISISHA Payments Ltd',  lastTx:'2 min ago', status:'active' },
  { provider:'Braintree',balance:'$892,300',   holder:'RAHISISHA Payments Ltd',  lastTx:'14 min ago', status:'active' },
  { provider:'PesaPal',  balance:'$445,100',   holder:'RAHISISHA Payments Ltd',  lastTx:'19 min ago', status:'active' },
  { provider:'M-Pesa',   balance:'$128,900',   holder:'Aroma Coffee Co.',        lastTx:'1 hour ago',  status:'active' },
  { provider:'Braintree',balance:'$67,400',    holder:'Safari Mart Ltd',         lastTx:'3 hours ago', status:'active' },
  { provider:'M-Pesa',   balance:'$24,800',    holder:'Serengeti Safaris',       lastTx:'1 day ago',   status:'inactive' },
  { provider:'PesaPal',  balance:'$12,300',    holder:'Savannah Boutique',       lastTx:'2 days ago',  status:'inactive' },
  { provider:'M-Pesa',   balance:'$5,200',     holder:'Pwani Fresh Produce',     lastTx:'5 days ago',  status:'frozen' },
];

const providerColors = { 'M-Pesa':'var(--teal)', 'Braintree':'var(--gold)', 'PesaPal':'var(--purple-light)' };
const statusColors = { active:'var(--success)', inactive:'var(--text-dim)', frozen:'var(--danger)' };

export default function Wallets() {
  return (
    <>
      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card">
          <div className="value" style={{ fontSize:'1.3rem' }}>$2,860,300</div>
          <div className="label">Total Balance</div>
          <div style={{ fontSize:'0.78rem', color:'var(--text-dim)', marginTop:4 }}>Across all providers</div>
        </div>
        <div className="stat-card">
          <div className="value" style={{ fontSize:'1.3rem' }}>8</div>
          <div className="label">Active Wallets</div>
          <div style={{ fontSize:'0.78rem', color:'var(--text-dim)', marginTop:4 }}>6 active · 1 inactive · 1 frozen</div>
        </div>
        <div className="stat-card">
          <div className="value" style={{ fontSize:'1.3rem' }}>$1,284,500</div>
          <div className="label">Largest Balance</div>
          <div style={{ fontSize:'0.78rem', color:'var(--text-dim)', marginTop:4 }}>M-Pesa primary wallet</div>
        </div>
      </div>

      {/* Search / Actions */}
      <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:16 }}>
        <div className="header-search" style={{ minWidth:280 }}>
          <span>🔍</span>
          <input type="text" placeholder="Search wallets by holder or provider..." />
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="filter-btn active">+ New Wallet</button>
          <button className="filter-btn">Export</button>
        </div>
      </div>

      {/* Wallet Cards */}
      <div className="wallet-grid">
        {wallets.map((w, i) => (
          <div key={i} className="wallet-card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <div className="provider" style={{ color: providerColors[w.provider] }}>
                  {w.provider}
                </div>
                <div className="balance">{w.balance}</div>
              </div>
              <span style={{
                fontSize:'0.7rem', fontWeight:600, textTransform:'uppercase',
                letterSpacing:'0.5px', color: statusColors[w.status],
                padding:'2px 8px', borderRadius:'100px', background: w.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)'
              }}>
                {w.status}
              </span>
            </div>
            <div className="holder">{w.holder}</div>
            <div style={{ fontSize:'0.78rem', color:'var(--text-dim)', marginTop:4 }}>
              Last activity: {w.lastTx}
            </div>
            <div className="footer">
              <button>View</button>
              <button>Top Up</button>
              <button>Withdraw</button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent wallet activity */}
      <div className="card" style={{ marginTop:28 }}>
        <div className="card-header">
          <h3>Wallet Activity Log</h3>
          <span className="action">Full Log →</span>
        </div>
        <div className="card-body" style={{ padding:0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Wallet</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Reference</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date:'2026-06-28', wallet:'M-Pesa · Primary', type:'Deposit',    amount:'+$50,000', ref:'MP-20260628-001', status:'completed' },
                  { date:'2026-06-28', wallet:'Braintree · USD',  type:'Withdrawal', amount:'-$12,400', ref:'BT-20260628-003', status:'completed' },
                  { date:'2026-06-27', wallet:'PesaPal · KES',    type:'Deposit',    amount:'+$28,900', ref:'PP-20260627-012', status:'completed' },
                  { date:'2026-06-27', wallet:'M-Pesa · Primary', type:'Settlement', amount:'+$124,500',ref:'STL-20260627',    status:'pending' },
                ].map((a, i) => (
                  <tr key={i}>
                    <td style={{ color:'var(--text-dim)', fontSize:'0.82rem' }}>{a.date}</td>
                    <td>{a.wallet}</td>
                    <td style={{ color: a.type === 'Deposit' || a.type === 'Settlement' ? 'var(--success)' : 'var(--danger)', fontWeight:600 }}>{a.type}</td>
                    <td style={{ fontWeight:600, color: a.amount.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>{a.amount}</td>
                    <td style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>{a.ref}</td>
                    <td><span className={`status ${a.status}`}><span className="dot" />{a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span></td>
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