import { useState } from 'react';

const allTx = [
  { id:'#TXN-8832', to:'Aroma Coffee Supplies',   amt:'+$342.00',  type:'in',  prov:'M-Pesa',   st:'completed', date:'Jun 28, 09:42', method:'Paybill' },
  { id:'#TXN-8831', to:'Safari Mart Wholesale',    amt:'+$1,280',   type:'in',  prov:'M-Pesa',   st:'completed', date:'Jun 28, 09:36', method:'Send Money' },
  { id:'#TXN-8830', to:'Nile Tech Distributors',   amt:'-$4,592',   type:'out', prov:'Braintree',st:'completed', date:'Jun 28, 09:30', method:'Card' },
  { id:'#TXN-8829', to:'Savannah Boutique',        amt:'+$215.50',  type:'in',  prov:'PesaPal',  st:'pending',   date:'Jun 28, 09:25', method:'Mobile' },
  { id:'#TXN-8828', to:'Serengeti Safari Lodge',   amt:'+$8,200',   type:'in',  prov:'M-Pesa',   st:'completed', date:'Jun 28, 09:17', method:'Paybill' },
  { id:'#TXN-8827', to:'Pwani Fresh Produce',      amt:'-$560.00',  type:'out', prov:'Braintree',st:'failed',    date:'Jun 28, 09:09', method:'Card' },
  { id:'#TXN-8826', to:'Equity Bank Kenya',        amt:'+$12,500',  type:'in',  prov:'M-Pesa',   st:'completed', date:'Jun 28, 08:55', method:'Send Money' },
  { id:'#TXN-8825', to:'Mama Mboga Grocers',       amt:'+$89.99',   type:'in',  prov:'M-Pesa',   st:'completed', date:'Jun 28, 08:42', method:'Till' },
  { id:'#TXN-8824', to:'KCB Group',                amt:'+$25,000',  type:'in',  prov:'Braintree',st:'pending',   date:'Jun 28, 08:30', method:'Wire' },
  { id:'#TXN-8823', to:'Jambo Jet Airways',        amt:'-$3,450',   type:'out', prov:'PesaPal',  st:'completed', date:'Jun 28, 08:18', method:'Mobile' },
  { id:'#TXN-8822', to:'Java House',               amt:'-$124.00',  type:'out', prov:'M-Pesa',   st:'failed',    date:'Jun 28, 08:05', method:'Till' },
  { id:'#TXN-8821', to:'Safaricom PLC',            amt:'+$50,000',  type:'in',  prov:'M-Pesa',   st:'completed', date:'Jun 28, 07:50', method:'Paybill' },
];

const filters = ['All','Completed','Pending','Failed'];
const typeFilters = ['All Types','Money In','Money Out'];

function Badge({ s }) {
  return <span className={`status ${s}`}><span className="dot" />{s.charAt(0).toUpperCase()+s.slice(1)}</span>;
}

export default function Transactions() {
  const [f, setF] = useState('All');
  const [tf, setTf] = useState('All Types');
  const [q, setQ] = useState('');

  const filtered = allTx.filter(tx => {
    if (f !== 'All' && tx.st !== f.toLowerCase()) return false;
    if (tf === 'Money In' && tx.type !== 'in') return false;
    if (tf === 'Money Out' && tx.type !== 'out') return false;
    if (q && !tx.to.toLowerCase().includes(q.toLowerCase()) && !tx.id.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const moneyIn = allTx.filter(t => t.type==='in' && t.st==='completed').reduce((s,t) => s + Math.abs(parseFloat(t.amt.replace(/[^0-9.-]/g,''))), 0);
  const moneyOut = allTx.filter(t => t.type==='out' && t.st==='completed').reduce((s,t) => s + Math.abs(parseFloat(t.amt.replace(/[^0-9.-]/g,''))), 0);

  return (
    <>
      {/* Summary */}
      <div className="stats-row" style={{ gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div className="stat-box"><div className="value" style={{ color:'var(--success)' }}>+${moneyIn.toLocaleString()}</div><div className="label">Received</div></div>
        <div className="stat-box"><div className="value" style={{ color:'var(--danger)' }}>-${moneyOut.toLocaleString()}</div><div className="label">Sent</div></div>
        <div className="stat-box"><div className="value">${(moneyIn-moneyOut).toLocaleString()}</div><div className="label">Net</div></div>
        <div className="stat-box"><div className="value">{allTx.length}</div><div className="label">Total</div></div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom:14 }}>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
          <div className="filters">
            {filters.map(v => (
              <a key={v} className={`filter-btn${f===v?' active':''}`} onClick={() => setF(v)} style={{ cursor:'pointer' }}>{v}</a>
            ))}
          </div>
          <select className="filter-select" value={tf} onChange={e => setTf(e.target.value)}>
            {typeFilters.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="header-search" style={{ minWidth:180 }}>
          <span style={{ fontSize:'0.75rem', opacity:0.5 }}>🔍</span>
          <input type="text" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body" style={{ padding:0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th style={{ width:24 }}><input type="checkbox" /></th><th>ID</th><th>Counterparty</th><th>Amount</th><th>Provider</th><th>Method</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id}>
                    <td><input type="checkbox" /></td>
                    <td style={{ fontSize:'0.75rem', color:'var(--text-dim)' }}>{tx.id}</td>
                    <td>{tx.to}</td>
                    <td style={{ fontWeight:700, color: tx.type==='in'?'var(--success)':'var(--text)' }}>{tx.amt}</td>
                    <td><span style={{ padding:'1px 6px', borderRadius:3, background:'var(--bg)', fontSize:'0.75rem' }}>{tx.prov}</span></td>
                    <td style={{ color:'var(--text-dim)', fontSize:'0.78rem' }}>{tx.method}</td>
                    <td><Badge s={tx.st} /></td>
                    <td style={{ color:'var(--text-dim)', fontSize:'0.78rem' }}>{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 18px', borderTop:'1px solid var(--border)' }}>
          <span style={{ fontSize:'0.75rem', color:'var(--text-dim)' }}>{filtered.length} of {allTx.length}</span>
          <div className="filters">
            <a className="filter-btn">←</a>
            <a className="filter-btn active">1</a>
            <a className="filter-btn">2</a>
            <a className="filter-btn">3</a>
            <a className="filter-btn">→</a>
          </div>
        </div>
      </div>
    </>
  );
}