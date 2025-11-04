# 🌿 Zen Pomodoro

A peaceful Pomodoro timer Progressive Web App (PWA) to help you focus mindfully on your tasks, one breath at a time.

## Features

- **Task Management**: Create tasks and set target pomodoros for each
- **Progress Tracking**: Track completed pomodoros vs. target for each task
- **Pomodoro Timer**: 25-minute focus sessions with 5-minute breaks
- **Active Task Display**: Timer clearly shows which task you're currently working on
- **Visual Indicators**: Animated green dot and "Active" badge on current task
- **Local Storage**: All tasks are saved in your browser
- **PWA Support**: Install as an app on your device, works offline
- **Notifications**: Browser notifications when timers complete
- **Zen Design**: Beautiful nature-inspired UI with soft green color palette
- **Fully Responsive**:
  - Mobile-first design that works beautifully on smartphones
  - Desktop two-column layout for productivity on larger screens
  - Sticky timer panel keeps your focus visible while browsing tasks

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (typically http://localhost:5173)

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploying to GitHub Pages

The app automatically deploys to GitHub Pages via GitHub Actions when you push to the main/master branch.

**Setup (one-time):**
1. Go to your GitHub repository Settings
2. Navigate to Pages (under "Code and automation")
3. Under "Build and deployment", set Source to "GitHub Actions"

**Deploy:**
Just push to main/master branch:
```bash
git push origin main
```

Your app will be live at: `https://your-username.github.io/design-pomodoro/`

## How to Use

1. **Add a Task**: Click the "+ Add Task" button and enter your task name and target pomodoros
2. **Select a Task**: Click on a task to make it active - you'll see:
   - An animated green dot next to the task name
   - An "Active" badge in the task card
   - The task name displayed in the timer panel
3. **Start Timer**: Click the "▶ Start" button to begin your 25-minute focus session
   - The Start button is disabled until you select a task
   - The timer shows which task you're focusing on
4. **Complete Pomodoros**: When the timer completes, your task's pomodoro count increases automatically
5. **Take Breaks**: After each pomodoro, take a 5-minute break
6. **Mark Complete**: Once you reach your target pomodoros, mark the task as complete

### Desktop Experience

On screens 1024px and wider, enjoy a productivity-optimized two-column layout:
- **Left**: Sticky timer panel that stays visible as you scroll
- **Right**: Full task list for easy management
- See your active task and all other tasks simultaneously!

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React** - UI framework
- **TypeScript** - Type safety
- **PWA** - Progressive Web App capabilities with vite-plugin-pwa
- **Local Storage** - Browser-based data persistence

## Color Palette

The app uses a calming nature-inspired color scheme:
- Sage Green (#8FBC8F) - Primary
- Moss Green (#6B8E6B) - Dark accent
- Leaf Green (#A8D5A8) - Light accent
- Mint (#C8E6C8) - Very light
- Cream (#F0F4F0) - Background

---

Made with 🌱 for focused living
