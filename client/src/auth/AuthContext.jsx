import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/client"; 

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);       
    const [loading, setLoading] = useState(true); // true while we check /auth/me on app load

    // Runs once when the app starts:
    // If a token exists, validate it by calling /auth/me and store the user.
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const data = await apiFetch("/api/auth/me"); // expects { user: {...} }
                setUser(data.user);
            } catch (err) {
                // Token is invalid/expired/etc. Clear it out.
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Call this after successful POST /auth/login
    // It saves token then fetches /auth/me to populate user.
    const loginWithToken = async (token) => {
        localStorage.setItem("token", token);

        const data = await apiFetch("/api/auth/me");
        setUser(data.user);

        return data.user;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated: !!user,
            setUser,            
            loginWithToken,     
            logout,
        }),
        [user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
    return ctx;
}