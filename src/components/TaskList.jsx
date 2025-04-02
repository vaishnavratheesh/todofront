import { useState } from "react";
import "./TaskList.css";

function TaskList({ tasks, deleteTask, updateTask }) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatedTask, setUpdatedTask] = useState("");

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setUpdatedTask(task.task); // Pre-fill input with the current task
  };

  const handleUpdate = (id) => {
    updateTask(id, updatedTask); // Call the updateTask function passed as a prop
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
