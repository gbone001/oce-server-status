# Server Configuration Guide

This guide explains how to configure, add, and remove servers from the OCE Server Status application, as well as how to customize table columns.

## Table of Contents

- [Server Configuration](#server-configuration)
- [Adding/Removing Servers](#addingremoving-servers)
- [Customizing Table Columns](#customizing-table-columns)
- [API Response Format](#api-response-format)
- [Troubleshooting](#troubleshooting)

## Server Configuration

### Configuration File Location

Server configurations are stored in `/config/servers.json`. This JSON file contains all server definitions and application settings.

### Basic Server Structure

```json
{
  "name": "Server Display Name",
  "description": "Optional server description",
  "apiUrl": "https://your-server-api.com/status",
  "region": "OCE",
  "gameType": "Warfare"
}
```

### Required Fields

- **name**: Unique display name for the server
- **apiUrl**: Full URL to the server's status API endpoint

### Optional Fields

- **description**: Additional information about the server
- **region**: Server region (for organization/filtering)
- **gameType**: Type of game mode (Warfare, Skirmish, Training, etc.)

## Adding/Removing Servers

### Method 1: Edit Configuration File (Recommended)

1. Open `/config/servers.json`
2. Add/remove server objects in the `servers` array
3. Save the file
4. Refresh the web application

#### Example: Adding a New Server

```json
{
  "servers": [
    // Existing servers...
    {
      "name": "New OCE Server",
      "description": "Newly added server",
      "apiUrl": "https://new-server.example.com/api/status",
      "region": "OCE",
      "gameType": "Warfare"
    }
  ]
}
```

#### Example: Removing a Server

Simply delete the entire server object from the `servers` array.

### Method 2: Dynamic Configuration (Advanced)

For dynamic server management, you can use the application's JavaScript API:

```javascript
// Add a server
const newServer = {
  name: "Dynamic Server",
  apiUrl: "https://api.example.com/status",
  region: "OCE"
};

await window.serverStatusApp.addServer(newServer);

// Remove a server
await window.serverStatusApp.removeServer("Dynamic Server");
```

**Note**: Dynamic changes are not persisted and will be lost on page refresh.

## Customizing Table Columns

### Column Configuration

Table columns are configured in the `columnConfig` section of `/config/servers.json`:

```json
{
  "columnConfig": {
    "serverName": {
      "label": "Server Name",
      "sortable": true,
      "visible": true
    },
    "allies": {
      "label": "Allied Players",
      "sortable": true,
      "visible": true
    }
  }
}
```

### Column Properties

- **label**: Display text for the column header
- **sortable**: Whether the column can be sorted (true/false)
- **visible**: Whether the column is displayed (true/false)

### Available Columns

| Column Key | Description |
|------------|-------------|
| `serverName` | Server name and description |
| `allies` | Number of Allied players |
| `axis` | Number of Axis players |
| `gameTime` | Current game elapsed time |
| `score` | Game score (Allies/Axis out of 5) |
| `currentMap` | Name of currently playing map |
| `nextMap` | Name of next map in rotation |
| `status` | Server online/offline status |

### Hiding Columns

To hide a column, set `visible` to `false`:

```json
{
  "columnConfig": {
    "nextMap": {
      "label": "Next Map",
      "sortable": true,
      "visible": false
    }
  }
}
```

### Adding Custom Column Labels

You can customize column headers by changing the `label` property:

```json
{
  "columnConfig": {
    "allies": {
      "label": "Allied Forces",
      "sortable": true,
      "visible": true
    }
  }
}
```

## API Response Format

### Expected Response Structure

Your server API should return JSON in the following format:

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

### Alternative Field Names

The application supports various field naming conventions:

#### Player Counts
- `allies`, `alliedPlayers`, `team1`
- `axis`, `axisPlayers`, `team2`

#### Game Time
- `gameTime`, `time`, `elapsed`

#### Scores
- `alliesScore`, `alliedScore`, `team1Score`
- `axisScore`, `axisScore`, `team2Score`

#### Maps
- `currentMap`, `map`, `level`
- `nextMap`, `nextLevel`, `upcoming`

### Sample API Responses

#### Minimal Response
```json
{
  "allies": 10,
  "axis": 8,
  "gameTime": "15:45"
}
```

#### Complete Response
```json
{
  "allies": 25,
  "axis": 23,
  "gameTime": "45:12",
  "alliesScore": 4,
  "axisScore": 2,
  "currentMap": "Sainte-Marie-du-Mont",
  "nextMap": "Hill 400",
  "serverStatus": "online",
  "maxPlayers": 50
}
```

## Configuration Settings

### Polling Configuration

Configure polling behavior in the `config` section:

```json
{
  "config": {
    "pollingInterval": 60,
    "requestTimeout": 10000,
    "maxRetries": 3,
    "version": "1.0.0"
  }
}
```

#### Settings Explained

- **pollingInterval**: How often to fetch data (in seconds)
- **requestTimeout**: API request timeout (in milliseconds)
- **maxRetries**: Number of retry attempts on failure
- **version**: Configuration version (for future compatibility)

## CORS Configuration

### For Server Administrators

If you're hosting the server APIs, ensure CORS headers are properly configured:

```
Access-Control-Allow-Origin: https://yourdomain.github.io
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: Content-Type
```

### For GitHub Pages Deployment

GitHub Pages serves over HTTPS, so ensure your APIs support HTTPS and CORS.

## Troubleshooting

### Common Issues

#### 1. Server Not Loading
- **Check API URL**: Ensure the URL is correct and accessible
- **CORS Issues**: Verify CORS headers are configured on the server
- **Network Problems**: Check browser console for specific error messages

#### 2. Data Not Updating
- **Polling Status**: Check if polling is active in browser console
- **API Response**: Verify API returns valid JSON
- **Browser Cache**: Try hard refresh (Ctrl+F5)

#### 3. Configuration Not Loading
- **JSON Syntax**: Validate JSON syntax using a JSON validator
- **File Path**: Ensure `config/servers.json` exists and is accessible
- **Permissions**: Check file permissions if self-hosting

### Browser Console

Use browser developer tools (F12) to check for:
- Network requests to your APIs
- JavaScript errors
- CORS issues
- Polling status

### Testing Configuration

You can test your configuration by accessing these URLs directly:
- Configuration file: `https://yourdomain.github.io/config/servers.json`
- Each server API: `https://your-server-api.com/status`

### Error Messages

| Error | Solution |
|-------|----------|
| "Failed to load server configuration" | Check `servers.json` syntax and accessibility |
| "Request timeout" | Increase timeout in config or check server response time |
| "CORS error" | Configure CORS headers on your API server |
| "Invalid API URL format" | Ensure URLs start with `http://` or `https://` |

## GitHub Pages Deployment

### Enabling GitHub Pages

1. Go to your repository settings
2. Scroll to "Pages" section
3. Select source: "Deploy from a branch"
4. Choose branch: `main`
5. Choose folder: `/ (root)`
6. Click "Save"

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to repository root with your domain
2. Configure DNS to point to `yourusername.github.io`
3. Enable HTTPS in repository settings

## Support

For additional help:
- Check browser console for error messages
- Verify API endpoints manually
- Test configuration JSON syntax
- Review network requests in developer tools

## Example Configurations

### Basic Setup (3 Servers)
```json
{
  "servers": [
    {
      "name": "Main Server",
      "apiUrl": "https://api.server1.com/status"
    },
    {
      "name": "Backup Server",
      "apiUrl": "https://api.server2.com/status"
    },
    {
      "name": "Training Server",
      "apiUrl": "https://api.server3.com/status"
    }
  ]
}
```

### Advanced Setup (with all options)
```json
{
  "servers": [
    {
      "name": "OCE Primary",
      "description": "Main warfare server",
      "apiUrl": "https://oce-main.example.com/api/status",
      "region": "OCE",
      "gameType": "Warfare"
    }
  ],
  "config": {
    "pollingInterval": 30,
    "requestTimeout": 15000,
    "maxRetries": 5
  },
  "columnConfig": {
    "nextMap": {
      "label": "Upcoming Map",
      "visible": false
    }
  }
}
```