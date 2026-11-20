import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
const C = createContext();
export const useSession = () => useContext(C);
const deviceId = localStorage.getItem("syncwave-device") || crypto.randomUUID();
localStorage.setItem("syncwave-device", deviceId);
export function SessionProvider({ children }) {
  const socket = useRef();
  const [state, setState] = useState(null);
  const [notice, setNotice] = useState("Offline");
  useEffect(() => {
    const s = (socket.current = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5001",
      { autoConnect: true },
    ));
    s.on("connect", () => setNotice("Connected"));
    s.on("disconnect", () => setNotice("Reconnecting…"));
    ["session:state", "playback:state"].forEach((e) => s.on(e, setState));
    s.on("session:error", (e) => {
      setNotice(e.message);
      setState(null);
    });
    return () => s.close();
  }, []);
  const call = (event, payload) =>
    new Promise((resolve) =>
      socket.current.emit(
        event,
        {
          ...payload,
          deviceId,
          name: localStorage.getItem("syncwave-device-name") || "My device",
        },
        resolve,
      ),
    );
  const create = async () => {
    const r = await call("session:create", {});
    if (r.ok) setState(r.state);
    else throw Error(r.message);
    return r;
  };
  const join = async (code) => {
    const r = await call("session:join", { code });
    if (r.ok) setState(r.state);
    else throw Error(r.message);
    return r;
  };
  const command = (x) => socket.current?.emit("playback:command", x);
  return (
    <C.Provider value={{ state, notice, deviceId, create, join, command }}>
      {children}
    </C.Provider>
  );
}
