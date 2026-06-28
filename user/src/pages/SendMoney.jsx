import { useState } from 'react';

const recentContacts = [
  { name:'Safari Mart Wholesale',  provider:'M-Pesa',   phone:'+254 712 345 678' },
  { name:'Nile Tech Distributors', provider:'Braintree',email:'billing@niletech.ke' },
  { name:'Savannah Boutique',      provider:'PesaPal',  phone:'+254 723 456 789' },
  { name:'Serengeti Safari Lodge', provider:'M-Pesa',   phone:'+254 734 567 890' },
  { name:'Pwani Fresh Produce',    provider:'M-Pesa',   phone:'+254 745 678 901' },
];

export default function SendMoney() {
  const [tab, setTab] = useState('send');
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="grid-2" style={{ alignItems: 'start' }}>
      {/* Left: Form */}
      <div className="card">
        <div className="card-header">
          <div className="filters">
            <button className={`filter-btn ${tab === 'send' ? 'active' : ''}`} onClick={() => setTab('send')}>
              💸 Send Money
            </button>
            <button className={`filter-btn ${tab === 'request' ? 'active' : ''}`} onClick={() => setTab('request')}>
              📥 Request Money
            </button>
          </div>
        </div>
        <div className="card-body">
          <form className="send-form" onSubmit={e => e.preventDefault()}>

            {/* Recipient */}
            <div className="form-group">
              <label>Recipient</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', background: 'var(--bg-card)', color: 'var(--text)', outline: 'none' }}>
                  <option>Phone Number</option>
                  <option>Email Address</option>
                  <option>Wallet ID</option>
                </select>
              </div>
              <input type="text" placeholder="+254 712 345 678" style={{ marginTop: 8 }} />
            </div>

            {/* Amount */}
            <div className="form-group">
              <label>Amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>$</span>
                <input type="number" placeholder="0.00" style={{ paddingLeft: 32, fontSize: '1.2rem', fontWeight: 700 }} />
              </div>
              <div className="hint">Min $1.00 · Max $50,000.00</div>
            </div>

            {/* Provider */}
            <div className="form-group">
              <label>Payment Provider</label>
              <select>
                <option>M-Pesa (Recommended)</option>
                <option>Braintree</option>
                <option>PesaPal</option>
              </select>
            </div>

            {/* Note */}
            <div className="form-group">
              <label>Note (optional)</label>
              <textarea placeholder="What's this payment for?" />
            </div>

            {/* Summary */}
            <div style={{
              background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)',
              padding: '14px 16px', marginBottom: 20
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Transfer fee</span>
                <span>$1.20 (0.5%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Exchange rate</span>
                <span>1 USD = 148.50 KES</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem', borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 8 }}>
                <span>Total charged</span>
                <span style={{ color: 'var(--teal)' }}>$101.20</span>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              {tab === 'send' ? '💸 Send $100.00 Now' : '📥 Send Request'}
            </button>
          </form>
        </div>
      </div>

      {/* Right: Recent Contacts */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Contacts</h3>
          <span className="action">Manage →</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {recentContacts.map((c, i) => (
            <div
              key={i}
              onClick={() => setSelectedContact(c)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 20px', borderBottom: i < recentContacts.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer', transition: 'background 0.2s', background: selectedContact?.name === c.name ? 'var(--teal-bg)' : 'transparent'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--teal-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = selectedContact?.name === c.name ? 'var(--teal-bg)' : 'transparent'}
            >
              <div style={{
                width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', flexShrink: 0, fontWeight: 600, color: 'var(--teal)'
              }}>
                {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{c.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  {c.phone || c.email} · {c.provider}
                </div>
              </div>
              <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                onClick={e => { e.stopPropagation(); setSelectedContact(c); }}>
                Send
              </button>
            </div>
          ))}
        </div>
        <div className="card-footer" style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--teal)', cursor: 'pointer', fontWeight: 500 }}>+ Add New Contact</span>
        </div>
      </div>
    </div>
  );
}