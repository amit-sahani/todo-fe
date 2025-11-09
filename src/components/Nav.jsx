import React from "react";
import { logout, getCurrentUser } from "../utils/auth";

export default function Nav({ onNavigate, route, user, onLogout }) {
  const u = user || getCurrentUser();

  return (
    <nav className="nav">
      <div className="nav-left">
        <button
          className={route === "todos" ? "active" : ""}
          onClick={() => onNavigate("todos")}
        >
          Todos
        </button>
        {u && (
          <button
            className={route === "history" ? "active" : ""}
            onClick={() => onNavigate("history")}
          >
            History
          </button>
        )}
      </div>

      <div className="nav-right">
        {!u && (
          <>
            <button onClick={() => onNavigate("login")}>Login</button>
            <button onClick={() => onNavigate("register")}>Register</button>
          </>
        )}
        {u && (
          <>
            <span className="nav-user">{u.name}</span>
            <button
              onClick={() => {
                logout();
                onLogout();
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
