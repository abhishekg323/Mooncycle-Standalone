# Installation Guide

## Prerequisites

Before installing Moon Cycle, ensure you have:

- **Node.js**: Version 22 or higher
- **npm**: Version 10 or higher (comes with Node.js)
- **Git**: For cloning the repository

### Check Your Versions

```bash
node --version  # Should show v22.x.x or higher
npm --version   # Should show 10.x.x or higher
```

### Installing Node.js

If you don't have Node.js installed:

- **Download**: Visit [nodejs.org](https://nodejs.org/)
- **Recommended**: Install the LTS (Long Term Support) version
- **Verify**: Run the version checks above after installation

## Installation Methods

### Method 1: For End Users (Simple)

If you just want to use the app:

1. Visit the deployed version at: [YOUR-DEPLOYMENT-URL]
2. Click "Install" in your browser
3. The app will be added to your device

### Method 2: For Developers (From Source)

If you want to contribute or run locally:

#### Step 1: Clone the Repository

```bash
git clone https://github.com/abhishekg323/moon-cycle.git
cd moon-cycle
```

#### Step 2: Install Dependencies

```bash
npm install
```

This will download all required packages (~100MB).

#### Step 3: Start Development Server

```bash
npm start
```

Or alternatively:

```bash
ng serve
```

#### Step 4: Open in Browser

Navigate to: `http://localhost:4200/`

The app will automatically reload when you make changes.

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in `dist/moon-cycle/browser/`.

## Deployment Options

Moon Cycle can be deployed to any static hosting service:

### GitHub Pages

```bash
npm install -g angular-cli-ghpages
ng build --base-href /moon-cycle/
npx angular-cli-ghpages --dir=dist/moon-cycle/browser
```

### Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist/moon-cycle/browser`

### Vercel

1. Import your GitHub repository
2. Framework preset: Angular
3. Build command: `npm run build`
4. Output directory: `dist/moon-cycle/browser`

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## PWA Installation (End Users)

### On Mobile Devices

**iOS (Safari):**
1. Open the app in Safari
2. Tap the Share button
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"

**Android (Chrome):**
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home screen"
4. Tap "Add"

### On Desktop

**Chrome/Edge:**
1. Open the app
2. Click the install icon in the address bar (⊕)
3. Click "Install"

**The app will now work offline!**

## Troubleshooting

### Port Already in Use

If port 4200 is already in use:

```bash
ng serve --port 4201
```

Then visit `http://localhost:4201/`

### npm install Fails

Try clearing the npm cache:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build Fails

Ensure you're using compatible versions:

```bash
node --version  # Should be 22+
npm --version   # Should be 10+
```

### Service Worker Issues

Clear your browser cache or use incognito mode during development.

## System Requirements

### For Development
- **OS**: macOS, Windows, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: 500MB for dependencies

### For End Users
- **Browser**: Chrome 90+, Safari 14+, Firefox 90+, Edge 90+
- **Storage**: ~2MB for app, minimal for data
- **Internet**: Only needed for first load, then works offline

## Next Steps

After installation:

1. Read the [README.md](README.md) for usage guide
2. Check [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute
3. Start logging your periods!

## Questions?

If you encounter issues:
- Check existing GitHub issues
- Open a new issue with details
- Include your Node.js/npm versions
