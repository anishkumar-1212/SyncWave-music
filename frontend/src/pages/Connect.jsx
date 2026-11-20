import { useState } from "react";
import { useSession } from "../context/SessionContext";
export default function Connect() {
  const { state, notice, create, join } = useSession();
  const [code, setCode] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const act = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="connect">
      <header>
        <p>LISTEN TOGETHER</p>
        <h1>Connect a device</h1>
        <p>{notice}</p>
      </header>
      {state ? (
        <div className="session-card">
          <span>YOUR PAIRING CODE</span>
          <strong>{state.code || "Connected"}</strong>
          <p>{state.devices?.length || 0} of 2 devices connected</p>
          <small>
            Code expires in about five minutes. Playback controls now sync
            across connected devices.
          </small>
        </div>
      ) : (
        <div className="connect-grid">
          <div className="session-card">
            <h2>Start a session</h2>
            <p>Create a six-digit code for a friend or second device.</p>
            <button
              className="primary"
              disabled={busy}
              onClick={() => act(create)}
            >
              Create code
            </button>
          </div>
          <form
            className="session-card"
            onSubmit={(e) => {
              e.preventDefault();
              act(() => join(code));
            }}
          >
            <h2>Join a session</h2>
            <p>Enter the code shown on the other device.</p>
            <input
              required
              maxLength="6"
              inputMode="numeric"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
            <button className="primary" disabled={busy || code.length !== 6}>
              Join session
            </button>
          </form>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </section>
  );
}
