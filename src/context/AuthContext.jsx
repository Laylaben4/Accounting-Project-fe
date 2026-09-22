import { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "compta-mvp:user";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback(async ({ email, password }) => {
    // Dummy auth: simulate network latency and accept any well-formed credentials.
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (!email || !password || password.length < 4) {
      throw new Error("Identifiants invalides (mot de passe : 4 caractères minimum).");
    }
    const name = email.split("@")[0];
    const nextUser = {
      email,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      role: "Comptable",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
