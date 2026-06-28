import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Wallets from './pages/Wallets';
import Analytics from './pages/Analytics';

const pageMeta = {
  dashboard:   { title: 'Dashboard',      subtitle: 'Real-time overview of your payment platform' },
  transactions:{ title: 'Transactions',   subtitle: 'Monitor and manage all payment transactions' },
  wallets:     { title: 'Wallets',         subtitle: 'Manage merchant wallets and balances' },
  analytics:   { title: 'Analytics',      subtitle: 'Deep insights into payment performance' },
};

function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="main-inner">
          <Routes>
            <Route path="/" element={<PageWrap meta={pageMeta.dashboard}><Dashboard /></PageWrap>} />
            <Route path="/transactions" element={<PageWrap meta={pageMeta.transactions}><Transactions /></PageWrap>} />
            <Route path="/wallets" element={<PageWrap meta={pageMeta.wallets}><Wallets /></PageWrap>} />
            <Route path="/analytics" element={<PageWrap meta={pageMeta.analytics}><Analytics /></PageWrap>} />
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