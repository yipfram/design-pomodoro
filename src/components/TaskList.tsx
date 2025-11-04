import { useState } from 'react';
import { Task } from '../types';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  currentTaskId: string | null;
  onAddTask: (title: string, targetPomodoros: number) => void;
  onDeleteTask: (id: string) => void;
  onSelectTask: (id: string) => void;
  onCompletePomodoro: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export default function TaskList({
  tasks,
  currentTaskId,
  onAddTask,
  onDeleteTask,
  onSelectTask,
  onToggleComplete,
}: TaskListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim(), newTaskPomodoros);
      setNewTaskTitle('');
      setNewTaskPomodoros(4);
      setIsAdding(false);
    }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>📝 Tasks</h2>
        <button
          className="add-task-button"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? '✕ Cancel' : '+ Add Task'}
        </button>
      </div>

      {isAdding && (
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="task-input"
            placeholder="What do you want to focus on?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            autoFocus
          />
          <div className="pomodoro-input-group">
            <label htmlFor="pomodoros">Target Pomodoros:</label>
            <input
              type="number"
              id="pomodoros"
              min="1"
              max="20"
              value={newTaskPomodoros}
              onChange={(e) => setNewTaskPomodoros(Number(e.target.value))}
            />
          </div>
          <button type="submit" className="submit-task-button">
            Add Task
          </button>
        </form>
      )}

      <div className="tasks-section">
        {activeTasks.length === 0 && !isAdding && (
          <div className="empty-state">
            <p>🌱 Start by adding your first task</p>
          </div>
        )}

        {activeTasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${currentTaskId === task.id ? 'active' : ''}`}
            onClick={() => onSelectTask(task.id)}
          >
            <div className="task-content">
              <div className="task-header-row">
                <h3 className="task-title">{task.title}</h3>
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                >
                  ✕
                </button>
              </div>
              <div className="task-progress">
                <div className="pomodoro-counter">
                  🍅 {task.completedPomodoros} / {task.targetPomodoros}
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(task.completedPomodoros / task.targetPomodoros) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            {task.completedPomodoros >= task.targetPomodoros && (
              <button
                className="complete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(task.id);
                }}
              >
                ✓ Mark Complete
              </button>
            )}
          </div>
        ))}
      </div>

      {completedTasks.length > 0 && (
        <div className="completed-section">
          <h3 className="completed-header">✅ Completed</h3>
          {completedTasks.map((task) => (
            <div key={task.id} className="task-item completed">
              <div className="task-content">
                <div className="task-header-row">
                  <h3 className="task-title">{task.title}</h3>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="pomodoro-counter completed">
                  🍅 {task.completedPomodoros} / {task.targetPomodoros}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
