import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { mockBalance, mockTransactions, mockPaymentLinks } from '../services/mock';

function StatusBadge({ s }) {
  return <span className={`status ${s}`}><span className="dot" />{s.charAt(0).toUpperCase()+s.slice(1)}</span>;
}

export default function Overview() {
  const navigate = useNavigate();
  const [showBal, setShowBal] = useState(true);
  const [balance, setBalance] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      let mock = false;

      // Try balance
      try {
        const b = await api.getBalance();
        if (!cancelled) setBalance(b);
      } catch {
        if (!cancelled) { setBalance(mockBalance); mock = true; }
      }

      // Try dashboard stats
      try {
        const d = await api.getDashboardStats();
        if (!cancelled) setStats(d);
      } catch {
        // fallback: derive stats from mock
        if (!cancelled) {
          setStats({
            totalTransactions: 1247,
            totalReceived: 342000,
            activeLinks: 4,
            rating: 4.9,
            spendingByProvider: [
              { name:'M-Pesa', percentage:58, amount:198000, color:'#0D9488' },
              { name:'Braintree', percentage:25, amount:85000, color:'#D4A843' },
              { name:'PesaPal', percentage:17, amount:58000, color:'#4C2A9E' },
            ]
          });
        }
      }

      // Try recent payments
      try {
        const p = await api.get('/payments?limit=5');
        const tx = p.data?.payments || p.data || [];
        if (!cancelled) setRecentTx(tx);
      } catch {
        if (!cancelled) { setRecentTx(mockTransactions.slice(0,5)); mock = true; }
      }

      if (!cancelled) { setIsMock(mock); setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>Loading your dashboard…</div>;

  return (
    <>
      {isMock && <div style={{ background:'#2D1F00', color:'var(--gold)', padding:'6px 12px', borderRadius:8, marginBottom:16, fontSize:'0.78rem' }}>⚠ Running in offline mode — some data may be simulated.</div>}

      {/* Balance Card */}
      <div className="balance-card anim">
        <div className="top">
          <div>
            <div className="label">Available Balance</div>
            <div className="amount">
              {showBal
                ? `$${(balance?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                : '••••••'}
              <button className="eye-btn" onClick={() => setShowBal(!showBal)} aria-label="Toggle balance">
                {showBal ? '🙈' : '👁️'}
              </button>
            </div>
            {balance?.change && <div className="change"><span>▲ +${balance.change.toLocaleString()}</span> this month</div>}
            {!balance?.change && <div className="change"><span>▲ +$12,430 (4.6%)</span> this month</div>}
          </div>
        </div>
        <div className="actions">
          <button className="btn-p" onClick={() => navigate('/send')}>💸 Send</button>
          <button className="btn-s" onClick={() => navigate('/send')}>📥 Request</button>
          <button className="btn-s" onClick={() => alert('Statement download coming soon!')}>📄 Statement</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { icon:'💳', val: (stats?.totalTransactions || 1247).toLocaleString(), label:'Transactions (30d)' },
          { icon:'📈', val: '$' + (stats?.totalReceived || 342000).toLocaleString(), label:'Total Received' },
          { icon:'🔗', val: String(stats?.activeLinks || 4), label:'Active Links' },
          { icon:'⭐', val: String(stats?.rating || 4.9), label:'Rating' },
        ].map((s,i) => (
          <div key={i} className={`stat-box anim anim-${i+1}`}>
            <span className="icon">{s.icon}</span>
            <div className="value">{s.val}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity + Spending */}
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
                    <tr key={tx.id || tx._id} style={{ cursor:'pointer' }} onClick={() => navigate('/transactions')}>
                      <td style={{ fontSize:'0.75rem', color:'var(--text-dim)' }}>{tx.id || tx._id || 'N/A'}</td>
                      <td style={{ maxWidth:130, overflow:'hidden', textOverflow:'ellipsis' }}>{tx.counterparty || tx.to || tx.recipient?.name || 'Unknown'}</td>
                      <td style={{ fontWeight:600, color: (tx.type==='in' || tx.amount?.startsWith('+')) ? 'var(--success)' : 'var(--text)' }}>
                        {tx.amount || `$${Math.abs(tx.totalAmount || 0).toLocaleString()}`}
                      </td>
                      <td><StatusBadge s={tx.status || tx.st || 'pending'} /></td>
                    </tr>
                  ))}
                  {recentTx.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign:'center', padding:20, color:'var(--text-dim)' }}>No transactions yet</td></tr>
                  )}
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
            {(stats?.spendingByProvider || [
              { name:'M-Pesa',   percentage:58, amount:198000, color:'#0D9488' },
              { name:'Braintree',percentage:25, amount:85000, color:'#D4A843' },
              { name:'PesaPal',  percentage:17, amount:58000, color:'#4C2A9E' },
            ]).map(p => (
              <div key={p.name} className="prov-bar">
                <div className="row">
                  <span>{p.name}</span>
                  <span>${(p.amount || 0).toLocaleString()} ({p.percentage}%)</span>
                </div>
                <div className="track"><div className="fill" style={{ width:`${p.percentage}%`, background:p.color }} /></div>
              </div>
            ))}
            <div className="tip-box">
              <div className="head">💡 Tip</div>
              <div className="body">M-Pesa Paybill saves 1.2% vs card payments.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Links */}
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
                {mockPaymentLinks.filter(l=>l.status==='active').slice(0,4).map((l,i) => (
                  <tr key={i} style={{ cursor:'pointer' }} onClick={() => navigate('/payment-links')}>
                    <td style={{ fontWeight:500 }}>{l.description}</td>
                    <td style={{ fontWeight:600 }}>{l.amount}</td>
                    <td><span className={`status ${l.status}`}><span className="dot" />{l.status.charAt(0).toUpperCase()+l.status.slice(1)}</span></td>
                    <td style={{ color:'var(--text-dim)', fontSize:'0.78rem' }}>{l.created}</td>
                    <td style={{ fontWeight:600 }}>{l.payments}</td>
                  </tr>
                ))}
                {mockPaymentLinks.filter(l=>l.status==='active').length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign:'center', padding:20, color:'var(--text-dim)' }}>No active payment links</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}