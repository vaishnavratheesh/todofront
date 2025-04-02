import { useState } from "react";
import axios from "axios";
import "./TaskList.css";

const BACKEND_URL = "http://localhost:5000"; // Replace with your backend URL

function TaskList({ tasks, deleteTask, setTasks }) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatedTask, setUpdatedTask] = useState("");

  const updateTask = async (id, updatedTask) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/tasks/${id}`, {
        task: updatedTask, // Ensure this matches the backend's expected format
      });
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
