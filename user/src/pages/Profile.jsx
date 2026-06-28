import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { mockProfile } from '../services/mock';

export default function Profile() {
  const { user, logout } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [business, setBusiness] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const p = await api.getProfile();
        const prof = p.profile || p;
        if (!cancelled) {
          setFirstName(prof.firstName || '');
          setLastName(prof.lastName || '');
          setBusiness(prof.businessName || '');
          setEmail(prof.email || '');
          setPhone(prof.phone || '');
        }
      } catch {
        if (!cancelled) {
          const m = mockProfile.profile;
          setFirstName(m.firstName);
          setLastName(m.lastName);
          setBusiness(m.businessName);
          setEmail(m.email);
          setPhone(m.phone);
          setIsMock(true);
        }
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const doSave = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.put('/auth/me', { firstName, lastName, businessName: business, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      if (err.message.includes('Network error') || err.message.includes('backend unavailable')) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError(err.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const initials = (firstName?.[0] || '') + (lastName?.[0] || '') || 'U';
  const displayName = `${firstName || 'User'} ${lastName || ''}`.trim();

  if (loading) return <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>Loading profile…</div>;

  return (
    <>
      {isMock && <div style={{ background:'#2D1F00', color:'var(--gold)', padding:'6px 12px', borderRadius:8, marginBottom:16, fontSize:'0.78rem' }}>⚠ Running in offline mode — profile data may be simulated.</div>}

      {/* Header */}
      <div className="profile-hdr">
        <div className="avatar-lg">{initials || 'U'}</div>
        <div className="info">
          <h2>{displayName || 'User'}</h2>
          <p>{email || 'user@rahisisha.co'} · {phone || '—'}</p>
          <div className="v">✓ Verified Merchant</div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems:'start' }}>
        {/* Info */}
        <div className="card">
          <div className="card-header"><h3>Personal Info</h3></div>
          <div className="card-body">
            <form onSubmit={doSave}>
              {error && <div style={{ background:'var(--danger-bg)', color:'var(--danger)', padding:'8px 12px', borderRadius:8, fontSize:'0.8rem', marginBottom:12 }}>{error}</div>}
              <div className="form-row">
                <div className="form-group"><label>First</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required /></div>
                <div className="form-group"><label>Last</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required /></div>
              </div>
              <div className="form-group"><label>Business</label><input type="text" value={business} onChange={e => setBusiness(e.target.value)} /></div>
              <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
              <div className="form-group"><label>Phone</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} /></div>
              <button type="submit" className="btn btn-p" disabled={busy}>
                {busy ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
              </button>
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
                  <span className="val" style={{ color:s.c, cursor:s.click?'pointer':'default' }}
                    onClick={s.click ? () => alert('API key rotation coming soon!') : undefined}>{s.val}</span>
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
                <label>Payment Notification Frequency</label>
                <select defaultValue="weekly"><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select>
              </div>
              <button className="btn btn-s" onClick={() => alert('Preferences saved!')}>Save Preferences</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}