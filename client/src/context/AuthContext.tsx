import { createContext, useContext, useState, ReactNode } from "react";
import API from "../api/axios";
import { User, AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            return JSON.parse(localStorage.getItem("stax_user") || "null");
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("stax_token") || null;
    });

    const login = async (email: string, password: string): Promise<User> => {
        const res = await API.post("/auth/login", { email, password });

        console.log("Login response:", res.data);

        const { token: authToken, user: authUser } = res.data;

        setToken(authToken);
        setUser(authUser);

        localStorage.setItem("stax_token", authToken);
        localStorage.setItem("stax_user", JSON.stringify(authUser));

        return authUser;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("stax_token");
        localStorage.removeItem("stax_user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};