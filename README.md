# ANZR Server Status Dashboard

A production-ready, responsive server polling dashboard built with React and TypeScript for the Australian/New Zealand Region gaming community. Features real-time server monitoring with a sleek dark theme and ANZR branding.

![ANZR Logo](https://img.shields.io/badge/ANZR-Server%20Status-dc143c?style=for-the-badge&logo=react)

## ✨ Features

- **Real-time Server Monitoring**: Polls servers every 60 seconds
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices  
- **Server Status Indicators**: Visual status with color-coded health indicators
- **Player Count Tracking**: Live player counts with visual progress bars
- **Map Information**: Current map being played on each server
- **Score Tracking**: Live match scores when available
- **Refresh Timer**: Shows time since last update and countdown to next refresh
- **ANZR Branding**: Dark theme with signature red (#DC143C) and gold (#FFD700) accents
- **Error Handling**: Graceful error handling with retry functionality
- **GitHub Pages Ready**: Optimized for deployment on GitHub Pages

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/gbone001/oce-server-status.git
cd oce-server-status

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Create production build
npm run build

# Serve production build locally (optional)
npx serve -s build
```

## 🖥️ Deployment

### GitHub Pages

1. Update the `package.json` file with your GitHub Pages URL:
```json
{
  "homepage": "https://gbone001.github.io/oce-server-status"
}
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add deployment scripts to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

4. Deploy:
```bash
npm run deploy
```

### Other Hosting Platforms

The built application in the `build` folder can be deployed to any static hosting service:
- Netlify
- Vercel  
- AWS S3 + CloudFront
- Firebase Hosting

## 📝 Configuration

### Server Configuration

Edit `public/servers.json` to configure the servers to monitor:

```json
[
  {
    "id": "unique-server-id",
    "name": "Server Display Name", 
    "ip": "server.ip.address",
    "port": 27015,
    "region": "Server Region",
    "gameType": "Game Type"
  }
]
```

### Polling Interval

The polling interval can be adjusted in `src/context/ServerContext.tsx`:

```typescript
// Change polling interval (in milliseconds)
poller.startPolling(60000); // 60 seconds
```

### Theme Customization

ANZR branding colors are defined in CSS custom properties and can be modified in `src/App.css`:

- Primary Red: `#DC143C`  
- Gold Accent: `#FFD700`
- Background: Dark gradient theme

## 🏗️ Architecture

### Project Structure

```
src/
├── api/
│   └── serverPoller.ts     # Server polling logic
├── components/
│   ├── RefreshTimer.tsx    # Timer component
│   ├── ServerStatusIndicator.tsx  # Status indicators
│   └── ServerTable.tsx     # Main table component
├── context/
│   └── ServerContext.tsx   # React context for state
├── types/
│   └── server.ts          # TypeScript interfaces
├── App.tsx                # Main app component  
├── App.css                # Main styling
└── index.tsx              # App entry point
```

### Key Components

- **ServerPoller**: Handles server communication and polling logic
- **ServerContext**: Manages global server state using React Context
- **ServerTable**: Displays server information in a responsive table
- **ServerStatusIndicator**: Shows server health with color-coded indicators
- **RefreshTimer**: Displays refresh status and manual refresh control

## 🛠️ Development

### Available Scripts

- `npm start`: Start development server
- `npm test`: Run test suite  
- `npm run build`: Create production build
- `npm run eject`: Eject from Create React App (not recommended)

### Code Standards

- TypeScript for type safety
- ESLint for code linting
- Responsive design principles
- Accessibility best practices
- Clean, maintainable code structure

## 🎨 Design System

### Colors
- **Primary Red**: `#DC143C` (ANZR signature color)
- **Gold Accent**: `#FFD700` (Highlight color)
- **Background**: `#0A0A0A` to `#1A1A1A` (Dark gradient)
- **Text**: `#E0E0E0` (Light gray)
- **Success**: `#44FF44` (Online status)
- **Error**: `#FF4444` (Offline status)

### Typography
- System font stack for optimal performance
- Clear hierarchy with proper contrast ratios
- Responsive font sizing

## 🔧 Troubleshooting

### Common Issues

**Servers not loading?**
- Check that `public/servers.json` exists and is valid JSON
- Verify server configuration format
- Check browser console for errors

**Build failing?**
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`
- Verify Node.js version compatibility

**Styling issues?**
- Clear browser cache
- Check for CSS conflicts
- Verify responsive breakpoints

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`  
5. Submit a Pull Request

## 🆘 Support

For support, please open an issue on GitHub or contact the ANZR community through:
- Discord Server
- Steam Group
- GitHub Issues

---

**Built with ❤️ for the ANZR Gaming Community**