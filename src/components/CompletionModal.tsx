import { useEffect, useState } from 'react';
import { Task } from '../types';
import './CompletionModal.css';

interface CompletionModalProps {
  isOpen: boolean;
  isBreak: boolean;
  task: Task | undefined;
  onStartBreak: () => void;
  onContinueWorking: () => void;
  onClose: () => void;
}

function CompletionModal({
  isOpen,
  isBreak,
  task,
  onStartBreak,
  onContinueWorking,
  onClose,
}: CompletionModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const progress = task
    ? Math.round((task.completedPomodoros / task.targetPomodoros) * 100)
    : 0;

  return (
    <div className="completion-modal-overlay" onClick={onClose}>
      <div
        className={`completion-modal ${isAnimating ? 'animate' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="completion-modal-header">
          {isBreak ? (
            <>
              <div className="completion-icon">🌿</div>
              <h2>Pause terminée !</h2>
              <p>Prêt à te reconcentrer ?</p>
            </>
          ) : (
            <>
              <div className="completion-icon">🎯</div>
              <h2>Pomodoro terminé !</h2>
              <p>Excellent travail ! Tu mérites une pause.</p>
            </>
          )}
        </div>

        {!isBreak && task && (
          <div className="completion-task-info">
            <h3>{task.title}</h3>
            <div className="completion-progress">
              <div className="completion-progress-bar">
                <div
                  className="completion-progress-fill"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <span className="completion-progress-text">
                {task.completedPomodoros} / {task.targetPomodoros} pomodoros
              </span>
            </div>
          </div>
        )}

        <div className="completion-modal-actions">
          {isBreak ? (
            <>
              <button
                className="completion-btn completion-btn-primary"
                onClick={onContinueWorking}
              >
                Commencer un pomodoro
              </button>
              <button
                className="completion-btn completion-btn-secondary"
                onClick={onClose}
              >
                Fermer
              </button>
            </>
          ) : (
            <>
              <button
                className="completion-btn completion-btn-primary"
                onClick={onStartBreak}
              >
                Démarrer la pause (5 min)
              </button>
              <button
                className="completion-btn completion-btn-secondary"
                onClick={onContinueWorking}
              >
                Continuer à travailler
              </button>
            </>
          )}
        </div>

        <button className="completion-modal-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default CompletionModal;
