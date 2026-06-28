import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Routes>
      {/* Auth landing — no sidebar */}
      <Route path="/" element={<Auth />} />

      {/* Dashboard routes — with sidebar + header */}
      <Route path="/overview"     element={<DashboardWrap meta={pageMeta.overview}><Overview /></DashboardWrap>} />
      <Route path="/send"         element={<DashboardWrap meta={pageMeta.send}><SendMoney /></DashboardWrap>} />
      <Route path="/transactions" element={<DashboardWrap meta={pageMeta.transactions}><Transactions /></DashboardWrap>} />
      <Route path="/payment-links" element={<DashboardWrap meta={pageMeta.links}><PaymentLinks /></DashboardWrap>} />
      <Route path="/profile"      element={<DashboardWrap meta={pageMeta.profile}><Profile /></DashboardWrap>} />
    </Routes>
  );
}

function DashboardWrap({ meta, children }) {
  return (
    <div className="layout">
      <Sidebar />
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