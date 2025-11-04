import { Task } from '../types';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  currentTaskId: string | null;
  onSelectTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList = ({ tasks, currentTaskId, onSelectTask, onDeleteTask }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p className="empty-message">🌱 No tasks yet</p>
        <p className="empty-submessage">Add your first task to begin your focused journey</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2 className="task-list-title">Your Tasks</h2>
      <div className="task-list-items">
        {tasks.map(task => {
          const isComplete = task.pomodorosCompleted >= task.pomodorosTarget;
          const progress = (task.pomodorosCompleted / task.pomodorosTarget) * 100;
          
          return (
            <div 
              key={task.id} 
              className={`task-item ${task.id === currentTaskId ? 'task-item-active' : ''} ${isComplete ? 'task-item-complete' : ''}`}
              onClick={() => onSelectTask(task.id)}
            >
              <div className="task-item-content">
                <div className="task-item-header">
                  <h3 className="task-item-title">{task.title}</h3>
                  <button
                    className="task-item-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="task-item-progress">
                  <div className="task-item-progress-bar">
                    <div 
                      className="task-item-progress-fill"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <span className="task-item-progress-text">
                    {task.pomodorosCompleted}/{task.pomodorosTarget} 🍅
                  </span>
                </div>

                {isComplete && (
                  <div className="task-item-badge">
                    ✨ Complete
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
