/**
 * Main Application Controller
 * Coordinates all components and manages the application lifecycle
 */

import ConfigManager from './config.js';
import DataFetcher from './dataFetcher.js';
import TableRenderer from './tableRenderer.js';
import { formatDateTime, formatTimeRemaining, handleAsyncError, logWithTime, checkBrowserSupport } from './utils.js';

class App {
    constructor() {
        this.configManager = new ConfigManager();
        this.dataFetcher = new DataFetcher(this.configManager);
        this.tableRenderer = new TableRenderer();
        
        this.updateTimer = null;
        this.countdown = 60; // seconds until next update
        this.countdownTimer = null;
        
        this.isInitialized = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        // DOM elements
        this.lastUpdatedElement = document.getElementById('last-updated');
        this.nextUpdateElement = document.getElementById('next-update');
        
        // Bind methods to preserve context
        this.handleDataUpdate = this.handleDataUpdate.bind(this);
        this.handleError = this.handleError.bind(this);
        this.updateCountdown = this.updateCountdown.bind(this);
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            logWithTime('Initializing OCE Server Status application...');
            
            // Check browser support
            const browserCheck = checkBrowserSupport();
            if (!browserCheck.supported) {
                throw new Error(`Browser not supported. Missing features: ${browserCheck.unsupportedFeatures.join(', ')}`);
            }
            
            // Show loading state
            this.tableRenderer.showLoading();
            
            // Load configuration
            await this.configManager.loadConfig();
            logWithTime(`Configuration loaded: ${this.configManager.getServers().length} servers`);
            
            // Set up data fetcher event handling
            this.setupEventListeners();
            
            // Start data polling
            this.dataFetcher.startPolling(1); // Poll every 1 minute
            
            // Start countdown timer
            this.startCountdownTimer();
            
            // Handle page visibility changes
            this.setupVisibilityHandling();
            
            this.isInitialized = true;
            logWithTime('Application initialized successfully');
            
        } catch (error) {
            this.handleError(error, 'initialization');
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for data updates
        this.dataFetcher.fetchAllServersData = this.wrapDataFetch(this.dataFetcher.fetchAllServersData.bind(this.dataFetcher));
        
        // Handle window events
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        // Handle online/offline events
        window.addEventListener('online', () => {
            logWithTime('Connection restored, resuming polling');
            if (!this.dataFetcher.isCurrentlyPolling()) {
                this.dataFetcher.startPolling(1);
            }
        });
        
        window.addEventListener('offline', () => {
            logWithTime('Connection lost, polling will continue but may fail');
        });
    }

    /**
     * Wrap data fetch to handle updates
     */
    wrapDataFetch(originalFetch) {
        return async (...args) => {
            try {
                const data = await originalFetch(...args);
                this.handleDataUpdate(data);
                return data;
            } catch (error) {
                this.handleError(error, 'data fetching');
                throw error;
            }
        };
    }

    /**
     * Handle successful data updates
     */
    handleDataUpdate(serverData) {
        logWithTime(`Data updated for ${serverData.length} servers`);
        
        // Reset retry count on successful update
        this.retryCount = 0;
        
        // Update the table
        if (this.isInitialized) {
            this.tableRenderer.updateTable(serverData);
        } else {
            this.tableRenderer.renderTable(serverData);
            this.isInitialized = true;
        }
        
        // Update last updated time
        this.updateLastUpdatedTime();
        
        // Reset countdown
        this.resetCountdown();
    }

    /**
     * Handle errors
     */
    handleError(error, context = '') {
        handleAsyncError(error, context);
        
        this.retryCount++;
        
        if (this.retryCount <= this.maxRetries) {
            logWithTime(`Retry attempt ${this.retryCount}/${this.maxRetries}`, 'warn');
            
            // Show error message but continue trying
            if (this.isInitialized) {
                this.tableRenderer.showError(`Connection issues. Retrying... (${this.retryCount}/${this.maxRetries})`);
            }
        } else {
            // Max retries reached
            const errorMessage = `Failed to load server data after ${this.maxRetries} attempts. Please check your connection.`;
            this.tableRenderer.showError(errorMessage);
            logWithTime(errorMessage, 'error');
        }
    }

    /**
     * Update last updated time display
     */
    updateLastUpdatedTime() {
        if (this.lastUpdatedElement) {
            const lastFetch = this.dataFetcher.getLastFetchTime();
            this.lastUpdatedElement.textContent = `Last updated: ${formatDateTime(lastFetch)}`;
        }
    }

    /**
     * Start countdown timer for next update
     */
    startCountdownTimer() {
        this.countdownTimer = setInterval(this.updateCountdown, 1000);
    }

    /**
     * Update countdown display
     */
    updateCountdown() {
        if (this.nextUpdateElement) {
            this.nextUpdateElement.textContent = `Next update in: ${formatTimeRemaining(this.countdown)}`;
        }
        
        this.countdown--;
        
        if (this.countdown < 0) {
            this.resetCountdown();
        }
    }

    /**
     * Reset countdown timer
     */
    resetCountdown() {
        this.countdown = 60; // Reset to 60 seconds
    }

    /**
     * Handle page visibility changes to optimize polling
     */
    setupVisibilityHandling() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, could reduce polling frequency
                logWithTime('Page hidden, continuing normal polling');
            } else {
                // Page is visible, ensure normal polling
                logWithTime('Page visible, ensuring normal polling');
                
                // Trigger immediate update if it's been more than 2 minutes
                const lastFetch = this.dataFetcher.getLastFetchTime();
                if (lastFetch && Date.now() - lastFetch.getTime() > 120000) {
                    logWithTime('Triggering immediate update after long absence');
                    this.dataFetcher.fetchAllServersData();
                }
            }
        });
    }

    /**
     * Refresh data manually
     */
    async refreshData() {
        try {
            logWithTime('Manual refresh requested');
            this.tableRenderer.showLoading();
            await this.dataFetcher.fetchAllServersData();
            this.resetCountdown();
        } catch (error) {
            this.handleError(error, 'manual refresh');
        }
    }

    /**
     * Get application status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            polling: this.dataFetcher.isCurrentlyPolling(),
            serverCount: this.configManager.getServers().length,
            lastUpdate: this.dataFetcher.getLastFetchTime(),
            retryCount: this.retryCount,
            nextUpdateIn: this.countdown
        };
    }

    /**
     * Add server configuration dynamically
     */
    async addServer(serverConfig) {
        try {
            const validation = this.configManager.validateServerConfig(serverConfig);
            if (!validation.isValid) {
                throw new Error(`Invalid server configuration: ${validation.errors.join(', ')}`);
            }
            
            this.configManager.addServer(serverConfig);
            logWithTime(`Added server: ${serverConfig.name}`);
            
            // Trigger immediate refresh to include new server
            await this.refreshData();
            
            return true;
        } catch (error) {
            handleAsyncError(error, 'adding server');
            return false;
        }
    }

    /**
     * Remove server configuration
     */
    async removeServer(serverName) {
        try {
            const removed = this.configManager.removeServer(serverName);
            if (removed) {
                logWithTime(`Removed server: ${serverName}`);
                await this.refreshData();
                return true;
            }
            return false;
        } catch (error) {
            handleAsyncError(error, 'removing server');
            return false;
        }
    }

    /**
     * Export current configuration
     */
    exportConfig() {
        return {
            servers: this.configManager.getServers(),
            exportTime: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    /**
     * Clean up resources
     */
    cleanup() {
        logWithTime('Cleaning up application resources');
        
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
        
        this.dataFetcher.stopPolling();
        this.dataFetcher.clearCache();
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Create global app instance
    window.serverStatusApp = new App();
    
    try {
        await window.serverStatusApp.init();
    } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // Show user-friendly error message
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = `
                <div class="error-state">
                    <h3>Failed to Load</h3>
                    <p>Unable to initialize the server status application.</p>
                    <p>Please refresh the page or check your connection.</p>
                    <button onclick="location.reload()" style="margin-top: 10px; padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Retry
                    </button>
                </div>
            `;
        }
    }
});

// Export for potential external access
export default App;