/**
 * Configuration Manager
 * Handles loading and managing server configurations
 */

class ConfigManager {
    constructor() {
        this.servers = [];
        this.configLoaded = false;
    }

    /**
     * Load server configuration from JSON file
     */
    async loadConfig() {
        try {
            const response = await fetch('config/servers.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const config = await response.json();
            this.servers = config.servers || [];
            this.configLoaded = true;
            
            console.log(`Loaded configuration for ${this.servers.length} servers`);
            return this.servers;
        } catch (error) {
            console.error('Failed to load server configuration:', error);
            throw new Error('Failed to load server configuration');
        }
    }

    /**
     * Get all configured servers
     */
    getServers() {
        return this.servers;
    }

    /**
     * Get server by name
     */
    getServerByName(name) {
        return this.servers.find(server => server.name === name);
    }

    /**
     * Add a new server to the configuration
     * Note: This only adds to memory, not to the JSON file
     */
    addServer(serverConfig) {
        if (!serverConfig.name || !serverConfig.apiUrl) {
            throw new Error('Server must have name and apiUrl');
        }
        
        this.servers.push(serverConfig);
        console.log(`Added server: ${serverConfig.name}`);
    }

    /**
     * Remove server by name
     * Note: This only removes from memory, not from the JSON file
     */
    removeServer(name) {
        const index = this.servers.findIndex(server => server.name === name);
        if (index !== -1) {
            this.servers.splice(index, 1);
            console.log(`Removed server: ${name}`);
            return true;
        }
        return false;
    }

    /**
     * Check if configuration is loaded
     */
    isConfigLoaded() {
        return this.configLoaded;
    }

    /**
     * Validate server configuration
     */
    validateServerConfig(config) {
        const requiredFields = ['name', 'apiUrl'];
        const errors = [];

        for (const field of requiredFields) {
            if (!config[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        }

        if (config.apiUrl && !this.isValidUrl(config.apiUrl)) {
            errors.push('Invalid API URL format');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Utility function to validate URL format
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}

export default ConfigManager;