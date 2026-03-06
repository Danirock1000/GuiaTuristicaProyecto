import { createContext, useContext, useState } from "react";

type User = {
id?: number;
email: string;
token?: string;
} | null;

type AuthContextType = {
user: User;
isAllowed: boolean;

login: (email: string, password: string) => boolean;

logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
    return context;
};

export const AuthProvider = ({children}: {children: React.ReactNode}) => {

    const [user, setUser] = useState<User>(null);
    const [isAllowed, setIsAllowed] = useState<boolean>(false);

    const login = (email: string, password: string) => {
        
        const allowed = email.endsWith(".com");
            if (allowed) {
            setUser({email})
            setIsAllowed(allowed)
            }
        return allowed;
    }

    const logout = () => {
        setUser(null);
        setIsAllowed(false);
    }

    return (
        <AuthContext.Provider value={{user, isAllowed, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

}

