import { authFetch } from "./auth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

function qs(params = {}) {
  const pairs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  return pairs.length ? `?${pairs.join("&")}` : "";
}

export async function getTodos({
  page = 1,
  limit = 5,
  q,
  status,
  hideCompleted = true,
  sort,
} = {}) {
  const query = qs({ page, limit, q, status, hideCompleted, sort });
  const res = await authFetch(`${API_BASE}/todos${query}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch todos");
  }
  const json = await res.json();
  return json; // { data: [], meta: {} }
}

export async function createTodo(payload) {
  const res = await authFetch(`${API_BASE}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create todo");
  }
  return res.json();
}

export async function updateTodo(id, payload) {
  const res = await authFetch(`${API_BASE}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update todo");
  }
  return res.json();
}

export async function deleteTodo(id) {
  const res = await authFetch(`${API_BASE}/todos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete todo");
  }
  return res.json();
}

export async function listActivities({
  page = 1,
  limit = 10,
  sort = "date_desc",
  todoId,
} = {}) {
  const query = qs({ page, limit, sort, todoId });
  const res = await authFetch(`${API_BASE}/activities${query}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch activities");
  }
  return res.json();
}

export async function createActivity(payload) {
  const res = await authFetch(`${API_BASE}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create activity");
  }
  return res.json();
}
