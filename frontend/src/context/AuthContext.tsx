import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";

type User = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
};

type ProfileUpdate = {
  username?: string;
  bio?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: ProfileUpdate) => Promise<User>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const login = async (newToken: string) => {
    try {
      localStorage.setItem("token", newToken);
      setToken(newToken);

      const res = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });

      setUser(res.data);
    } catch {
      logout();
      throw new Error("Could not load account details");
    }
  };

  const updateUser = async (data: ProfileUpdate) => {
    const res = await api.put<User>("/users/me", data);
    setUser(res.data);
    return res.data;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      login(storedToken).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
