import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
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
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="main-inner">
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview"     element={<PageWrap meta={pageMeta.overview}><Overview /></PageWrap>} />
            <Route path="/send"         element={<PageWrap meta={pageMeta.send}><SendMoney /></PageWrap>} />
            <Route path="/transactions" element={<PageWrap meta={pageMeta.transactions}><Transactions /></PageWrap>} />
            <Route path="/payment-links" element={<PageWrap meta={pageMeta.links}><PaymentLinks /></PageWrap>} />
            <Route path="/profile"      element={<PageWrap meta={pageMeta.profile}><Profile /></PageWrap>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function PageWrap({ meta, children }) {
  return (
    <>
      <Header title={meta.title} subtitle={meta.subtitle} />
      {children}
    </>
  );
}

export default App;