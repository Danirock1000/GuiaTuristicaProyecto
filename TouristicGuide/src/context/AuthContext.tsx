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

  const mapAuthUser = (
    authUser: {
      id: string;
      email?: string | null;
      created_at?: string;
      user_metadata?: Record<string, any>;
    } | null,
    accessToken?: string
  ): User => {
    if (!authUser) return null;

    return {
      id: String(authUser.id),
      name: authUser.user_metadata?.name ?? "",
      email: authUser.email ?? "",
      avatarUrl: authUser.user_metadata?.avatarUrl ?? "",
      role: authUser.user_metadata?.role ?? "user",
      isActive: true,
      createdAt: authUser.created_at ?? new Date().toISOString(),
      token: accessToken,
    };
  };

  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const currentUser = mapAuthUser(data.session.user, data.session.access_token);
          setUser(currentUser);
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
          return;
        }

        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (!stored) return;

        try {
          setUser(JSON.parse(stored));
        } catch {
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (e) {
        console.error("Error cargando sesión:", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }

      const currentUser = mapAuthUser(session.user, session.access_token);
      setUser(currentUser);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      throw new Error(error.message || "Error al iniciar sesión");
    }
    
    if (!data.user) {
      throw new Error("Usuario no encontrado");
    }

    const signedUser = mapAuthUser(data.user, data.session?.access_token);

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
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register}}>
      {children}
    </AuthContext.Provider>
  );
};
