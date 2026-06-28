import { useState } from 'react';

const monthlyData = [
  { month:'Jan', rev: 420000, tx: 8200, mpesa: 5200, braintree: 1800, pesapal: 1200 },
  { month:'Feb', rev: 485000, tx: 9100, mpesa: 5600, braintree: 2100, pesapal: 1400 },
  { month:'Mar', rev: 532000, tx: 10200, mpesa: 6200, braintree: 2400, pesapal: 1600 },
  { month:'Apr', rev: 498000, tx: 9800, mpesa: 5900, braintree: 2300, pesapal: 1600 },
  { month:'May', rev: 615000, tx: 11500, mpesa: 7000, braintree: 2600, pesapal: 1900 },
  { month:'Jun', rev: 687000, tx: 12400, mpesa: 7600, braintree: 2800, pesapal: 2000 },
];

const maxRev = Math.max(...monthlyData.map(d => d.rev));
const maxTx = Math.max(...monthlyData.map(d => d.tx));
const maxProv = Math.max(...monthlyData.map(d => Math.max(d.mpesa, d.braintree, d.pesapal)));

const insights = [
  { label:'Avg. Transaction Value',  value:'$54.20',  change:'+3.2%', up:true, desc:'Higher spending per transaction' },
  { label:'Peak Transaction Hour',   value:'14:00',   change:'',      up:true, desc:'2:00 PM — lunch rush hour' },
  { label:'Top Performing Merchant', value:'Safari Mart', change:'+18%', up:true, desc:'$342K in June' },
  { label:'Provider Uptime',         value:'99.97%',  change:'+0.02%', up:true, desc:'All providers healthy' },
];

export default function Analytics() {
  const [chartView, setChartView] = useState('revenue');

  return (
    <>
      {/* Top-level KPIs */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="value">$3,237,000</div>
          <div className="label">Revenue (YTD)</div>
          <div style={{ fontSize:'0.78rem', color:'var(--success)', marginTop:4 }}>▲ +23.4% vs last year</div>
        </div>
        <div className="stat-card">
          <div className="value">61,200</div>
          <div className="label">Total Transactions</div>
          <div style={{ fontSize:'0.78rem', color:'var(--success)', marginTop:4 }}>▲ +18.7% vs last year</div>
        </div>
        <div className="stat-card">
          <div className="value">1,247</div>
          <div className="label">Active Merchants</div>
          <div style={{ fontSize:'0.78rem', color:'var(--success)', marginTop:4 }}>▲ +8.3% this quarter</div>
        </div>
        <div className="stat-card">
          <div className="value">98.4%</div>
          <div className="label">Success Rate</div>
          <div style={{ fontSize:'0.78rem', color:'var(--warning)', marginTop:4 }}>▼ -0.3% this month</div>
        </div>
      </div>

      {/* Chart + View Toggle */}
      <div className="card" style={{ marginBottom:28 }}>
        <div className="card-header">
          <h3>Monthly Performance</h3>
          <div className="filters">
            {['revenue','transactions','providers'].map(v => (
              <button key={v} className={`filter-btn${chartView === v ? ' active' : ''}`} onClick={() => setChartView(v)}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          {chartView === 'revenue' && (
            <div className="chart-bar-group" style={{ height:240 }}>
              {monthlyData.map(d => (
                <div key={d.month} className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height:`${(d.rev / maxRev) * 100}%`, background:'linear-gradient(180deg, var(--teal), var(--purple))' }}>
                    <span className="chart-bar-value">${(d.rev / 1000).toFixed(0)}k</span>
                  </div>
                  <span className="chart-bar-label">{d.month}</span>
                </div>
              ))}
            </div>
          )}

          {chartView === 'transactions' && (
            <div className="chart-bar-group" style={{ height:240 }}>
              {monthlyData.map(d => (
                <div key={d.month} className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height:`${(d.tx / maxTx) * 100}%`, background:'linear-gradient(180deg, var(--gold), #B8860B)' }}>
                    <span className="chart-bar-value">{d.tx.toLocaleString()}</span>
                  </div>
                  <span className="chart-bar-label">{d.month}</span>
                </div>
              ))}
            </div>
          )}

          {chartView === 'providers' && (
            <div style={{ padding:'8px 0' }}>
              {monthlyData.map(d => (
                <div key={d.month} style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:6 }}>
                    <span style={{ fontWeight:600 }}>{d.month}</span>
                    <span style={{ color:'var(--text-muted)' }}>{d.tx.toLocaleString()} tx</span>
                  </div>
                  <div style={{ display:'flex', gap:4, height:28, borderRadius:4, overflow:'hidden' }}>
                    <div style={{ width:`${(d.mpesa / d.tx) * 100}%`, background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:600, color:'#fff' }}>
                      {d.mpesa > 2000 ? 'M-Pesa' : ''}
                    </div>
                    <div style={{ width:`${(d.braintree / d.tx) * 100}%`, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:600, color:'#fff' }}>
                      {d.braintree > 1000 ? 'BT' : ''}
                    </div>
                    <div style={{ width:`${(d.pesapal / d.tx) * 100}%`, background:'var(--purple-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:600, color:'#fff' }}>
                      {d.pesapal > 800 ? 'PP' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insights Grid */}
      <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:16 }}>Key Insights</h3>
      <div className="grid-3">
        {insights.map((ins, i) => (
          <div key={i} className="stat-card" style={{ cursor:'default' }}>
            <div className="top">
              <div className="label" style={{ fontSize:'0.78rem' }}>{ins.label}</div>
              {ins.change && (
                <span className={`trend ${ins.up ? 'up' : 'down'}`}>{ins.change}</span>
              )}
            </div>
            <div className="value" style={{ fontSize:'1.4rem' }}>{ins.value}</div>
            <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginTop:4 }}>{ins.desc}</div>
          </div>
        ))}
      </div>

      {/* Provider Health */}
      <div className="card" style={{ marginTop:28 }}>
        <div className="card-header">
          <h3>Provider Health</h3>
          <span className="action">Last 24 hours</span>
        </div>
        <div className="card-body">
          {[
            { name:'M-Pesa',     status:'Operational', uptime:'99.99%', latency:'45ms',  color:'var(--teal)' },
            { name:'Braintree',  status:'Operational', uptime:'99.97%', latency:'120ms', color:'var(--gold)' },
            { name:'PesaPal',    status:'Degraded',    uptime:'99.82%', latency:'340ms', color:'var(--warning)' },
          ].map(p => (
            <div key={p.name} style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'14px 0', borderBottom:'1px solid var(--border)', flexWrap:'wrap', gap:8
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background: p.status === 'Operational' ? 'var(--success)' : 'var(--warning)' }} />
                <span style={{ fontWeight:600 }}>{p.name}</span>
              </div>
              <div style={{ display:'flex', gap:24, fontSize:'0.85rem', color:'var(--text-muted)' }}>
                <span>{p.status}</span>
                <span>Uptime: {p.uptime}</span>
                <span>Latency: {p.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}