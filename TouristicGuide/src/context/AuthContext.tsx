import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: number;
  nombre: string;
  email: string;
  role: "admin" | "user";
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (userData: { id: number; nombre: string; email: string; role: "admin" | "user" }) => Promise<void>;
  logout: () => Promise<void>;
};

const HARDCODED_USERS = [
  {
    id: 1,
    nombre: "Administrador",
    email: "admin@turimap.com",
    password: "admin123",
    role: "admin" as const,
  },
  {
    id: 2,
    nombre: "Usuario",
    email: "user@turimap.com",
    password: "user123",
    role: "user" as const,
  },
];

export const findUser = (email: string, password: string) => {
  return HARDCODED_USERS.find(
    (u) => u.email === email && u.password === password
  ) || null;
};

const AUTH_STORAGE_KEY = "@turimap_user";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error cargando sesión:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData: { id: number; nombre: string; email: string; role: "admin" | "user" }) => {
    setUser(userData);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
