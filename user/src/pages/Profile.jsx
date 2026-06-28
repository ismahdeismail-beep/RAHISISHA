import { useState } from 'react';

export default function Profile() {
  const [saved, setSaved] = useState(false);

  const doSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      {/* Header */}
      <div className="profile-hdr">
        <div className="avatar-lg">JM</div>
        <div className="info">
          <h2>Jane Mwangi</h2>
          <p>jane.mwangi@rahisisha.co · +254 712 345 678</p>
          <div className="v">✓ Verified Merchant</div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems:'start' }}>
        {/* Info */}
        <div className="card">
          <div className="card-header"><h3>Personal Info</h3></div>
          <div className="card-body">
            <form onSubmit={doSave}>
              <div className="form-row">
                <div className="form-group"><label>First</label><input type="text" defaultValue="Jane" /></div>
                <div className="form-group"><label>Last</label><input type="text" defaultValue="Mwangi" /></div>
              </div>
              <div className="form-group"><label>Business</label><input type="text" defaultValue="Mwangi Enterprises Ltd" /></div>
              <div className="form-group"><label>Email</label><input type="email" defaultValue="jane@rahisisha.co" /></div>
              <div className="form-group"><label>Phone</label><input type="tel" defaultValue="+254 712 345 678" /></div>
              <button type="submit" className="btn btn-p">{saved ? '✓ Saved' : 'Save Changes'}</button>
            </form>
          </div>
        </div>

        {/* Security + Prefs */}
        <div>
          <div className="card" style={{ marginBottom:16 }}>
            <div className="card-header"><h3>Security</h3></div>
            <div className="card-body">
              {[
                { label:'2FA',            desc:'Extra security layer',            val:'On',     c:'var(--success)' },
                { label:'PIN Code',       desc:'Transaction confirmations',      val:'Set',    c:'var(--success)' },
                { label:'Alerts',         desc:'Email & SMS',                    val:'Active', c:'var(--success)' },
                { label:'API Key',        desc:'For integrations',               val:'Rotate', c:'var(--teal-text)', click:true },
              ].map((s,i) => (
                <div key={i} className="sec-row">
                  <div><div className="lbl">{s.label}</div><div className="dsc">{s.desc}</div></div>
                  <span className="val" style={{ color:s.c, cursor:s.click?'pointer':'default' }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Preferences</h3></div>
            <div className="card-body">
              <div className="form-group">
                <label>Default Provider</label>
                <select defaultValue="mpesa"><option value="mpesa">M-Pesa</option><option value="bt">Braintree</option><option value="pp">PesaPal</option></select>
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select defaultValue="usd"><option value="usd">USD</option><option value="kes">KES</option><option value="eur">EUR</option></select>
              </div>
              <div className="form-group">
                <label>Statements</label>
                <select defaultValue="weekly"><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select>
              </div>
              <button className="btn btn-s" onClick={doSave}>Save Preferences</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}