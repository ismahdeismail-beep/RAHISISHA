import { useState, useEffect } from 'react';

const stats = [
  { label: 'Total Revenue',  value: '$2,847,392', icon: '💰', color: 'teal',   trend: '+12.5%', up: true },
  { label: 'Transactions',   value: '124,783',     icon: '💳', color: 'gold',   trend: '+8.2%',  up: true },
  { label: 'Active Wallets', value: '48,291',      icon: '🏦', color: 'purple', trend: '+3.7%',  up: true },
  { label: 'Failed TX',      value: '1,847',       icon: '⚠️', color: 'green',  trend: '-2.1%',  up: false },
];

const recentTx = [
  { id:'#TXN-8832', merchant:'Aroma Coffee',       amount:'$342.00', provider:'M-Pesa',   status:'completed', time:'2 min ago' },
  { id:'#TXN-8831', merchant:'Safari Mart',         amount:'$1,280',  provider:'M-Pesa',   status:'completed', time:'8 min ago' },
  { id:'#TXN-8830', merchant:'Nile Tech Store',      amount:'$4,592',  provider:'Braintree',status:'completed', time:'14 min ago' },
  { id:'#TXN-8829', merchant:'Savannah Boutique',    amount:'$215.50', provider:'PesaPal',  status:'pending',   time:'19 min ago' },
  { id:'#TXN-8828', merchant:'Serengeti Safaris',    amount:'$8,200',  provider:'M-Pesa',   status:'completed', time:'27 min ago' },
  { id:'#TXN-8827', merchant:'Pwani Fresh Produce',  amount:'$560.00', provider:'Braintree',status:'failed',    time:'35 min ago' },
];

const weeklyData = [
  { day:'Mon', rev: 28400, tx: 1420 },
  { day:'Tue', rev: 32100, tx: 1580 },
  { day:'Wed', rev: 29800, tx: 1480 },
  { day:'Thu', rev: 35600, tx: 1720 },
  { day:'Fri', rev: 41200, tx: 2010 },
  { day:'Sat', rev: 38700, tx: 1920 },
  { day:'Sun', rev: 34500, tx: 1680 },
];

const maxRev = Math.max(...weeklyData.map(d => d.rev));
const maxTx = Math.max(...weeklyData.map(d => d.tx));

function StatCard({ s }) {
  return (
    <div className="stat-card">
      <div className="top">
        <div className={`icon-box ${s.color}`}>{s.icon}</div>
        <span className={`trend ${s.up ? 'up' : 'down'}`}>{s.trend}</span>
      </div>
      <div className="value">{s.value}</div>
      <div className="label">{s.label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`status ${status}`}>
      <span className="dot" /> {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function Dashboard() {
  const [animatedVal, setAnimatedVal] = useState(0);
  useEffect(() => {
    const target = 124783;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      setAnimatedVal(prev => {
        const next = prev + step;
        if (next >= target) { clearInterval(interval); return target; }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((s, i) => <StatCard key={i} s={s} />)}
      </div>

      {/* Charts Row */}
      <div className="grid-2">
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Weekly Revenue</h3>
            <span className="action">View Full Report →</span>
          </div>
          <div className="card-body">
            <div className="chart-bar-group">
              {weeklyData.map(d => (
                <div key={d.day} className="chart-bar-wrap">
                  <div
                    className="chart-bar"
                    style={{ height: `${(d.rev / maxRev) * 100}%` }}
                  >
                    <span className="chart-bar-value">${(d.rev / 1000).toFixed(1)}k</span>
                  </div>
                  <span className="chart-bar-label">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Provider Pie */}
        <div className="card">
          <div className="card-header">
            <h3>Provider Split</h3>
            <span className="action">Details →</span>
          </div>
          <div className="card-body" style={{ display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
            <div
              className="pie-chart"
              style={{
                background: `conic-gradient(
                  var(--teal) 0deg 220deg,
                  var(--gold) 220deg 300deg,
                  var(--purple-light) 300deg 360deg
                )`
              }}
            >
              <div className="pie-center">100%</div>
            </div>
            <div style={{ flex:1, minWidth:140 }}>
              {[
                { label:'M-Pesa',   pct:61, color:'var(--teal)' },
                { label:'Braintree',pct:22, color:'var(--gold)' },
                { label:'PesaPal',  pct:17, color:'var(--purple-light)' },
              ].map(p => (
                <div key={p.label} style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:4 }}>
                    <span>{p.label}</span>
                    <span style={{ color:'var(--text-muted)' }}>{p.pct}%</span>
                  </div>
                  <div style={{ height:6, background:'var(--bg-primary)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ width:`${p.pct}%`, height:'100%', background:p.color, borderRadius:3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Transactions</h3>
          <span className="action">View All →</span>
        </div>
        <div className="card-body" style={{ padding:0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Merchant</th>
                  <th>Amount</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ fontWeight:600, fontSize:'0.82rem', color:'var(--text-muted)' }}>{tx.id}</td>
                    <td>{tx.merchant}</td>
                    <td style={{ fontWeight:600 }}>{tx.amount}</td>
                    <td>{tx.provider}</td>
                    <td><StatusBadge status={tx.status} /></td>
                    <td style={{ color:'var(--text-dim)', fontSize:'0.82rem' }}>{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Live counter mini display */}
      <div style={{
        marginTop: 24, padding:'14px 20px', background:'var(--bg-card)',
        border:'1px solid var(--border)', borderRadius:'var(--radius)',
        display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12
      }}>
        <span style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>
          ⚡ Live transactions today
        </span>
        <span style={{ fontSize:'1.2rem', fontWeight:800, color:'var(--teal)' }}>
          {animatedVal.toLocaleString()}
        </span>
      </div>
    </>
  );
}