import React, { useState, useCallback, createContext, useContext } from 'react';
// Create Context for task state
const TaskContext = createContext();



const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  // Memoized function to add a task
  const addTask = useCallback((taskText) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: Date.now(), text: taskText, completed: false },
    ]);
  }, []);

  // Memoized function to toggle task completion
  const toggleTask = useCallback((id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  // Memoized function to get filtered tasks
  const getFilteredTasks = useCallback(() => {
    if (filter === 'All') return tasks;
    return tasks.filter((task) =>
      filter === 'Completed' ? task.completed : !task.completed
    );
  }, [tasks, filter]);

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, filter, setFilter, getFilteredTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

// Component to add new tasks
const TaskForm = () => {
  const [taskText, setTaskText] = useState('');
  const { addTask } = useContext(TaskContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskText.trim()) {
      addTask(taskText);
      setTaskText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Add a task"
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

// Component to filter tasks
const TaskFilter = () => {
  const { setFilter } = useContext(TaskContext);

  return (
    <div>
      <button onClick={() => setFilter('All')}>All</button>
      <button onClick={() => setFilter('Completed')}>Completed</button>
      <button onClick={() => setFilter('Pending')}>Pending</button>
    </div>
  );
};

// Component to display task list
const TaskList = () => {
  const { getFilteredTasks, toggleTask } = useContext(TaskContext);
  const filteredTasks = getFilteredTasks();

  return (
    <ul>
      {filteredTasks.map((task) => (
        <li key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
          <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.text}
          </span>
        </li>
      ))}
    </ul>
  );
};

// Main App component
const App1 = () => {
  return (
    <TaskProvider>
      <div className="App">
        <h1>Task Manager</h1>
        <TaskForm />
        <TaskFilter />
        <TaskList />
      </div>
    </TaskProvider>
  );
};
export default App1;