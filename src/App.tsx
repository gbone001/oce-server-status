import React from 'react';
import { ServerProvider, useServerContext } from './context/ServerContext';
import { ServerTable } from './components/ServerTable';
import { RefreshTimer } from './components/RefreshTimer';
import './App.css';

const AppContent: React.FC = () => {
  const { servers, loading, error, lastRefresh, refreshServers } = useServerContext();

  const handleRefresh = async () => {
    await refreshServers();
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="anzr-logo">
              <div className="logo-text">ANZR</div>
              <div className="logo-subtitle">OCE Server Status</div>
            </div>
          </div>
          
          <div className="status-summary">
            <div className="summary-item">
              <span className="summary-label">Servers:</span>
              <span className="summary-value">{servers.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Online:</span>
              <span className="summary-value online">
                {servers.filter(s => s.status?.online).length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Players:</span>
              <span className="summary-value">
                {servers.reduce((total, s) => total + (s.status?.playerCount || 0), 0)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="App-main">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Server Status Dashboard</h1>
            <RefreshTimer
              lastRefresh={lastRefresh}
              onRefresh={handleRefresh}
              intervalMs={60000}
            />
          </div>

          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <div className="error-text">
                <strong>Error:</strong> {error}
              </div>
              <button className="retry-button" onClick={handleRefresh}>
                Retry
              </button>
            </div>
          )}

          <ServerTable 
            servers={servers} 
            loading={loading}
            className="main-server-table"
          />
        </div>
      </main>

      <footer className="App-footer">
        <div className="footer-content">
          <p>&copy; 2024 ANZR - Australian/New Zealand Region Gaming Community</p>
          <div className="footer-links">
            <span className="footer-link">Discord</span>
            <span className="footer-link">Steam Group</span>
            <span className="footer-link">GitHub</span>
          </div>
        </div>
      </footer>
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
