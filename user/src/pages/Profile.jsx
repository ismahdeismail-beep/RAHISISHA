import { useState } from 'react';

export default function Profile() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">JM</div>
        <div className="profile-info">
          <h2>Jane Mwangi</h2>
          <p>jane.mwangi@rahisisha.co · +254 712 345 678</p>
          <div className="verified">✓ Verified Merchant</div>
        </div>
        <button className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Change Photo</button>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Personal Info */}
        <div className="card">
          <div className="card-header">
            <h3>Personal Information</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" defaultValue="Jane" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" defaultValue="Mwangi" />
                </div>
              </div>
              <div className="form-group">
                <label>Business Name</label>
                <input type="text" defaultValue="Mwangi Enterprises Ltd" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" defaultValue="jane.mwangi@rahisisha.co" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" defaultValue="+254 712 345 678" />
              </div>
              <button type="submit" className="btn btn-primary">
                {saved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Security & Preferences */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <h3>Security</h3>
            </div>
            <div className="card-body">
              {[
                { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', status: 'Enabled', color: 'var(--success)' },
                { label: 'PIN Code', desc: 'Used for transaction confirmations', status: 'Set', color: 'var(--success)' },
                { label: 'Transaction Alerts', desc: 'Email & SMS notifications', status: 'Active', color: 'var(--success)' },
                { label: 'API Key', desc: 'For integrations and webhooks', status: 'Regenerate', color: 'var(--teal)' },
              ].map((s, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                  flexWrap: 'wrap', gap: 8
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{s.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: s.color }}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Defaults */}
          <div className="card">
            <div className="card-header">
              <h3>Payment Preferences</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Default Provider</label>
                <select defaultValue="mpesa">
                  <option value="mpesa">M-Pesa (Recommended)</option>
                  <option value="braintree">Braintree</option>
                  <option value="pesapal">PesaPal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select defaultValue="usd">
                  <option value="usd">USD — US Dollar</option>
                  <option value="kes">KES — Kenyan Shilling</option>
                  <option value="eur">EUR — Euro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Statement Frequency</label>
                <select defaultValue="weekly">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}