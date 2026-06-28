import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Auth from './pages/Auth';
import Overview from './pages/Overview';
import SendMoney from './pages/SendMoney';
import Transactions from './pages/Transactions';
import PaymentLinks from './pages/PaymentLinks';
import Profile from './pages/Profile';

const pageMeta = {
  overview:     { title: 'Overview',        subtitle: 'Your account at a glance' },
  send:         { title: 'Send Money',      subtitle: 'Transfer funds instantly' },
  transactions: { title: 'Transactions',    subtitle: 'View your payment history' },
  links:        { title: 'Payment Links',   subtitle: 'Create and share payment links' },
  profile:      { title: 'Profile',         subtitle: 'Manage your account settings' },
};

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="auth-page" style={{ justifyContent:'center', alignItems:'center' }}><div style={{ color:'var(--text-muted)' }}>Loading...</div></div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />

      <Route path="/overview"     element={<ProtectedRoute><DashboardWrap meta={pageMeta.overview}><Overview /></DashboardWrap></ProtectedRoute>} />
      <Route path="/send"         element={<ProtectedRoute><DashboardWrap meta={pageMeta.send}><SendMoney /></DashboardWrap></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><DashboardWrap meta={pageMeta.transactions}><Transactions /></DashboardWrap></ProtectedRoute>} />
      <Route path="/payment-links" element={<ProtectedRoute><DashboardWrap meta={pageMeta.links}><PaymentLinks /></DashboardWrap></ProtectedRoute>} />
      <Route path="/profile"      element={<ProtectedRoute><DashboardWrap meta={pageMeta.profile}><Profile /></DashboardWrap></ProtectedRoute>} />
    </Routes>
  );
}

function DashboardWrap({ meta, children }) {
  const { user, logout } = useAuth();
  return (
    <div className="layout">
      <Sidebar user={user} onLogout={logout} />
      <main className="main-content">
        <div className="main-inner">
          <Header title={meta.title} subtitle={meta.subtitle} />
          {children}
        </div>
      </main>
    </div>
  );
}

export default App;