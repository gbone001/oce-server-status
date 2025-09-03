import { AppConfig } from '../types';

export const defaultConfig: AppConfig = {
  pollInterval: 60000, // 1 minute in milliseconds
  theme: {
    isDark: false
  }
};

export const API_ENDPOINTS = {
  SERVERS_CONFIG: '/servers.json'
};

export const COLORS = {
  primary: '#dc2626', // red
  secondary: '#fbbf24', // gold
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b'
};