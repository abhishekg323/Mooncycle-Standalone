# Moon Cycle - Period Tracker PWA

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Angular](https://img.shields.io/badge/angular-19-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/typescript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-enabled-purple.svg)](https://web.dev/progressive-web-apps/)
[![Privacy First](https://img.shields.io/badge/privacy-first-green.svg)](#-privacy-first)
[![Offline Support](https://img.shields.io/badge/offline-supported-orange.svg)](#-pwa-features)

A privacy-first, offline-capable menstrual cycle tracking Progressive Web App (PWA) built with Angular 19.

## 🌐 Live Demo

**Try it now:** [https://abhishekg323.github.io/Mooncycle-Standalone/](https://abhishekg323.github.io/Mooncycle-Standalone/)

> 💡 Click the install icon in your browser to add it to your home screen and use it offline!

## Features

### 🌙 Core Features
- **Period Tracking**: Log period start and end dates with flow intensity
- **Cycle Predictions**: Automatic predictions based on historical data
- **Fertile Window**: Calculate and display fertile days and ovulation
- **Symptoms Tracking**: Log 12+ common symptoms with severity levels
- **Cycle Insights**: View average cycle length, regularity, and patterns
- **Interactive Calendar**: Visual calendar with color-coded days

### 📱 PWA Features
- **Offline Support**: Works completely offline via service workers
- **Installable**: Can be installed on any device (phone, tablet, desktop)
- **Responsive Design**: Optimized for all screen sizes
- **No Backend Required**: All data stays on your device

### 🔒 Privacy First
- **100% Local Storage**: All data stored in browser's local storage
- **No Cloud Sync**: Your data never leaves your device
- **No Tracking**: No analytics, no third-party services
- **Export/Import**: Control your own data

## Technology Stack

- **Framework**: Angular 19 (Standalone Components)
- **Language**: TypeScript
- **Styling**: SCSS
- **State Management**: RxJS (BehaviorSubject)
- **Storage**: LocalStorage with JSON serialization
- **PWA**: @angular/pwa with service workers

## Getting Started

### Prerequisites
- Node.js 22+
- npm 10+

### Installation & Development

```bash
# Install dependencies (if needed)
npm install

# Start development server
ng serve
# Navigate to http://localhost:4200/

# Build for production
ng build
# Output in dist/moon-cycle/
```

## Usage Guide

### First Time Setup
1. Open the app
2. Click the **+** button to log your first period
3. Enter start date, end date (optional), flow intensity
4. Add any symptoms you're experiencing
5. Save the entry

### Logging Periods
- Click the **+** button at any time
- OR click any day in the calendar and click "➕ Log Period"
- The app predicts your next period after 2+ cycles
- View predictions in the Dashboard

### Editing & Deleting Periods
- **From Dashboard**: Scroll to "Period History" section and click the ✏️ button
- **From Calendar**: Click a period day, then click "✏️ Edit Period" or "🗑️ Delete"
- Edit any field and click "Update" to save changes
- Delete entries with confirmation to prevent accidents

### Viewing Your Data
- **Dashboard Tab**: Overview of current cycle, next period prediction, statistics, and period history
- **Calendar Tab**: Visual representation of all logged periods and predictions
- Click any day in the calendar to see details and manage entries

### Understanding the Calendar
- **Red**: Period days (logged)
- **Pink Dashed**: Predicted period days
- **Green**: Fertile window
- **Purple**: Ovulation day
- **Circle**: Today
- **\***: Day has logged symptoms

## Project Structure

```
src/app/
├── components/
│   ├── calendar/          # Calendar view component
│   ├── dashboard/         # Dashboard with stats
│   └── log-period/        # Period logging form
├── models/
│   └── cycle.model.ts     # TypeScript interfaces
├── services/
│   ├── cycle.service.ts   # Cycle calculations & state
│   └── storage.service.ts # LocalStorage handling
└── app.component.*        # Main app shell
```

## Symptoms Tracked

Cramps, Headache, Bloating, Mood Swings, Fatigue, Breast Tenderness, Acne, Backache, Nausea, Insomnia, Food Cravings, Other

## Algorithm Details

### Cycle Prediction
- Calculates average cycle length from historical data
- Predicts next period by adding average to last period start
- Minimum 2 cycles needed for predictions

### Fertile Window
- Ovulation predicted 14 days before next period
- Fertile window: 5 days before + 1 day after ovulation

### Regularity Assessment
- **Regular**: Standard deviation < 4 days
- **Irregular**: Standard deviation 4-7 days
- **Very Irregular**: Standard deviation > 7 days

## PWA Installation

### On Mobile (iOS/Android)
1. Open in Safari (iOS) or Chrome (Android)
2. Tap share button → "Add to Home Screen"
3. App appears as icon on home screen

### On Desktop
1. Open in Chrome/Edge
2. Click install icon in address bar
3. Access from app launcher

## Privacy & Data

- **No server**: All processing in browser
- **No accounts**: No registration required
- **No internet**: Works 100% offline after first load
- **Your data**: Export anytime, delete anytime
- **No tracking**: Zero telemetry or analytics

## Browser Support

- Chrome/Edge: 90+
- Safari: 14+
- Firefox: 90+
- Mobile browsers with PWA support

---

**Remember**: This app is for personal cycle tracking. Consult healthcare providers for medical advice.

