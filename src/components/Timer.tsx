import { useEffect } from 'react';
import { TimerState, POMODORO_DURATION } from '../types';
import './Timer.css';

interface TimerProps {
  timerState: TimerState;
  onTimerComplete: () => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
}

export default function Timer({ timerState, onTimerComplete, onToggleTimer, onResetTimer }: TimerProps) {
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
      </div>
    </div>
  );
}
