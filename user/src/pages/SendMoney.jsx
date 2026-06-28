import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const contacts = [
  { name:'Safari Mart Wholesale',  prov:'M-Pesa',   contact:'+254 712 345 678' },
  { name:'Nile Tech Distributors', prov:'Braintree',contact:'billing@niletech.ke' },
  { name:'Savannah Boutique',      prov:'PesaPal',  contact:'+254 723 456 789' },
  { name:'Serengeti Safari Lodge', prov:'M-Pesa',   contact:'+254 734 567 890' },
];

export default function SendMoney() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('send');
  const [sel, setSel] = useState(null);

  const handleSend = (e) => {
    e.preventDefault();
    alert('✅ Payment sent! (Demo)');
    navigate('/transactions');
  };

  return (
    <div className="grid-2" style={{ alignItems:'start' }}>
      {/* Form */}
      <div className="card">
        <div className="card-header">
          <div className="filters">
            <a className={`filter-btn${mode==='send'?' active':''}`} onClick={() => setMode('send')} style={{ cursor:'pointer' }}>💸 Send</a>
            <a className={`filter-btn${mode==='request'?' active':''}`} onClick={() => setMode('request')} style={{ cursor:'pointer' }}>📥 Request</a>
          </div>
          <a className="action" onClick={() => navigate('/transactions')} style={{ cursor:'pointer', fontSize:'0.75rem' }}>History →</a>
        </div>
        <div className="card-body">
          <form onSubmit={handleSend}>
            <div className="form-group">
              <label>Recipient</label>
              <select style={{ marginBottom:6 }}>
                <option>Phone Number</option>
                <option>Email Address</option>
                <option>Wallet ID</option>
              </select>
              <input type="text" placeholder="+254 712 345 678" defaultValue={sel ? sel.contact : ''} />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontWeight:600, color:'var(--text-dim)' }}>$</span>
                <input type="number" placeholder="0.00" style={{ paddingLeft:28, fontWeight:700 }} />
              </div>
              <div className="hint">Min $1 · Max $50,000</div>
            </div>
            <div className="form-group">
              <label>Provider</label>
              <select><option>M-Pesa</option><option>Braintree</option><option>PesaPal</option></select>
            </div>
            <div className="form-group">
              <label>Note (optional)</label>
              <textarea placeholder="What's this for?" />
            </div>
            <div style={{ background:'var(--bg)', borderRadius:'var(--radius-sm)', padding:'10px 14px', marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', marginBottom:4 }}>
                <span style={{ color:'var(--text-dim)' }}>Fee</span><span>$1.20</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, borderTop:'1px solid var(--border)', paddingTop:6, marginTop:4 }}>
                <span>Total</span><span style={{ color:'var(--teal-text)' }}>$101.20</span>
              </div>
            </div>
            <button type="submit" className="btn btn-p btn-w">
              {mode==='send' ? '💸 Send Now' : '📥 Send Request'}
            </button>
          </form>
        </div>
      </div>

      {/* Contacts */}
      <div className="card">
        <div className="card-header">
          <h3>Contacts</h3>
          <a className="action" style={{ cursor:'pointer' }}>+ Add</a>
        </div>
        <div className="card-body" style={{ padding:0 }}>
          {contacts.map((c,i) => (
            <div key={i} className="contact-item" onClick={() => setSel(c)}>
              <div className="initials">{c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
              <div className="info">
                <div className="name">{c.name}</div>
                <div className="meta">{c.contact} · {c.prov}</div>
              </div>
              <button className="btn btn-sm btn-s" onClick={e => { e.stopPropagation(); setSel(c); }}>Send</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}