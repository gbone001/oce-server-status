# OCE Server Status Dashboard

A modern, real-time server status dashboard for OCE (Oceania) Hell Let Loose game servers, built with React and TypeScript. Features a dark theme with ANZR (Australia New Zealand Regiment) branding in red and gold colors.

![Dashboard Screenshot](https://via.placeholder.com/1200x600/0a0a0a/ffffff?text=ANZR+Server+Status+Dashboard)

## Features

- **Real-time Monitoring**: Automatically polls server APIs every 60 seconds
- **Comprehensive Data Display**: Shows server name, player counts (Allies/Axis), game time, scores, current map, and next map
- **Status Indicators**: Visual indicators for online/offline/error/loading states
- **Refresh Timer**: Displays last refresh time and countdown to next refresh
- **Dark Theme**: Professional dark UI with ANZR red/gold accent colors
- **Responsive Design**: Mobile-friendly layout that adapts to different screen sizes
- **Modular Architecture**: Clean separation of concerns with reusable components
- **GitHub Pages Ready**: Configured for easy deployment to GitHub Pages
- **Easy Configuration**: Server list managed via `public/servers.json`

## Live Demo

Visit the live dashboard: [https://gbone001.github.io/oce-server-status/](https://gbone001.github.io/oce-server-status/)

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gbone001/oce-server-status.git
   cd oce-server-status
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure servers** (optional)
   Edit `public/servers.json` to add your server endpoints:
   ```json
   [
     {
       "id": "server-1",
       "name": "ANZR Server #1",
       "url": "https://api.example.com/server1/status",
       "description": "Primary Battle Server"
     }
   ]
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   
   Open [http://localhost:3000/oce-server-status](http://localhost:3000/oce-server-status) in your browser.

5. **Build for production**
   ```bash
   npm run build
   ```

## Configuration

### Server Configuration (`public/servers.json`)

Configure your game servers by editing the `public/servers.json` file:

```json
[
  {
    "id": "unique-server-id",
    "name": "Display Name",
    "url": "https://your-api-endpoint.com/status",
    "description": "Server description"
  }
]
```

**Configuration Fields:**
- `id`: Unique identifier for the server (string)
- `name`: Display name shown in the dashboard (string)
- `url`: API endpoint that returns server status (string)
- `description`: Optional description (string)

### Expected API Response

Your server APIs should return JSON in this format:

```json
{
  "alliesCount": 25,
  "axisCount": 23,
  "gameTime": "45:30",
  "alliesScore": 3,
  "axisScore": 2,
  "currentMap": "Kursk",
  "nextMap": "Stalingrad",
  "maxPlayers": 100
}
```

**Response Fields:**
- `alliesCount`: Number of Allied players (number)
- `axisCount`: Number of Axis players (number)
- `gameTime`: Current game time in MM:SS format (string)
- `alliesScore`: Allied team score (number)
- `axisScore`: Axis team score (number)
- `currentMap`: Currently playing map (string)
- `nextMap`: Next map in rotation (string)
- `maxPlayers`: Maximum server capacity (number)

## Deployment

### GitHub Pages

The project is pre-configured for GitHub Pages deployment:

1. **Enable GitHub Pages** in your repository settings
2. **Deploy** using the included npm script:
   ```bash
   npm run deploy
   ```

The dashboard will be available at `https://yourusername.github.io/oce-server-status/`

### Other Hosting Platforms

For other hosting platforms (Netlify, Vercel, etc.):

1. Build the project: `npm run build`
2. Deploy the `build` folder contents
3. Configure your hosting platform for SPA routing if needed

## Project Structure

```
src/
├── api/
│   └── serverPoller.ts      # Server polling logic and API calls
├── components/
│   ├── ServerTable.tsx      # Main data table component
│   ├── ServerTable.css      # Table styling
│   ├── ServerStatusIndicator.tsx  # Status indicator component
│   ├── ServerStatusIndicator.css  # Status indicator styling
│   ├── RefreshTimer.tsx     # Timer and refresh controls
│   └── RefreshTimer.css     # Timer styling
├── context/
│   └── ServerContext.tsx    # React context for server data
├── types.ts                 # TypeScript type definitions
├── App.tsx                  # Main application component
├── App.css                  # Main application styling
├── index.tsx               # Application entry point
└── index.css               # Global styles
```

## Customization

### Theming

The dashboard uses CSS custom properties for theming. Edit the `:root` variables in `src/App.css`:

```css
:root {
  --bg-primary: #0a0a0a;      /* Primary background */
  --bg-secondary: #1a1a1a;    /* Secondary background */
  --text-primary: #ffffff;     /* Primary text color */
  --text-secondary: #b3b3b3;   /* Secondary text color */
  --accent-red: #dc2626;       /* ANZR red accent */
  --accent-gold: #ffd700;      /* ANZR gold accent */
  --border-color: #333333;     /* Border color */
}
```

### Logo/Branding

Replace the logo placeholder in `src/App.tsx`:

```tsx
// Replace this div with your logo image
<div className="logo-placeholder">ANZR</div>
```

### Refresh Interval

Change the polling interval by modifying the `refreshInterval` prop in `src/App.tsx`:

```tsx
<RefreshTimer
  refreshInterval={30000} // 30 seconds instead of 60
  // ... other props
/>
```

## Development

### Architecture

The application follows a modular architecture:

- **API Layer** (`src/api/`): Handles server communication and data fetching
- **Context Layer** (`src/context/`): Manages global state using React Context
- **Component Layer** (`src/components/`): Reusable UI components
- **Types** (`src/types.ts`): TypeScript interfaces and type definitions

### Key Components

1. **ServerPoller**: Manages API calls to game servers with timeout handling
2. **ServerContext**: Provides server data and refresh functionality to components
3. **ServerTable**: Displays server data in a responsive table format
4. **ServerStatusIndicator**: Visual status indicators with animations
5. **RefreshTimer**: Shows refresh status and manual refresh controls

### Adding New Features

To extend the dashboard:

1. **Add new data fields**: Update `ServerData` interface in `src/types.ts`
2. **Modify API response**: Update `generateMockServerData()` in `src/api/serverPoller.ts`
3. **Update table display**: Add new columns in `src/components/ServerTable.tsx`
4. **Style new elements**: Add corresponding CSS in component stylesheets

## Mock Data

The dashboard includes mock data generation for demonstration purposes. The `serverPoller.ts` simulates realistic server responses with:

- Random player counts
- Rotating map selections
- Simulated API response times
- 90% success rate for server responses

Replace the mock functions with real API calls when integrating with actual game servers.

## Troubleshooting

### Common Issues

1. **Build Failures**: Ensure all TypeScript errors are resolved
2. **Deployment Issues**: Verify the `homepage` field in `package.json` matches your deployment URL
3. **API Errors**: Check server endpoints and CORS configuration
4. **Styling Issues**: Verify CSS custom properties are properly defined

### Development Tools

- **TypeScript**: Static type checking
- **ESLint**: Code linting and formatting
- **React DevTools**: Browser extension for debugging React components

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or feature requests:

1. Check existing [GitHub Issues](https://github.com/gbone001/oce-server-status/issues)
2. Create a new issue if your problem isn't covered
3. Provide detailed information about your setup and the issue

---

**Built with ❤️ for the ANZR Gaming Community**