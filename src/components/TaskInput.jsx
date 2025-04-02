import { useState } from "react";
import "./TaskInput.css";

function TaskInput({ addTask }) {
  const [newTask, setNewTask] = useState("");

  const handleInsert = () => {
    if (newTask.trim() === "") return;
    addTask(newTask); // Call the addTask function passed from App
    setNewTask("");
  };

  return (
    <div className="task-input-container">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter a task"
        className="task-input"
      />
      <button onClick={handleInsert} className="task-button">
        Insert
      </button>
    </div>
  );
}

export default TaskInput;
