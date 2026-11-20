import { createContext, useContext, useState } from "react";
import { api } from "../services/api";
const C = createContext();
export const useAuth = () => useContext(C);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("syncwave-user") || "null"),
  );
  const submit = async (type, body) => {
    const data = await api(`/auth/${type}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    localStorage.setItem("syncwave-token", data.token);
    localStorage.setItem("syncwave-user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };
  return (
    <C.Provider value={{ user, submit, logout, setUser }}>
      {children}
    </C.Provider>
  );
}
