# OCE Server Status

A modular web application that polls server APIs and displays real-time server status information in a clean, responsive table format. Built for OCE (Oceania) gaming servers with support for any API-compatible server.

## Features

- **Real-time Updates**: Polls server APIs every minute automatically
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modular Architecture**: Clean separation of concerns for easy maintenance
- **Sortable Columns**: Click any column header to sort data
- **Error Handling**: Graceful handling of offline servers and network issues
- **Configurable**: Easy to add/remove servers and customize columns
- **GitHub Pages Ready**: No build process required, deploys directly to GitHub Pages

## Live Demo

View the live application at: `https://[username].github.io/oce-server-status`

## Server Information Displayed

| Column | Description |
|--------|-------------|
| Server Name | Display name and description |
| Allied Players | Number of players on Allied team |
| Axis Players | Number of players on Axis team |
| Game Time | Current match elapsed time |
| Score | Current game score (Allies/Axis out of 5) |
| Current Map | Name of the map currently being played |
| Next Map | Name of the next map in rotation |
| Status | Server online/offline status |

## Quick Start

### 1. Clone or Fork Repository
```bash
git clone https://github.com/yourusername/oce-server-status.git
cd oce-server-status
```

### 2. Configure Your Servers
Edit `config/servers.json` to add your server API endpoints:

```json
{
  "servers": [
    {
      "name": "Your Server Name",
      "description": "Server description",
      "apiUrl": "https://your-server-api.com/status",
      "region": "OCE"
    }
  ]
}
```

### 3. Deploy to GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section
3. Select "Deploy from a branch"
4. Choose `main` branch and `/ (root)` folder
5. Save and wait for deployment

## API Requirements

Your server APIs should return JSON in this format:

```json
{
  "allies": 15,
  "axis": 12,
  "gameTime": "25:30",
  "alliesScore": 3,
  "axisScore": 1,
  "currentMap": "Omaha Beach",
  "nextMap": "Carentan"
}
```

The application supports various field naming conventions - see [Configuration Guide](docs/CONFIGURATION.md) for details.

## Configuration

### Adding/Removing Servers

**Method 1: Edit Configuration File**
1. Open `config/servers.json`
2. Add/remove server objects in the `servers` array
3. Commit and push changes

**Method 2: Dynamic (JavaScript)**
```javascript
// Add server
await window.serverStatusApp.addServer({
  name: "New Server",
  apiUrl: "https://api.example.com/status"
});

// Remove server
await window.serverStatusApp.removeServer("Server Name");
```

### Customizing Columns

Modify the `columnConfig` section in `config/servers.json`:

```json
{
  "columnConfig": {
    "nextMap": {
      "label": "Upcoming Map",
      "sortable": true,
      "visible": false
    }
  }
}
```

For detailed configuration options, see the [Configuration Guide](docs/CONFIGURATION.md).

## Architecture

The application follows a modular architecture pattern:

### Core Components

- **`js/app.js`** - Main application controller and coordination
- **`js/config.js`** - Configuration management and server definitions
- **`js/dataFetcher.js`** - API polling and data retrieval logic
- **`js/tableRenderer.js`** - Table rendering and update handling
- **`js/utils.js`** - Common utility functions

### File Structure
```
oce-server-status/
├── index.html              # Main application page
├── css/
│   └── styles.css          # Application styling
├── js/
│   ├── app.js              # Main app controller
│   ├── config.js           # Configuration manager
│   ├── dataFetcher.js      # API data fetching
│   ├── tableRenderer.js    # Table rendering
│   └── utils.js            # Utility functions
├── config/
│   └── servers.json        # Server configuration
├── docs/
│   └── CONFIGURATION.md    # Detailed configuration guide
└── README.md               # This file
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Requires modern JavaScript features: ES6 modules, Fetch API, Promises.

## Development

### Local Development
1. Serve files with a local web server (required for ES6 modules)
2. Python: `python -m http.server 8000`
3. Node.js: `npx serve`
4. Open `http://localhost:8000`

### Testing Configuration
- Validate JSON: Use online JSON validators
- Test APIs: Check endpoints manually in browser
- Debug: Use browser developer tools console

## CORS Requirements

Your server APIs must include appropriate CORS headers:

```
Access-Control-Allow-Origin: https://yourdomain.github.io
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: Content-Type
```

## Troubleshooting

### Common Issues

1. **Servers not loading**: Check API URLs and CORS configuration
2. **Configuration errors**: Validate JSON syntax in `servers.json`
3. **GitHub Pages not updating**: Check Actions tab for deployment status
4. **Mobile display issues**: Clear browser cache and test responsive design

See the [Configuration Guide](docs/CONFIGURATION.md) for detailed troubleshooting steps.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Adding Features

The modular architecture makes it easy to add features:
- **New data sources**: Extend `DataFetcher`
- **Display options**: Modify `TableRenderer`
- **Configuration options**: Update `ConfigManager`

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Changelog

### Version 1.0.0
- Initial release
- Modular architecture implementation
- Real-time server polling
- Responsive table display
- Configuration management
- GitHub Pages deployment support
- Comprehensive documentation

## Support

- **Documentation**: [Configuration Guide](docs/CONFIGURATION.md)
- **Issues**: Use GitHub Issues for bug reports
- **Questions**: Create GitHub Discussions for questions

---

**Built for the OCE gaming community** 🎮

Made with ❤️ for server administrators and players who want to stay connected with their favorite gaming servers.