import { createContext, useContext, useState, useEffect } from "react";
import {supabase} from "../services/supabaseClient"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {User} from "../types/user"

const AUTH_STORAGE_KEY = "@turimap_user";

type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string ) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;

};

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

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      throw new Error(error.message || "Error al iniciar sesión");
    }
    
    if (!data.user) {
      throw new Error("Usuario no encontrado");
    }

    const signedUser: User = {
      id: String(data.user.id),
      name: (data.user.user_metadata as any)?.name ?? "",
      email: data.user.email ?? "",
      avatarUrl: (data.user.user_metadata as any)?.avatarUrl ?? "",
      role: (data.user.user_metadata as any)?.role ?? "user",
      isActive: true,
      createdAt: data.user.created_at ?? new Date().toISOString(),
      token: data.session?.access_token,
    };

    setUser(signedUser);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(signedUser));
  };

  const register = async (email: string, password: string, name: string) => {
    const {data, error} = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    if (!data.user) throw new Error("Error al registrar usuario");

    // For registration, we might want to automatically sign in the user
    // or show a message that they need to confirm their email
    // For now, we'll just return without setting the user
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register}}>
      {children}
    </AuthContext.Provider>
  );
};
