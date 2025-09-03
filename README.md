# OCE Server Status Dashboard

A clean, modular React/TypeScript dashboard for monitoring OCE server status and player counts in real-time.

## Features

- **Real-time Monitoring**: Polls server APIs every 1 minute for up-to-date information
- **Comprehensive Display**: Shows server name, player counts (Allies/Axis), game time, scores (0-5 points), current map, and next map
- **Status Indicators**: Clear visual indicators for server status (online/offline) with error details
- **Last Refresh Timer**: Shows when data was last updated with manual refresh option
- **Dark Mode**: Toggle between light and dark themes with red and gold accent colors
- **Responsive Design**: Clean, simple interface that works on all devices
- **Modular Architecture**: Well-organized React/TypeScript components for easy maintenance

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gbone001/oce-server-status.git
   cd oce-server-status
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Configuration

### Updating Server List

Edit the `public/servers.json` file to add, remove, or modify servers:

```json
{
  "servers": [
    {
      "id": "unique-server-id",
      "name": "Display Name",
      "apiUrl": "https://api.example.com/server/status"
    }
  ]
}
```

**Server Configuration Fields:**
- `id`: Unique identifier for the server
- `name`: Display name shown in the dashboard
- `apiUrl`: API endpoint that returns server status data

### Expected API Response Format

Your server APIs should return JSON in the following format:

```json
{
  "alliesPlayers": 15,
  "axisPlayers": 12,
  "gameTime": "45:23",
  "alliesScore": 3,
  "axisScore": 2,
  "currentMap": "Carentan",
  "nextMap": "Foy"
}
```

**API Response Fields:**
- `alliesPlayers`: Number of players on Allies team
- `axisPlayers`: Number of players on Axis team
- `gameTime`: Current game time in MM:SS format
- `alliesScore`: Allies score (0-5 points)
- `axisScore`: Axis score (0-5 points)
- `currentMap`: Name of the currently active map
- `nextMap`: Name of the next map in rotation

### Customizing Polling Interval

To change how often the dashboard polls for updates, modify the `pollInterval` in `src/config/index.ts`:

```typescript
export const defaultConfig: AppConfig = {
  pollInterval: 60000, // 1 minute in milliseconds
  theme: {
    isDark: false
  }
};
```

### Customizing Colors and Branding

Update the color scheme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#dc2626', // red accent
      gold: '#fbbf24',    // gold accent
    }
  }
}
```

Replace the ANZR logo by updating `public/anzr-logo.svg` with your own logo file.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with logo and theme toggle
│   ├── ServerTable.tsx # Main data display table
│   ├── StatusIndicator.tsx # Server status indicators
│   └── LastRefreshTimer.tsx # Refresh timer and manual refresh
├── hooks/              # Custom React hooks
│   ├── useTheme.ts     # Theme management
│   └── useServerData.ts # Data fetching and polling
├── services/           # Data services
│   └── ServerDataService.ts # API communication
├── types/              # TypeScript type definitions
│   └── index.ts        # All interface definitions
└── config/             # App configuration
    └── index.ts        # Default settings and constants
```

## Component Architecture

### Data Flow
1. **useServerData** hook loads server configuration from `servers.json`
2. Hook polls each server's API endpoint every minute
3. **ServerTable** component displays the aggregated data
4. **StatusIndicator** shows connection status for each server
5. **LastRefreshTimer** tracks and displays update timing

### Theme Management
- **useTheme** hook manages dark/light mode state
- Theme preference persisted in localStorage
- CSS classes applied to document root for global theming

### Error Handling
- Failed API calls show error status with details
- Mock data generation for development/demo purposes
- Graceful degradation when servers are unreachable

## Development

### Available Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run test suite
- `npm run deploy`: Deploy to GitHub Pages

### Adding New Columns

To add new columns to the server table:

1. **Update the TypeScript interface** in `src/types/index.ts`:
   ```typescript
   export interface ServerStatus {
     // ... existing fields
     newField: string;
   }
   ```

2. **Update the API service** in `src/services/ServerDataService.ts` to handle the new field

3. **Add the column** to the table in `src/components/ServerTable.tsx`:
   ```tsx
   <th>New Field</th>
   // ... and in the table body:
   <td>{server.newField}</td>
   ```

## Deployment

### GitHub Pages (Automatic)

The app automatically deploys to GitHub Pages when changes are pushed to the main branch via GitHub Actions.

### Manual Deployment

```bash
npm run deploy
```

This builds the app and pushes it to the `gh-pages` branch.

### Custom Domain

To use a custom domain, add a `CNAME` file to the `public/` directory with your domain name.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.