/**
 * Utility Functions
 * Common utility functions used across the application
 */

/**
 * Format date to readable string
 */
export function formatDateTime(date) {
    if (!date) return 'Never';
    
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than a minute ago
    if (diff < 60000) {
        return 'Just now';
    }
    
    // Less than an hour ago
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
    
    // Less than a day ago
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    
    // Format as date
    return date.toLocaleString();
}

/**
 * Format time remaining until next update
 */
export function formatTimeRemaining(seconds) {
    if (seconds <= 0) return 'Updating...';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${remainingSeconds}s`;
}

/**
 * Validate server configuration
 */
export function validateServerConfig(config) {
    const errors = [];
    
    if (!config.name || typeof config.name !== 'string') {
        errors.push('Server name is required and must be a string');
    }
    
    if (!config.apiUrl || typeof config.apiUrl !== 'string') {
        errors.push('API URL is required and must be a string');
    } else if (!isValidUrl(config.apiUrl)) {
        errors.push('API URL must be a valid URL');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Check if string is valid URL
 */
export function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Debounce function execution
 */
export function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Throttle function execution
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Deep clone object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    if (typeof obj === 'object') {
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = deepClone(obj[key]);
        });
        return cloned;
    }
}

/**
 * Generate unique ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse(jsonString, defaultValue = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.warn('JSON parse error:', error);
        return defaultValue;
    }
}

/**
 * Get storage item with JSON parsing
 */
export function getStorageItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading from localStorage key "${key}":`, error);
        return defaultValue;
    }
}

/**
 * Set storage item with JSON stringification
 */
export function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn(`Error writing to localStorage key "${key}":`, error);
        return false;
    }
}

/**
 * Remove storage item
 */
export function removeStorageItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`Error removing from localStorage key "${key}":`, error);
        return false;
    }
}

/**
 * Check if browser supports required features
 */
export function checkBrowserSupport() {
    const features = {
        fetch: typeof fetch !== 'undefined',
        localStorage: typeof localStorage !== 'undefined',
        es6Modules: typeof Symbol !== 'undefined',
        promises: typeof Promise !== 'undefined'
    };
    
    const unsupported = Object.keys(features).filter(feature => !features[feature]);
    
    return {
        supported: unsupported.length === 0,
        unsupportedFeatures: unsupported,
        features
    };
}

/**
 * Log with timestamp
 */
export function logWithTime(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    
    switch (level) {
        case 'error':
            console.error(logMessage);
            break;
        case 'warn':
            console.warn(logMessage);
            break;
        case 'debug':
            console.debug(logMessage);
            break;
        default:
            console.log(logMessage);
    }
}

/**
 * Create error object with additional context
 */
export function createError(message, code, context = {}) {
    const error = new Error(message);
    error.code = code;
    error.context = context;
    error.timestamp = new Date().toISOString();
    return error;
}

/**
 * Handle async errors with logging
 */
export function handleAsyncError(error, context = '') {
    const errorMessage = `Async error${context ? ` in ${context}` : ''}: ${error.message}`;
    logWithTime(errorMessage, 'error');
    
    // Could integrate with error tracking service here
    console.error('Full error details:', error);
}

/**
 * Retry async function with exponential backoff
 */
export async function retryWithBackoff(asyncFn, maxRetries = 3, initialDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await asyncFn();
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            
            const delay = initialDelay * Math.pow(2, attempt - 1);
            logWithTime(`Attempt ${attempt} failed, retrying in ${delay}ms...`, 'warn');
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Check if object is empty
 */
export function isEmpty(obj) {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    return Object.keys(obj).length === 0;
}