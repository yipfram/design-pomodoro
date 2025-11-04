import { useState } from 'react';
import './AddTask.css';

interface AddTaskProps {
  onAdd: (title: string, pomodorosTarget: number) => void;
}

const AddTask = ({ onAdd }: AddTaskProps) => {
  const [title, setTitle] = useState('');
  const [pomodorosTarget, setPomodorosTarget] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), pomodorosTarget);
      setTitle('');
      setPomodorosTarget(4);
      setIsExpanded(false);
    }
  };

  return (
    <div className="add-task">
      {!isExpanded ? (
        <button 
          className="add-task-button"
          onClick={() => setIsExpanded(true)}
        >
          ➕ Add New Task
        </button>
      ) : (
        <form className="add-task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="add-task-input"
            placeholder="What would you like to focus on?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="add-task-pomodoro">
            <label htmlFor="pomodoros">Target Pomodoros:</label>
            <input
              id="pomodoros"
              type="number"
              min="1"
              max="20"
              value={pomodorosTarget}
              onChange={(e) => setPomodorosTarget(Number(e.target.value))}
            />
          </div>
          <div className="add-task-actions">
            <button type="submit" className="add-task-submit">
              Add Task
            </button>
            <button 
              type="button" 
              className="add-task-cancel"
              onClick={() => {
                setIsExpanded(false);
                setTitle('');
                setPomodorosTarget(4);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddTask;
