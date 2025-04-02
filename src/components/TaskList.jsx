import "./TaskList.css";

function TaskList({ tasks, deleteTask }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className="task-item">
          <span>{task.task}</span>
          <div className="task-actions">
            <button
              onClick={() => deleteTask(task._id)} // Use task._id for deletion
              className="delete-button"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
