// Minimal API-backed auth helper

// ✅ Updated variable name and correct default
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const TOKEN_KEY = "todo_token_v1";
const CURRENT_KEY = "todo_current_user";

async function handleError(res) {
  let err = "Server error";
  try {
    const json = await res.json();
    err = json.error || json.message || JSON.stringify(json);
  } catch (e) {}
  throw new Error(err);
}

export async function register({ name, email, password }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) return handleError(res);
  const data = await res.json();
  if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
  if (data.user) localStorage.setItem(CURRENT_KEY, JSON.stringify(data.user));
  return data.user;
}

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return handleError(res);
  const data = await res.json();
  if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
  if (data.user) localStorage.setItem(CURRENT_KEY, JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_KEY) || "null");
  } catch (e) {
    return null;
  }
}

export function authFetch(url, opts = {}) {
  const token = getToken();
  const headers = opts.headers || {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(url, { ...opts, headers });
}
