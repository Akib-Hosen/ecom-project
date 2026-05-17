"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

type User = {
    id: number;
    name: string;
    email: string;
    role: "seller" | "customer";
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user && !!token;

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        }

        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.post("/auth/login", {
        email,
        password,
        });

        const accessToken = response.data.accessToken;
        const loggedUser = response.data.user;

        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(loggedUser));

        setToken(accessToken);
        setUser(loggedUser);

        if (loggedUser.role === "seller") {
        router.push("/seller/dashboard");
        } else {
        router.push("/products");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);

        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{user, token, isAuthenticated, loading, login, logout,}}>
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