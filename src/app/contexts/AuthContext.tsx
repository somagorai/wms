import { createContext, useContext, ReactNode, useState, useEffect } from "react";

type User = {
  username: string;
  role: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
      }
    }
    return null;
  });

  // Save to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user]);

  const login = (username: string, password: string): boolean => {
    // Valid credentials
    const validCredentials = [
      { username: "admin", password: "admin", role: "admin" as const },
      { username: "user", password: "user", role: "user" as const },
    ];

    const credential = validCredentials.find(
      (cred) => cred.username === username && cred.password === password
    );

    if (credential) {
      setUser({ username: credential.username, role: credential.role });
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
