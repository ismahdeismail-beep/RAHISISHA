import { useState, useEffect } from 'react';
import api from '../services/api';
import { mockTransactions } from '../services/mock';

const filters = ['All','Completed','Pending','Failed'];
const typeFilters = ['All Types','Money In','Money Out'];

function Badge({ s }) {
  const st = s ? s.toLowerCase() : 'pending';
  return <span className={`status ${st}`}><span className="dot" />{(st.charAt(0).toUpperCase()+st.slice(1))}</span>;
}

export default function Transactions() {
  const [f, setF] = useState('All');
  const [tf, setTf] = useState('All Types');
  const [q, setQ] = useState('');
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await api.get('/payments?limit=100');
        const list = res.data?.payments || res.data || [];
        if (!cancelled) setTxs(list);
      } catch {
        if (!cancelled) { setTxs(mockTransactions); setIsMock(true); }
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const formatAmount = (tx) => {
    if (tx.amount) return tx.amount; // Already formatted (mock)
    const amt = Math.abs(tx.totalAmount || tx.amountValue || 0);
    const prefix = (tx.type === 'in' || tx.direction === 'in') ? '+' : '-';
    return `${prefix}$${amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const getCounterparty = (tx) => tx.counterparty || tx.to || tx.recipient?.name || tx.recipient?.email || 'Unknown';
  const getType = (tx) => {
    const a = formatAmount(tx);
    return a.startsWith('+') ? 'in' : 'out';
  };
  const getStatus = (tx) => (tx.status || tx.st || 'pending').toLowerCase();
  const getProvider = (tx) => tx.provider || tx.prov || '-';
  const getMethod = (tx) => tx.method || tx.paymentMethod || '-';
  const getDate = (tx) => tx.date || tx.createdAt || tx.created || new Date().toLocaleString();
  const getId = (tx) => tx.id || tx._id || tx.reference || 'N/A';

  const filtered = txs.filter(tx => {
    if (f !== 'All' && getStatus(tx) !== f.toLowerCase()) return false;
    if (tf === 'Money In' && getType(tx) !== 'in') return false;
    if (tf === 'Money Out' && getType(tx) !== 'out') return false;
    const c = getCounterparty(tx).toLowerCase();
    const id = getId(tx).toLowerCase();
    const s = q.toLowerCase();
    if (q && !c.includes(s) && !id.includes(s)) return false;
    return true;
  });

  const moneyIn = filtered.filter(t => getType(t)==='in' && getStatus(t)==='completed')
    .reduce((s,t) => s + Math.abs(parseFloat(String(t.amount || t.totalAmount || 0).replace(/[^0-9.-]/g,''))), 0);
  const moneyOut = filtered.filter(t => getType(t)==='out' && getStatus(t)==='completed')
    .reduce((s,t) => s + Math.abs(parseFloat(String(t.amount || t.totalAmount || 0).replace(/[^0-9.-]/g,''))), 0);

  if (loading) return <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>Loading transactions…</div>;

  return (
    <>
      {isMock && <div style={{ background:'#2D1F00', color:'var(--gold)', padding:'6px 12px', borderRadius:8, marginBottom:16, fontSize:'0.78rem' }}>⚠ Running in offline mode — transactions may be simulated.</div>}

      {/* Summary */}
      <div className="stats-row" style={{ gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div className="stat-box"><div className="value" style={{ color:'var(--success)' }}>+${moneyIn.toLocaleString()}</div><div className="label">Received</div></div>
        <div className="stat-box"><div className="value" style={{ color:'var(--danger)' }}>-${moneyOut.toLocaleString()}</div><div className="label">Sent</div></div>
        <div className="stat-box"><div className="value">${(moneyIn-moneyOut).toLocaleString()}</div><div className="label">Net</div></div>
        <div className="stat-box"><div className="value">{txs.length}</div><div className="label">Total</div></div>
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
                {filtered.map((tx, i) => (
                  <tr key={getId(tx)}>
                    <td><input type="checkbox" /></td>
                    <td style={{ fontSize:'0.75rem', color:'var(--text-dim)' }}>{getId(tx)}</td>
                    <td>{getCounterparty(tx)}</td>
                    <td style={{ fontWeight:700, color: getType(tx)==='in'?'var(--success)':'var(--text)' }}>{formatAmount(tx)}</td>
                    <td><span style={{ padding:'1px 6px', borderRadius:3, background:'var(--bg)', fontSize:'0.75rem' }}>{getProvider(tx)}</span></td>
                    <td style={{ color:'var(--text-dim)', fontSize:'0.78rem' }}>{getMethod(tx)}</td>
                    <td><Badge s={getStatus(tx)} /></td>
                    <td style={{ color:'var(--text-dim)', fontSize:'0.78rem' }}>{getDate(tx)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign:'center', padding:30, color:'var(--text-dim)' }}>No transactions found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {filtered.length > 0 && (
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 18px', borderTop:'1px solid var(--border)' }}>
            <span style={{ fontSize:'0.75rem', color:'var(--text-dim)' }}>{filtered.length} of {txs.length}</span>
            <div className="filters">
              <a className="filter-btn">←</a>
              <a className="filter-btn active">1</a>
              <a className="filter-btn">→</a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}