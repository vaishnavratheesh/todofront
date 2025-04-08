import { useState, useEffect } from "react";
import axios from "axios";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import "./App.css";

// Backend URL variable
//const BACKEND_URL = "http://localhost:5000"; // for local development
 const BACKEND_URL = "https://todoback-lzys.onrender.com"; // for deployment

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/tasks`);
        setTasks(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Add a task to the backend
  const addTask = async (newTask) => {
    try {
      setError(null);
      const response = await axios.post(`${BACKEND_URL}/tasks`, {
        task: newTask,
      });
      setTasks((prevTasks) => [...prevTasks, response.data.task]);
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task. Please try again.");
    }
  };

  // Edit a task
  const editTask = async (id, updatedText) => {
    try {
      setError(null);
      console.log('Sending update request for task ID:', id, 'with text:', updatedText);
      
      const response = await axios.put(`${BACKEND_URL}/tasks/${id}`, {
        task: updatedText,
      });
      
      console.log('Update response:', response.data);
      
      if (response.data && response.data.task) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? response.data.task : task
          )
        );
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error("Error updating task:", error);
      console.error("Error details:", error.response?.data);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message;
      setError(`Failed to update task: ${errorMessage}`);
    }
  };

  // Delete a task from the backend
  const deleteTask = async (id) => {
    try {
      setError(null);
      await axios.delete(`${BACKEND_URL}/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <h1>Todo App</h1>
      {error && <div className="error-message">{error}</div>}
      <TaskInput addTask={addTask} />
      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <TaskList tasks={tasks} deleteTask={deleteTask} editTask={editTask} />
      )}
    </div>
  );
}

export default App;
