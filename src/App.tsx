import { useState, useCallback, useRef, useEffect } from 'react';
import Timer from './components/Timer';
import TaskList from './components/TaskList';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  Task,
  TimerState,
  POMODORO_DURATION,
  SHORT_BREAK_DURATION,
} from './types';
import './App.css';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('zen-pomodoro-tasks', []);
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    timeLeft: POMODORO_DURATION,
    isBreak: false,
    currentTaskId: null,
  });

  const intervalRef = useRef<number | null>(null);

  // Timer tick effect
  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimerState((prev) => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - 1),
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning]);

  // Play notification sound and show notification
  const notifyComplete = useCallback((isBreak: boolean) => {
    // Play a gentle notification sound (optional - you can add audio later)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        isBreak ? '🌿 Break time is over!' : '🎯 Pomodoro completed!',
        {
          body: isBreak
            ? 'Ready to focus again?'
            : 'Great work! Time for a break.',
          icon: '/pwa-192x192.png',
        }
      );
    }
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleTimerComplete = useCallback(() => {
    setTimerState((prev) => {
      const newIsBreak = !prev.isBreak;
      notifyComplete(prev.isBreak);

      // If completing a focus session, increment the task's pomodoro count
      if (!prev.isBreak && prev.currentTaskId) {
        setTasks((tasks) =>
          tasks.map((task) =>
            task.id === prev.currentTaskId
              ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
              : task
          )
        );
      }

      return {
        isRunning: false,
        timeLeft: newIsBreak ? SHORT_BREAK_DURATION : POMODORO_DURATION,
        isBreak: newIsBreak,
        currentTaskId: newIsBreak ? null : prev.currentTaskId,
      };
    });
  }, [notifyComplete, setTasks]);

  const handleToggleTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  }, []);

  const handleResetTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.isBreak ? SHORT_BREAK_DURATION : POMODORO_DURATION,
    }));
  }, []);

  const handleAddTask = useCallback(
    (title: string, targetPomodoros: number) => {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        targetPomodoros,
        completedPomodoros: 0,
        completed: false,
        createdAt: Date.now(),
      };
      setTasks([...tasks, newTask]);
    },
    [tasks, setTasks]
  );

  const handleDeleteTask = useCallback(
    (id: string) => {
      setTasks(tasks.filter((task) => task.id !== id));
      if (timerState.currentTaskId === id) {
        setTimerState((prev) => ({
          ...prev,
          currentTaskId: null,
          isRunning: false,
        }));
      }
    },
    [tasks, setTasks, timerState.currentTaskId]
  );

  const handleSelectTask = useCallback(
    (id: string) => {
      if (!timerState.isBreak) {
        setTimerState((prev) => ({
          ...prev,
          currentTaskId: id,
        }));
      }
    },
    [timerState.isBreak]
  );

  const handleCompletePomodoro = useCallback(
    (id: string) => {
      setTasks(
        tasks.map((task) =>
          task.id === id
            ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
            : task
        )
      );
    },
    [tasks, setTasks]
  );

  const handleToggleComplete = useCallback(
    (id: string) => {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    },
    [tasks, setTasks]
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🌿 Zen Pomodoro</h1>
        <p className="app-subtitle">Focus mindfully, one breath at a time</p>
      </header>

      <Timer
        timerState={timerState}
        onTimerComplete={handleTimerComplete}
        onToggleTimer={handleToggleTimer}
        onResetTimer={handleResetTimer}
      />

      <TaskList
        tasks={tasks}
        currentTaskId={timerState.currentTaskId}
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
        onSelectTask={handleSelectTask}
        onCompletePomodoro={handleCompletePomodoro}
        onToggleComplete={handleToggleComplete}
      />

      <footer className="app-footer">
        <p>Made with 🌱 for focused living</p>
      </footer>
    </div>
  );
}

export default App;
