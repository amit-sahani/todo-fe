import React, { useState } from "react";
import { register } from "../utils/auth";
import Modal from "../components/Modal";

export default function Register({ onAuthChange, onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const u = await register({ name, email, password });
      onAuthChange(u);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <Modal onClose={() => onNavigate("todos")} title="Register">
      <form className="auth-form" onSubmit={submit}>
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
            Register
          </button>
          <button
            type="button"
            className="link"
            onClick={() => onNavigate("login")}
          >
            Or Login
          </button>
        </div>
        {err && <div className="error">{err}</div>}
      </form>
    </Modal>
  );
}
