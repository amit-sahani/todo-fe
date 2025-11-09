import React, { useState } from "react";
import { login } from "../utils/auth";
import Modal from "../components/Modal";

export default function Login({ onAuthChange, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const u = await login({ email, password });
      onAuthChange(u);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <Modal onClose={() => onNavigate("todos")} title="Login">
      <form className="auth-form" onSubmit={submit}>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="row auth-actions">
          <button type="submit" className="primary">
            Login
          </button>
          <button
            type="button"
            className="link"
            onClick={() => onNavigate("register")}
          >
            Or Register
          </button>
        </div>
        {err && <div className="error">{err}</div>}
      </form>
    </Modal>
  );
}
