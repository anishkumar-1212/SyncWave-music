import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export default function Auth() {
  const [register, setRegister] = useState(false),
    [form, setForm] = useState({
      username: "",
      email: "",
      password: "",
      confirm: "",
    }),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const { submit } = useAuth();
  const go = async (e) => {
    e.preventDefault();
    if (register && form.password !== form.confirm)
      return setError("Passwords do not match");
    setLoading(true);
    setError("");
    try {
      await submit(register ? "register" : "login", form);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth">
      <form onSubmit={go}>
        <div className="brand">
          <i>≈</i> SyncWave
        </div>
        <h1>{register ? "Create your account" : "Welcome back"}</h1>
        <p>Music feels better together.</p>
        {register && (
          <input
            required
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        )}
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          required
          minLength="6"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {register && (
          <input
            required
            type="password"
            placeholder="Confirm password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
        )}{" "}
        {error && <div className="error">{error}</div>}
        <button className="primary" disabled={loading}>
          {loading ? "Please wait…" : register ? "Sign up" : "Log in"}
        </button>
        <button
          type="button"
          className="text"
          onClick={() => {
            setRegister(!register);
            setError("");
          }}
        >
          {register
            ? "Already have an account? Log in"
            : "New to SyncWave? Sign up"}
        </button>
      </form>
    </div>
  );
}
