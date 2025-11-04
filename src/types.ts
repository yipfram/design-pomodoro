export interface Task {
  id: string;
  title: string;
  targetPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  createdAt: number;
}

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  isBreak: boolean;
  currentTaskId: string | null;
}

export const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds
export const SHORT_BREAK_DURATION = 5 * 60; // 5 minutes in seconds
export const LONG_BREAK_DURATION = 15 * 60; // 15 minutes in seconds
