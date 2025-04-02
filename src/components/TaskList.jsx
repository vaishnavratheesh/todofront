import { useState } from "react";
import axios from "axios";
import "./TaskList.css";

const BACKEND_URL = "http://localhost:5000"; // Replace with your backend URL

function TaskList({ tasks, deleteTask, setTasks }) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatedTask, setUpdatedTask] = useState("");

  const updateTask = async (id, updatedTask) => {
    try {
      console.log("Sending update request:", { id, updatedTask });
      const response = await axios.put(`${BACKEND_URL}/tasks/${id}`, {
        task: updatedTask,
      });
      console.log("Response from backend:", response.data);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, task: response.data.task } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setUpdatedTask(task.task); // Pre-fill input with the current task
  };

  const handleUpdate = (id) => {
    if (updatedTask.trim() === "") {
      console.error("Task cannot be empty");
      return;
    }
    updateTask(id, updatedTask); // Call the updateTask function
    setEditingTaskId(null); // Exit edit mode
    setUpdatedTask(""); // Clear input
  };

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className="task-item">
          {editingTaskId === task._id ? (
            <div className="edit-mode">
              <input
                type="text"
                value={updatedTask}
                onChange={(e) => setUpdatedTask(e.target.value)}
                className="edit-input"
              />
              <button onClick={() => handleUpdate(task._id)} className="save-button">
                Save
              </button>
              <button onClick={() => setEditingTaskId(null)} className="cancel-button">
                Cancel
              </button>
            </div>
          ) : (
            <>
              <span>{task.task}</span>
              <div className="task-actions">
                <button onClick={() => handleEditClick(task)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => deleteTask(task._id)} className="delete-button">
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Example Task Schema
const TaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
});

const Task = mongoose.model('Task', TaskSchema);

// PUT /tasks/:id Endpoint
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { task },
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = 5000;
mongoose
  .connect('mongodb://localhost:27017/todo', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.error('Database connection error:', error));
