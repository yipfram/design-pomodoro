# Zen Pomodoro 🍃

A modern, Zen-inspired Pomodoro timer Progressive Web App (PWA) built with ViteJS and TypeScript to help you focus with mindfulness.

![Zen Pomodoro App](https://github.com/user-attachments/assets/635cb3c4-f912-4835-883f-423c0df10a53)

## Features

✨ **Modern Zen Design** - Soft green color palette inspired by nature, with glassmorphism effects and smooth animations

⏱️ **Pomodoro Timer** - Classic 25-minute focus sessions with 5-minute short breaks and 15-minute long breaks

📝 **Task Management** - Create tasks with customizable pomodoro targets and track your progress

💾 **Local Storage** - All tasks are saved in your browser, so your data persists across sessions

🎯 **Focus Tracking** - Visual progress bars show how many pomodoros you've completed for each task

📱 **Progressive Web App** - Install on your device and use offline like a native app

🔔 **Audio Notifications** - Gentle sound alerts when timer completes

🌿 **Mindful Experience** - Designed to promote focus and peaceful productivity

## Screenshots

### Initial State
![Initial State](https://github.com/user-attachments/assets/635cb3c4-f912-4835-883f-423c0df10a53)

### With Tasks
![With Tasks](https://github.com/user-attachments/assets/0f1a5e6d-b855-432b-b5cc-12eed4a95f36)

### Timer Running
![Timer Running](https://github.com/user-attachments/assets/5b2f4425-8352-40f8-a4d8-1ae693c24a75)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yipfram/design-pomodoro.git
cd design-pomodoro
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Add a Task** - Click "➕ Add New Task" and enter your task details
2. **Select a Task** - Click on a task to make it active
3. **Start Timer** - Click "▶ Start" to begin a 25-minute focus session
4. **Complete Session** - When the timer completes, your pomodoro count increases
5. **Take Breaks** - The app automatically switches between focus and break periods
6. **Track Progress** - Watch your progress bars fill as you complete pomodoros

## Technology Stack

- **ViteJS** - Fast, modern build tool
- **React 19** - UI framework
- **TypeScript** - Type-safe code
- **vite-plugin-pwa** - PWA capabilities with Workbox
- **CSS3** - Modern styling with gradients, glassmorphism, and animations

## PWA Features

The app is a fully functional PWA with:
- Service Worker for offline functionality
- Web App Manifest for installation
- Optimized caching strategy
- Icons for all platforms (iOS, Android, Desktop)

### Installing as PWA

1. Open the app in your browser
2. Look for the "Install" or "Add to Home Screen" prompt
3. Follow the browser-specific instructions to install
4. Launch from your home screen or app launcher

## Color Palette

The Zen color scheme uses soft greens inspired by nature:
- Primary: `#22C55E` (Green-500)
- Light: `#86EFAC` (Green-300)
- Dark: `#166534` (Green-800)
- Background: `#F0FDF4` to `#DCFCE7` gradient (Green-50 to Green-100)

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the Pomodoro Technique® developed by Francesco Cirillo
- Design philosophy influenced by Zen minimalism and nature

