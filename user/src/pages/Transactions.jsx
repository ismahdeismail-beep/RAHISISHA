import { useState } from 'react';

const allTx = [
  { id:'#TXN-8832', counterparty:'Aroma Coffee Supplies',   amount:'+$342.00',  type:'in',  provider:'M-Pesa',   status:'completed', date:'Jun 28, 09:42', method:'Paybill' },
  { id:'#TXN-8831', counterparty:'Safari Mart Wholesale',    amount:'+$1,280',   type:'in',  provider:'M-Pesa',   status:'completed', date:'Jun 28, 09:36', method:'Send Money' },
  { id:'#TXN-8830', counterparty:'Nile Tech Distributors',   amount:'-$4,592',   type:'out', provider:'Braintree',status:'completed', date:'Jun 28, 09:30', method:'Card' },
  { id:'#TXN-8829', counterparty:'Savannah Boutique',        amount:'+$215.50',  type:'in',  provider:'PesaPal',  status:'pending',   date:'Jun 28, 09:25', method:'Mobile Money' },
  { id:'#TXN-8828', counterparty:'Serengeti Safari Lodge',   amount:'+$8,200',   type:'in',  provider:'M-Pesa',   status:'completed', date:'Jun 28, 09:17', method:'Paybill' },
  { id:'#TXN-8827', counterparty:'Pwani Fresh Produce',      amount:'-$560.00',  type:'out', provider:'Braintree',status:'failed',    date:'Jun 28, 09:09', method:'Card' },
  { id:'#TXN-8826', counterparty:'Equity Bank Kenya',        amount:'+$12,500',  type:'in',  provider:'M-Pesa',   status:'completed', date:'Jun 28, 08:55', method:'Send Money' },
  { id:'#TXN-8825', counterparty:'Mama Mboga Grocers',       amount:'+$89.99',   type:'in',  provider:'M-Pesa',   status:'completed', date:'Jun 28, 08:42', method:'Till Number' },
  { id:'#TXN-8824', counterparty:'KCB Group',                amount:'+$25,000',  type:'in',  provider:'Braintree',status:'pending',   date:'Jun 28, 08:30', method:'Wire Transfer' },
  { id:'#TXN-8823', counterparty:'Jambo Jet Airways',        amount:'-$3,450',   type:'out', provider:'PesaPal',  status:'completed', date:'Jun 28, 08:18', method:'Mobile Money' },
  { id:'#TXN-8822', counterparty:'Java House',               amount:'-$124.00',  type:'out', provider:'M-Pesa',   status:'failed',    date:'Jun 28, 08:05', method:'Till Number' },
  { id:'#TXN-8821', counterparty:'Safaricom PLC',            amount:'+$50,000',  type:'in',  provider:'M-Pesa',   status:'completed', date:'Jun 28, 07:50', method:'Paybill' },
];

const filters = ['All', 'Completed', 'Pending', 'Failed'];
const typeFilters = ['All Types', 'Money In', 'Money Out'];

function StatusBadge({ status }) {
  return (
    <span className={`status ${status}`}>
      <span className="dot" />{status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function Transactions() {
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [search, setSearch] = useState('');

  const filtered = allTx.filter(tx => {
    if (filter !== 'All' && tx.status !== filter.toLowerCase()) return false;
    if (typeFilter === 'Money In' && tx.type !== 'in') return false;
    if (typeFilter === 'Money Out' && tx.type !== 'out') return false;
    if (search && !tx.counterparty.toLowerCase().includes(search.toLowerCase()) && !tx.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const moneyIn = allTx.filter(t => t.type === 'in' && t.status === 'completed').reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]/g,'')), 0);
  const moneyOut = allTx.filter(t => t.type === 'out' && t.status === 'completed').reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.replace(/[^0-9.-]/g,''))), 0);

  return (
    <>
      {/* Summary */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <div className="stat-box">
          <div className="value" style={{ color: 'var(--success)' }}>+${moneyIn.toLocaleString()}</div>
          <div className="label">Money In</div>
        </div>
        <div className="stat-box">
          <div className="value" style={{ color: 'var(--danger)' }}>-${moneyOut.toLocaleString()}</div>
          <div className="label">Money Out</div>
        </div>
        <div className="stat-box">
          <div className="value">${(moneyIn - moneyOut).toLocaleString()}</div>
          <div className="label">Net Flow</div>
        </div>
        <div className="stat-box">
          <div className="value">{allTx.length}</div>
          <div className="label">Total Transactions</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div className="filters">
            {filters.map(f => (
              <button key={f} className={`filter-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{
            padding: '6px 12px', borderRadius: 100, border: '1px solid var(--border)',
            background: 'var(--bg-card)', color: 'var(--text)', fontSize: '0.8rem', outline: 'none'
          }}>
            {typeFilters.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="header-search" style={{ minWidth: 200 }}>
          <span>🔍</span>
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 30 }}><input type="checkbox" /></th>
                  <th>ID</th>
                  <th>Counterparty</th>
                  <th>Amount</th>
                  <th>Provider</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id}>
                    <td><input type="checkbox" /></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{tx.id}</td>
                    <td>{tx.counterparty}</td>
                    <td style={{ fontWeight: 700, color: tx.type === 'in' ? 'var(--success)' : 'var(--text)' }}>
                      {tx.amount}
                    </td>
                    <td><span style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--bg-primary)', fontSize: '0.8rem' }}>{tx.provider}</span></td>
                    <td style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>{tx.method}</td>
                    <td><StatusBadge status={tx.status} /></td>
                    <td style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>{tx.date}</td>
                    <td style={{ cursor: 'pointer', color: 'var(--text-dim)' }}>⋯</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-header" style={{ justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>{filtered.length} of {allTx.length} transactions</span>
          <div style={{ display: 'flex', gap: 8 }}>
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