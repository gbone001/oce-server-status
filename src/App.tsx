import React from 'react';
import { ServerProvider } from './context/ServerContext';
import { useServerContext } from './context/ServerContext';
import { ServerTable } from './components/ServerTable';
import { RefreshTimer } from './components/RefreshTimer';
import './App.css';

const AppContent: React.FC = () => {
  const { servers, loading, lastRefresh, refreshData } = useServerContext();

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-placeholder">ANZR</div>
              <div className="header-text">
                <h1>Server Status Dashboard</h1>
                <p>Real-time OCE server monitoring</p>
              </div>
            </div>
          </div>
        </header>

        <main className="app-main">
          <RefreshTimer
            lastRefresh={lastRefresh}
            onRefresh={refreshData}
            refreshInterval={60000}
          />
          
          <ServerTable servers={servers} loading={loading} />
        </main>

        <footer className="app-footer">
          <p>&copy; 2024 ANZR Gaming Community. Built for OCE Hell Let Loose servers.</p>
        </footer>
      </div>
    </div>
  );
};

function App() {
  return (
    <ServerProvider>
      <AppContent />
    </ServerProvider>
  );
}

export default App;
