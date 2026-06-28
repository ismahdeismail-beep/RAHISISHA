import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('jane@rahisisha.co');
  const [password, setPassword] = useState('password123');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // If already logged in, redirect
  if (isAuthenticated) { navigate('/overview', { replace: true }); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ firstName, lastName, email, password });
        // Auto-login after register
        await login(email, password);
      }
      navigate('/overview');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">R</div>
          <h1><span>RAHI</span>SHISHA</h1>
          <p>Unified Payment Platform for Africa</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab${mode === 'login' ? ' active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
          <button className={`auth-tab${mode === 'signup' ? ' active' : ''}`} onClick={() => { setMode('signup'); setError(''); }}>Sign Up</button>
        </div>

        {error && <div style={{ background:'var(--danger-bg)', color:'var(--danger)', padding:'8px 12px', borderRadius:'8px', fontSize:'0.8rem', marginBottom:16 }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="auth-row">
              <div className="auth-field">
                <label>First Name</label>
                <input type="text" placeholder="Jane" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
              <div className="auth-field">
                <label>Last Name</label>
                <input type="text" placeholder="Mwangi" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>

          {mode === 'login' && (
            <a href="#forgot" className="auth-forgot" onClick={e => { e.preventDefault(); alert('Reset link sent!'); }}>Forgot password?</a>
          )}

          <button type="submit" className="auth-btn" disabled={busy}>
            {busy ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider"><span>or continue with</span></div>

        <button className="auth-google" onClick={() => { setBusy(true); login('google@demo.com', 'demo').then(() => navigate('/overview')).catch(() => setBusy(false)); }}>
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
            <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
            <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
            <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
          </svg>
          Continue with Google
        </button>

        <p className="auth-footer">
          {mode === 'login'
            ? <>By signing in, you agree to our <a href="#terms" onClick={e => e.preventDefault()}>Terms</a> & <a href="#privacy" onClick={e => e.preventDefault()}>Privacy Policy</a></>
            : <>Already have an account? <a href="#login" onClick={e => { e.preventDefault(); setMode('login'); }}>Sign in</a></>}
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 20px; position: relative; overflow: hidden; background: var(--bg);
        }
        .auth-orb { position: fixed; border-radius: 50%; filter: blur(100px); opacity: 0.15; pointer-events: none; }
        .auth-orb-1 { width: 400px; height: 400px; top: -10%; left: -10%; background: var(--teal); }
        .auth-orb-2 { width: 350px; height: 350px; bottom: -10%; right: -10%; background: var(--purple); }
        .auth-orb-3 { width: 250px; height: 250px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--gold); opacity: 0.08; }
        .auth-card {
          width: 100%; max-width: 400px; background: var(--bg-elevated);
          border: 1px solid var(--border); border-radius: 16px;
          padding: 36px 32px 28px; position: relative; z-index: 1;
        }
        .auth-brand { text-align: center; margin-bottom: 28px; }
        .auth-logo {
          width: 48px; height: 48px; border-radius: 14px;
          background: linear-gradient(135deg, var(--teal), var(--purple));
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 10px;
        }
        .auth-brand h1 { font-size: 1.2rem; font-weight: 700; color: var(--text); }
        .auth-brand h1 span { color: var(--teal-text); }
        .auth-brand p { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }
        .auth-tabs { display: flex; background: var(--bg); border-radius: 10px; padding: 3px; margin-bottom: 24px; }
        .auth-tab { flex: 1; padding: 8px; border: none; background: transparent; border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
        .auth-tab.active { background: var(--bg-card); color: var(--text); }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .auth-field { display: flex; flex-direction: column; gap: 4px; }
        .auth-field label { font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); }
        .auth-field input {
          width: 100%; padding: 10px 14px; border: 1px solid var(--border);
          border-radius: 10px; font-size: 0.88rem;
          background: var(--bg); color: var(--text); outline: none; transition: border-color 0.2s;
        }
        .auth-field input:focus { border-color: var(--teal); }
        .auth-field input::placeholder { color: var(--text-dim); }
        .auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .auth-forgot { text-align: right; font-size: 0.78rem; color: var(--teal-text); text-decoration: none; font-weight: 500; margin-top: -4px; cursor: pointer; }
        .auth-forgot:hover { text-decoration: underline; }
        .auth-btn {
          width: 100%; padding: 11px; border: none; border-radius: 10px;
          background: var(--teal); color: #fff; font-size: 0.9rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s; margin-top: 4px;
        }
        .auth-btn:hover { background: var(--teal-text); color: #08080F; }
        .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: var(--text-dim); font-size: 0.75rem; }
        .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .auth-google {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 10px; border: 1px solid var(--border); border-radius: 10px;
          background: transparent; color: var(--text); font-size: 0.85rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .auth-google:hover { background: var(--bg-card); border-color: var(--border-hover); }
        .auth-footer { text-align: center; font-size: 0.72rem; color: var(--text-dim); margin-top: 20px; line-height: 1.5; }
        .auth-footer a { color: var(--teal-text); text-decoration: none; cursor: pointer; }
        .auth-footer a:hover { text-decoration: underline; }
        @media (max-width: 480px) {
          .auth-card { padding: 24px 20px; border-radius: 12px; margin: 10px; }
          .auth-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}