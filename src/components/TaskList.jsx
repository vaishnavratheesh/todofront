import React, { useState } from 'react';
import './TaskList.css';

function TaskList({ tasks, deleteTask, editTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editError, setEditError] = useState(null);

  const startEditing = (task) => {
    console.log('Starting to edit task:', task);
    setEditingId(task._id);
    setEditText(task.task);
    setEditError(null);
  };

  const handleEdit = async (id) => {
    if (editText.trim() === '') {
      setEditError('Task text cannot be empty');
      return;
    }
    console.log('Attempting to edit task with ID:', id);
    try {
      await editTask(id, editText);
      setEditingId(null);
      setEditText('');
      setEditError(null);
    } catch (error) {
      console.error('Error in handleEdit:', error);
      setEditError('Failed to save changes');
    }
  };

  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handleEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditError(null);
  };

  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks yet. Add one above!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              {editingId === task._id ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, task._id)}
                    className={`edit-input ${editError ? 'error' : ''}`}
                    autoFocus
                  />
                  <button
                    onClick={() => handleEdit(task._id)}
                    className="save-button"
                    disabled={!editText.trim()}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                  {editError && <div className="edit-error">{editError}</div>}
                </div>
              ) : (
                <>
                  <span className="task-text">{task.task}</span>
                  <div className="button-container">
                    <button
                      onClick={() => startEditing(task)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList; 