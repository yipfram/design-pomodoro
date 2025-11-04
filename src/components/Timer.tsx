import { useState, useEffect, useRef } from 'react';
import { Task } from '../types';
import './Timer.css';

interface TimerProps {
  onComplete: () => void;
  currentTask?: Task;
}

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

const Timer = ({ onComplete, currentTask }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Play notification sound
    playNotificationSound();
    
    if (!isBreak) {
      onComplete();
      // After a pomodoro, start a break
      const breakDuration = (currentTask?.pomodorosCompleted ?? 0) % 4 === 3 
        ? LONG_BREAK 
        : SHORT_BREAK;
      setTimeLeft(breakDuration);
      setIsBreak(true);
    } else {
      // After a break, start a new pomodoro
      setTimeLeft(POMODORO_DURATION);
      setIsBreak(false);
    }
  };

  const playNotificationSound = () => {
    // Create a simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? SHORT_BREAK : POMODORO_DURATION);
  };

  const skipToBreak = () => {
    setIsRunning(false);
    setIsBreak(true);
    setTimeLeft(SHORT_BREAK);
  };

  const skipToPomodoro = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(POMODORO_DURATION);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((SHORT_BREAK - timeLeft) / SHORT_BREAK) * 100
    : ((POMODORO_DURATION - timeLeft) / POMODORO_DURATION) * 100;

  return (
    <div className={`timer ${isBreak ? 'timer-break' : 'timer-focus'}`}>
      <div className="timer-card">
        <div className="timer-header">
          <span className="timer-mode">{isBreak ? '🌸 Break Time' : '🎯 Focus Time'}</span>
          {currentTask && !isBreak && (
            <div className="timer-task-info">
              <p className="timer-task-name">{currentTask.title}</p>
              <p className="timer-task-progress">
                {currentTask.pomodorosCompleted}/{currentTask.pomodorosTarget} 🍅
              </p>
            </div>
          )}
        </div>

        <div className="timer-display">
          <svg className="timer-circle" viewBox="0 0 200 200">
            <circle
              className="timer-circle-bg"
              cx="100"
              cy="100"
              r="90"
            />
            <circle
              className="timer-circle-progress"
              cx="100"
              cy="100"
              r="90"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            />
          </svg>
          <div className="timer-time">{formatTime(timeLeft)}</div>
        </div>

        <div className="timer-controls">
          <button 
            className="timer-button timer-button-primary"
            onClick={toggleTimer}
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button 
            className="timer-button timer-button-secondary"
            onClick={resetTimer}
          >
            🔄 Reset
          </button>
          {!isBreak ? (
            <button 
              className="timer-button timer-button-secondary"
              onClick={skipToBreak}
            >
              ⏭ Skip to Break
            </button>
          ) : (
            <button 
              className="timer-button timer-button-secondary"
              onClick={skipToPomodoro}
            >
              ⏭ Skip to Focus
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
