import { useCallback, useEffect, useState, useRef } from 'react';
import Timer from './components/Timer';
import TaskList from './components/TaskList';
import CompletionModal from './components/CompletionModal';
import PipTimer from './components/PipTimer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNotificationSound } from './hooks/useNotificationSound';
import { usePictureInPicture } from './hooks/usePictureInPicture';
import { useSyncedTimerState } from './hooks/useSyncedTimerState';
import {
  Task,
  POMODORO_DURATION,
  SHORT_BREAK_DURATION,
} from './types';
import './App.css';
import packageJson from '../package.json';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('zen-pomodoro-tasks', []);
  const [timerState, setTimerState] = useSyncedTimerState({
    isRunning: false,
    timeLeft: POMODORO_DURATION,
    isBreak: false,
    currentTaskId: null,
    endTime: null,
  });
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const { playNotificationSound } = useNotificationSound();
  const { isPipActive, isSupported: isPipSupported, openPip, closePip, updatePipContent } = usePictureInPicture();

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
    // Play notification sound
    playNotificationSound();

    // Show completion modal
    setIsCompletionModalOpen(true);

    // Show browser notification if permission granted
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
  }, [playNotificationSound]);

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
        endTime: null,
      };
    });
  }, [notifyComplete, setTasks, setTimerState]);

  // Watch for timer completion
  useEffect(() => {
    if (timerState.isRunning && timerState.timeLeft === 0) {
      handleTimerComplete();
    }
  }, [timerState.isRunning, timerState.timeLeft, handleTimerComplete]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleToggleTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  }, [setTimerState]);

  const handleResetTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.isBreak ? SHORT_BREAK_DURATION : POMODORO_DURATION,
    }));
  }, [setTimerState]);

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
    [tasks, setTasks, timerState.currentTaskId, setTimerState]
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
    [timerState.isBreak, setTimerState]
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

  const currentTask = tasks.find(task => task.id === timerState.currentTaskId);

  // Completion Modal handlers
  const handleStartBreak = useCallback(() => {
    setIsCompletionModalOpen(false);
    setTimerState((prev) => ({
      ...prev,
      isRunning: true,
    }));
  }, []);

  const handleContinueWorking = useCallback(() => {
    setIsCompletionModalOpen(false);
    if (timerState.isBreak) {
      // After break, start a new pomodoro
      setTimerState((prev) => ({
        ...prev,
        isRunning: false,
        timeLeft: POMODORO_DURATION,
        isBreak: false,
      }));
    } else {
      // Skip break, reset to new pomodoro
      setTimerState((prev) => ({
        ...prev,
        isRunning: false,
        timeLeft: POMODORO_DURATION,
        isBreak: false,
      }));
    }
  }, [timerState.isBreak]);

  // Picture-in-Picture handlers
  const handleTogglePip = useCallback(() => {
    if (isPipActive) {
      closePip();
    } else {
      openPip(
        <PipTimer
          timerState={timerState}
          currentTask={currentTask}
          onToggleTimer={handleToggleTimer}
          onResetTimer={handleResetTimer}
          onClosePip={closePip}
        />
      );
    }
  }, [isPipActive, timerState, currentTask, handleToggleTimer, handleResetTimer, openPip, closePip]);

  // Update PiP content when timer state changes
  useEffect(() => {
    if (isPipActive) {
      updatePipContent(
        <PipTimer
          timerState={timerState}
          currentTask={currentTask}
          onToggleTimer={handleToggleTimer}
          onResetTimer={handleResetTimer}
          onClosePip={closePip}
        />
      );
    }
  }, [isPipActive, timerState, currentTask, handleToggleTimer, handleResetTimer, updatePipContent, closePip]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🌿 Zen Pomodoro</h1>
        <p className="app-subtitle">Focus mindfully, one breath at a time</p>
      </header>

      <div className="app-main-content">
        <div className="timer-section">
          <Timer
            timerState={timerState}
            currentTask={currentTask}
            onTimerComplete={handleTimerComplete}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onTogglePip={handleTogglePip}
            isPipActive={isPipActive}
            isPipSupported={isPipSupported}
          />
        </div>

        <div className="tasks-section-wrapper">
          <TaskList
            tasks={tasks}
            currentTaskId={timerState.currentTaskId}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onSelectTask={handleSelectTask}
            onCompletePomodoro={handleCompletePomodoro}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </div>

      <CompletionModal
        isOpen={isCompletionModalOpen}
        isBreak={timerState.isBreak}
        task={currentTask}
        onStartBreak={handleStartBreak}
        onContinueWorking={handleContinueWorking}
        onClose={() => setIsCompletionModalOpen(false)}
      />

      <footer className="app-footer">
        <p>Made with 🌱 for focused living</p>
        <p className="app-version">v{packageJson.version}</p>
      </footer>
    </div>
  );
}

export default App;
