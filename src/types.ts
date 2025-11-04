export interface Task {
  id: string;
  title: string;
  pomodorosTarget: number;
  pomodorosCompleted: number;
  createdAt: number;
}

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  isBreak: boolean;
  currentTaskId: string | null;
}
