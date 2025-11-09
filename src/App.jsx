import React, { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TodosPage from "./pages/TodosPage";
import HistoryPage from "./pages/HistoryPage";
import { getCurrentUser } from "./utils/auth";

export default function App() {
  const [route, setRoute] = useState("todos");
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  function onAuthChange(u) {
    setUser(u);
    setRoute("todos");
  }

  return (
    <div className="app-root">
      <Nav
        onNavigate={setRoute}
        route={route}
        user={user}
        onLogout={() => onAuthChange(null)}
      />

      <main className="container">
        {route === "login" && (
          <Login onAuthChange={onAuthChange} onNavigate={setRoute} />
        )}
        {route === "register" && (
          <Register onAuthChange={onAuthChange} onNavigate={setRoute} />
        )}
        {route === "todos" && <TodosPage user={user} />}
        {route === "history" && <HistoryPage user={user} />}
      </main>
    </div>
  );
}
