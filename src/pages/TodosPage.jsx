import React, { useEffect, useMemo, useState } from "react";
import {
  getTodos as apiGetTodos,
  createTodo as apiCreateTodo,
  updateTodo as apiUpdateTodo,
} from "../utils/storage";
import TodoForm from "../shared/TodoForm";
import EditModal from "../shared/EditModal";
import Modal from "../components/Modal";

const PAGE_SIZE = 5;

export default function TodosPage({ user }) {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // Fetch todos from API when filters change
  useEffect(() => {
    let mounted = true;
    async function fetchTodos() {
      setLoading(true);
      setError("");
      try {
        const params = {
          page,
          limit: 5,
          q: q || undefined,
          status: statusFilter === "all" ? undefined : statusFilter,
          hideCompleted: statusFilter === "all" ? true : false,
          sort: sortBy,
        };
        const resp = await apiGetTodos(params);
        if (!mounted) return;
        setTodos(resp.data || []);
        setTotalPages((resp.meta && resp.meta.pages) || 1);
      } catch (e) {
        setError(e.message || "Failed to load todos");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTodos();

    return () => {
      mounted = false;
    };
  }, [page, q, statusFilter, sortBy]);

  async function addTodo(item) {
    setError("");
    try {
      await apiCreateTodo({ name: item.name, priority: item.priority });
      // After create, jump to first page and refresh
      setPage(1);
    } catch (e) {
      setError(e.message || "Failed to create todo");
    } finally {
      setShowForm(false);
    }
  }

  async function updateTodo(updated) {
    setError("");
    try {
      await apiUpdateTodo(updated.id, {
        name: updated.name,
        status: updated.status,
        priority: updated.priority,
      });
      // refresh current page
      // trigger useEffect by changing page to same value
      setPage((p) => p);
    } catch (e) {
      setError(e.message || "Failed to update todo");
    } finally {
      setEditing(null);
    }
  }

  // We rely on server to filter/sort/paginate. pageItems == todos
  const pageItems = todos;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  return (
    <div>
      <div className="toolbar">
        <div>
          <button
            className="add-btn"
            aria-label={showForm ? "Close form" : "Add todo"}
            onClick={() => setShowForm((s) => !s)}
            title={showForm ? "Close" : "Add todo"}
          >
            {showForm ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5v14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="filters">
          <input
            placeholder="Search name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date_desc">Date (new→old)</option>
            <option value="date_asc">Date (old→new)</option>
            <option value="priority_desc">Priority (high→low)</option>
            <option value="priority_asc">Priority (low→high)</option>
          </select>
        </div>
      </div>

      {showForm && (
        <Modal onClose={() => setShowForm(false)} title="Add Todo">
          <TodoForm onSave={addTodo} onCancel={() => setShowForm(false)} />
        </Modal>
      )}

      {loading && <div className="empty">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="list card">
        {pageItems.length === 0 && !loading && (
          <div className="empty">No Data</div>
        )}
        {pageItems.map((t) => (
          <div className="todo-row" key={t.id}>
            <div className="todo-main">
              <div className="todo-name">{t.name}</div>
              <div className="todo-meta">
                <span
                  className={`badge badge-status badge-status-${t.status.replace(
                    /\s+/g,
                    "-"
                  )}`}
                >
                  {t.status === "progress" ? "In Progress" : t.status}
                </span>
                <span
                  className={`badge badge-priority badge-priority-${t.priority}`}
                >
                  P{t.priority}
                </span>
              </div>
            </div>
            <div className="todo-actions">
              <button
                className="icon-btn"
                title="Edit"
                aria-label="Edit"
                onClick={() => setEditing(t)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                >
                  <path
                    d="M3 21v-3.6L14.6 5.8a1 1 0 011.4 0l1.2 1.2a1 1 0 010 1.4L6.6 20.999H3z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.5 6.5l3 3"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {editing && (
        <EditModal
          todo={editing}
          onClose={() => setEditing(null)}
          onSave={updateTodo}
        />
      )}
    </div>
  );
}
