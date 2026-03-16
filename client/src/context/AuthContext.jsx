import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On mount: restore session from sessionStorage first (per-tab),
        // then fall back to localStorage (for page reload in the same tab).
        const sessionUser = sessionStorage.getItem("sessionUserInfo");
        const storedUser = sessionUser || localStorage.getItem("userInfo");
        const storedToken = sessionStorage.getItem("sessionToken") || localStorage.getItem("token");

        if (storedUser && storedToken) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setToken(storedToken);
            // Make sure sessionStorage is populated for the socket layer
            if (!sessionUser) {
                sessionStorage.setItem("sessionUserInfo", storedUser);
                sessionStorage.setItem("sessionToken", storedToken);
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);

        // ── Persist globally (for page reloads) ─────────────────────────────
        localStorage.setItem("userInfo", JSON.stringify(userData));
        localStorage.setItem("token", authToken);
        localStorage.setItem("isLoggedIn", "true");

        // ── Persist per-tab (prevents cross-tab socket interference) ─────────
        sessionStorage.setItem("sessionUserInfo", JSON.stringify(userData));
        sessionStorage.setItem("sessionToken", authToken);

        // ── Notify SocketContext in THIS tab only via CustomEvent ─────────────
        // Using a CustomEvent (not "storage") ensures ONLY this tab registers —
        // the native "storage" event would fire in OTHER tabs and corrupt them.
        window.dispatchEvent(
            new CustomEvent("roommate-auth-changed", { detail: { userId: userData._id } })
        );
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        // Clear this tab's session too
        sessionStorage.removeItem("sessionUserInfo");
        sessionStorage.removeItem("sessionToken");
        // Notify socket to unregister
        window.dispatchEvent(
            new CustomEvent("roommate-auth-changed", { detail: { userId: null } })
        );
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
        sessionStorage.setItem("sessionUserInfo", JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
