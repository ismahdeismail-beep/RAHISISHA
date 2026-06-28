import { useState } from 'react';

const allTransactions = [
  { id:'#TXN-8832', merchant:'Aroma Coffee',       amount:'$342.00', provider:'M-Pesa',   status:'completed', time:'2026-06-28 09:42', method:'Send Money' },
  { id:'#TXN-8831', merchant:'Safari Mart',         amount:'$1,280',  provider:'M-Pesa',   status:'completed', time:'2026-06-28 09:36', method:'Paybill' },
  { id:'#TXN-8830', merchant:'Nile Tech Store',      amount:'$4,592',  provider:'Braintree',status:'completed', time:'2026-06-28 09:30', method:'Card' },
  { id:'#TXN-8829', merchant:'Savannah Boutique',    amount:'$215.50', provider:'PesaPal',  status:'pending',   time:'2026-06-28 09:25', method:'Mobile' },
  { id:'#TXN-8828', merchant:'Serengeti Safaris',    amount:'$8,200',  provider:'M-Pesa',   status:'completed', time:'2026-06-28 09:17', method:'Paybill' },
  { id:'#TXN-8827', merchant:'Pwani Fresh Produce',  amount:'$560.00', provider:'Braintree',status:'failed',    time:'2026-06-28 09:09', method:'Card' },
  { id:'#TXN-8826', merchant:'Equity Bank Kenya',    amount:'$12,500', provider:'M-Pesa',   status:'completed', time:'2026-06-28 08:55', method:'Send Money' },
  { id:'#TXN-8825', merchant:'Mama Mboga Grocers',   amount:'$89.99',  provider:'M-Pesa',   status:'completed', time:'2026-06-28 08:42', method:'Till' },
  { id:'#TXN-8824', merchant:'KCB Group',            amount:'$25,000', provider:'Braintree',status:'pending',   time:'2026-06-28 08:30', method:'Wire' },
  { id:'#TXN-8823', merchant:'Jambo Jet Airways',    amount:'$3,450',  provider:'PesaPal',  status:'completed', time:'2026-06-28 08:18', method:'Mobile' },
  { id:'#TXN-8822', merchant:'Java House',           amount:'$124.00', provider:'M-Pesa',   status:'failed',    time:'2026-06-28 08:05', method:'Till' },
  { id:'#TXN-8821', merchant:'Safaricom PLC',        amount:'$50,000', provider:'M-Pesa',   status:'completed', time:'2026-06-28 07:50', method:'Paybill' },
  { id:'#TXN-8820', merchant:'Tuskys Supermarket',   amount:'$2,340',  provider:'Braintree',status:'completed', time:'2026-06-28 07:35', method:'Card' },
  { id:'#TXN-8819', merchant:'Lake Victoria Lodge',  amount:'$6,700',  provider:'PesaPal',  status:'pending',   time:'2026-06-28 07:20', method:'Mobile' },
  { id:'#TXN-8818', merchant:'Nakumatt Holdings',    amount:'$1,890',  provider:'M-Pesa',   status:'completed', time:'2026-06-28 07:05', method:'Till' },
];

const filters = ['All', 'Completed', 'Pending', 'Failed'];
const providers = ['All Providers', 'M-Pesa', 'Braintree', 'PesaPal'];

function StatusBadge({ status }) {
  return (
    <span className={`status ${status}`}>
      <span className="dot" /> {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function Transactions() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [providerFilter, setProviderFilter] = useState('All Providers');
  const [search, setSearch] = useState('');

  const filtered = allTransactions.filter(tx => {
    if (activeFilter !== 'All' && tx.status !== activeFilter.toLowerCase()) return false;
    if (providerFilter !== 'All Providers' && tx.provider !== providerFilter) return false;
    if (search && !tx.merchant.toLowerCase().includes(search.toLowerCase()) && !tx.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div className="stat-card"><div className="value" style={{ fontSize:'1.3rem' }}>15,892</div><div className="label">Today</div></div>
        <div className="stat-card"><div className="value" style={{ fontSize:'1.3rem', color:'var(--success)' }}>14,203</div><div className="label">Completed</div></div>
        <div className="stat-card"><div className="value" style={{ fontSize:'1.3rem', color:'var(--warning)' }}>1,248</div><div className="label">Pending</div></div>
        <div className="stat-card"><div className="value" style={{ fontSize:'1.3rem', color:'var(--danger)' }}>441</div><div className="label">Failed</div></div>
      </div>

      {/* Filters + Search */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, marginBottom:16 }}>
        <div className="filters">
          {filters.map(f => (
            <button key={f} className={`filter-btn${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <select value={providerFilter} onChange={e => setProviderFilter(e.target.value)} style={{
            padding:'6px 12px', borderRadius:'100px', border:'1px solid var(--border)',
            background:'var(--bg-card)', color:'var(--text)', fontSize:'0.8rem', outline:'none',
          }}>
            {providers.map(p => <option key={p}>{p}</option>)}
          </select>
          <div className="header-search" style={{ minWidth:200 }}>
            <span>🔍</span>
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="card-body" style={{ padding:0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width:30 }}><input type="checkbox" /></th>
                  <th>Transaction ID</th>
                  <th>Merchant</th>
                  <th>Amount</th>
                  <th>Provider</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th style={{ width:40 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id}>
                    <td><input type="checkbox" /></td>
                    <td style={{ fontWeight:600, fontSize:'0.82rem', color:'var(--text-muted)' }}>{tx.id}</td>
                    <td>{tx.merchant}</td>
                    <td style={{ fontWeight:600 }}>{tx.amount}</td>
                    <td><span style={{ padding:'2px 8px', borderRadius:'4px', background:'var(--bg-primary)', fontSize:'0.82rem' }}>{tx.provider}</span></td>
                    <td style={{ color:'var(--text-dim)', fontSize:'0.82rem' }}>{tx.method}</td>
                    <td><StatusBadge status={tx.status} /></td>
                    <td style={{ color:'var(--text-dim)', fontSize:'0.82rem' }}>{tx.time}</td>
                    <td style={{ color:'var(--text-dim)', cursor:'pointer' }}>⋯</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-header" style={{ justifyContent:'space-between' }}>
          <span style={{ fontSize:'0.82rem', color:'var(--text-dim)' }}>
            Showing {filtered.length} of {allTransactions.length} transactions
          </span>
          <div style={{ display:'flex', gap:8 }}>
            <button className="filter-btn">← Prev</button>
            <button className="filter-btn active">1</button>
            <button className="filter-btn">2</button>
            <button className="filter-btn">3</button>
            <button className="filter-btn">Next →</button>
          </div>
        </div>
      </div>
    </>
  );
}