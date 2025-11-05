import { Task, TimerState } from '../types';
import './PipTimer.css';

interface PipTimerProps {
  timerState: TimerState;
  currentTask: Task | undefined;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onClosePip: () => void;
}

function PipTimer({
  timerState,
  currentTask,
  onToggleTimer,
  onResetTimer,
  onClosePip,
}: PipTimerProps) {
  const minutes = Math.floor(timerState.timeLeft / 60);
  const seconds = timerState.timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const totalDuration = timerState.isBreak ? 300 : 1500;
  const progress = ((totalDuration - timerState.timeLeft) / totalDuration) * 100;

  return (
    <div className="pip-timer">
      <div className="pip-header">
        <div className="pip-status">
          <span className={`pip-status-dot ${timerState.isRunning ? 'active' : ''}`} />
          <span className="pip-status-text">
            {timerState.isBreak ? '🌿 Pause' : '🍅 Focus'}
          </span>
        </div>
        <button className="pip-close-btn" onClick={onClosePip} title="Fermer">
          ✕
        </button>
      </div>

      <div className="pip-timer-display">
        <svg className="pip-progress-ring" width="200" height="200">
          <circle
            className="pip-progress-ring-circle-bg"
            stroke="#E0E0E0"
            strokeWidth="8"
            fill="transparent"
            r="90"
            cx="100"
            cy="100"
          />
          <circle
            className="pip-progress-ring-circle"
            stroke={timerState.isBreak ? '#A8D5A8' : '#8FBC8F'}
            strokeWidth="8"
            fill="transparent"
            r="90"
            cx="100"
            cy="100"
            style={{
              strokeDasharray: `${2 * Math.PI * 90}`,
              strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`,
            }}
          />
          <text
            x="100"
            y="100"
            textAnchor="middle"
            dy="0.3em"
            className="pip-timer-text"
          >
            {formattedTime}
          </text>
        </svg>
      </div>

      {currentTask && !timerState.isBreak && (
        <div className="pip-task-info">
          <div className="pip-task-title">{currentTask.title}</div>
          <div className="pip-task-progress">
            {currentTask.completedPomodoros} / {currentTask.targetPomodoros}
          </div>
        </div>
      )}

      <div className="pip-controls">
        <button
          className="pip-control-btn pip-reset-btn"
          onClick={onResetTimer}
          title="Réinitialiser"
        >
          ↻
        </button>
        <button
          className="pip-control-btn pip-play-btn"
          onClick={onToggleTimer}
          disabled={!timerState.isBreak && !currentTask}
          title={timerState.isRunning ? 'Pause' : 'Démarrer'}
        >
          {timerState.isRunning ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
}

export default PipTimer;
