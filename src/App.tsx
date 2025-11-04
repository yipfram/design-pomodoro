import { useState, useEffect } from 'react';
import './App.css';
import { useTasks } from './hooks';
import Timer from './components/Timer';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';

function App() {
  const { tasks, addTask, deleteTask, incrementPomodoro } = useTasks();
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  // Select first task if none selected
  useEffect(() => {
    if (!currentTaskId && tasks.length > 0) {
      setCurrentTaskId(tasks[0].id);
    }
  }, [tasks, currentTaskId]);

  const handlePomodoroComplete = () => {
    if (currentTaskId) {
      incrementPomodoro(currentTaskId);
    }
  };

  const currentTask = tasks.find(task => task.id === currentTaskId);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🍃 Zen Pomodoro</h1>
        <p className="app-subtitle">Focus with mindfulness</p>
      </header>
      
      <main className="app-main">
        <div className="timer-section">
          <Timer 
            onComplete={handlePomodoroComplete}
            currentTask={currentTask}
          />
        </div>

        <div className="tasks-section">
          <AddTask onAdd={addTask} />
          <TaskList 
            tasks={tasks}
            currentTaskId={currentTaskId}
            onSelectTask={setCurrentTaskId}
            onDeleteTask={deleteTask}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>Stay focused, stay peaceful 🌿</p>
      </footer>
    </div>
  );
}

export default App;
