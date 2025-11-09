import React, { useState } from "react";

export default function TodoForm({ onSave, onCancel, initial }) {
  const [name, setName] = useState(initial?.name || "");
  const [status, setStatus] = useState(initial?.status || "todo");
  const [priority, setPriority] = useState(initial?.priority || 1);

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      status,
      priority: Number(priority),
      ...(initial?.todoId ? { todoId: initial.todoId } : {}),
    });
  }

  return (
    <div className="card form-card">
      <form onSubmit={submit}>
        <div className="form-row">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="todo">Todo</option>
            <option value="progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-row">
          <label>Priority</label>
          <input
            type="number"
            min="1"
            max="5"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />
        </div>
        <div className="row">
          <button type="submit" className="primary">
            Save
          </button>
          <button type="button" className="link" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
