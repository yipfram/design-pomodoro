import { useEffect } from 'react';
import { TimerState, POMODORO_DURATION, Task } from '../types';
import './Timer.css';

interface TimerProps {
  timerState: TimerState;
  currentTask?: Task;
  onTimerComplete: () => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onTogglePip: () => void;
  isPipActive: boolean;
  isPipSupported: boolean;
}

export default function Timer({
  timerState,
  currentTask,
  onTimerComplete,
  onToggleTimer,
  onResetTimer,
  onTogglePip,
  isPipActive,
  isPipSupported
}: TimerProps) {
  const { isRunning, timeLeft, isBreak } = timerState;

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      if (timeLeft <= 1) {
        onTimerComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimerComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak
    ? 0
    : ((POMODORO_DURATION - timeLeft) / POMODORO_DURATION) * 100;

  return (
    <div className="timer-container">
      <div className="timer-card">
        <div className="timer-header">
          <h2>{isBreak ? '🌿 Take a Break' : '🎯 Focus Time'}</h2>
        </div>

        {!isBreak && (
          <div className="current-task-display">
            {currentTask ? (
              <div className="current-task-info">
                <span className="current-task-label">Focusing on:</span>
                <span className="current-task-name">{currentTask.title}</span>
                <span className="current-task-progress">
                  {currentTask.completedPomodoros}/{currentTask.targetPomodoros} 🍅
                </span>
              </div>
            ) : (
              <div className="no-task-selected">
                <span className="no-task-icon">⚠️</span>
                <span className="no-task-message">Select a task below to start</span>
              </div>
            )}
          </div>
        )}

        <div className="timer-circle-wrapper">
          <svg className="timer-progress" viewBox="0 0 200 200">
            <circle
              className="timer-progress-bg"
              cx="100"
              cy="100"
              r="90"
            />
            <circle
              className="timer-progress-bar"
              cx="100"
              cy="100"
              r="90"
              style={{
                strokeDasharray: `${2 * Math.PI * 90}`,
                strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`,
              }}
            />
          </svg>
          <div className="timer-display">
            <div className="timer-time">{formatTime(timeLeft)}</div>
          </div>
        </div>

        <div className="timer-controls">
          <button
            className={`timer-button ${isRunning ? 'pause' : 'play'}`}
            onClick={onToggleTimer}
            disabled={!isBreak && !currentTask}
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button
            className="timer-button reset"
            onClick={onResetTimer}
          >
            ↻ Reset
          </button>
        </div>

        {isPipSupported && (
          <div className="pip-controls">
            <button
              className={`pip-toggle-button ${isPipActive ? 'active' : ''}`}
              onClick={onTogglePip}
              title={isPipActive ? 'Fermer la fenêtre flottante' : 'Ouvrir en fenêtre flottante'}
            >
              {isPipActive ? (
                <>
                  <span className="pip-icon">⊗</span>
                  <span>Fermer PiP</span>
                </>
              ) : (
                <>
                  <span className="pip-icon">⧉</span>
                  <span>Détacher en fenêtre</span>
                </>
              )}
            </button>
            {isPipActive && (
              <div className="pip-status-indicator">
                <span className="pip-status-dot"></span>
                <span>Fenêtre active</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
