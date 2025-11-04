import { useState, useEffect } from 'react';
import { Task } from './types';
import { loadTasks, saveTasks } from './storage';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (title: string, pomodorosTarget: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      pomodorosTarget,
      pomodorosCompleted: 0,
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const incrementPomodoro = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, pomodorosCompleted: task.pomodorosCompleted + 1 } 
        : task
    ));
  };

  return { tasks, addTask, deleteTask, updateTask, incrementPomodoro };
};
