import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

// ── Read THIS TAB's user ID from sessionStorage (per-tab, isolated) ──────────
// Falls back to localStorage only for the initial page reload case,
// where sessionStorage was already populated by AuthContext on mount.
const getThisTabUserId = () => {
    try {
        const sessionInfo = sessionStorage.getItem("sessionUserInfo");
        if (sessionInfo) return JSON.parse(sessionInfo)._id;
        // Fallback: first page load before AuthContext has run
        const localInfo = localStorage.getItem("userInfo");
        return localInfo ? JSON.parse(localInfo)._id : null;
    } catch {
        return null;
    }
};

export const SocketProvider = ({ children }) => {
    const [incomingCall, setIncomingCall] = useState(null);
    const [activeCall, setActiveCall] = useState(null);
    const socketRef = useRef(null);
    const registeredUserIdRef = useRef(null); // tracks which userId THIS tab registered

    // Exposed so CallButton can re-register before a call
    const registerUser = (userId) => {
        if (socketRef.current?.connected && userId) {
            socketRef.current.emit("register", userId);
            registeredUserIdRef.current = userId;
            console.log("[Socket] Registered user:", userId);
        }
    };

    useEffect(() => {
        const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
            transports: ["websocket"],
        });
        socketRef.current = socket;

        // ── Register on initial connect ──────────────────────────────────────
        socket.on("connect", () => {
            console.log("[Socket] Connected:", socket.id);
            const userId = getThisTabUserId();
            if (userId) {
                socket.emit("register", userId);
                registeredUserIdRef.current = userId;
            }
        });

        // ── Re-register on reconnect (network hiccup, tab wake-up, etc.) ────
        socket.on("reconnect", () => {
            const userId = getThisTabUserId();
            if (userId) {
                socket.emit("register", userId);
                registeredUserIdRef.current = userId;
                console.log("[Socket] Re-registered after reconnect:", userId);
            }
        });

        // ── Incoming call ────────────────────────────────────────────────────
        socket.on("incoming-call", ({ callerId, callerName, signal }) => {
            console.log("[Socket] Incoming call from:", callerName, callerId);
            setIncomingCall({ callerId, callerName, signal });
        });

        // ── Other party ended the call ───────────────────────────────────────
        socket.on("call-ended", () => {
            setActiveCall((prev) => {
                if (prev?.peer) prev.peer.destroy();
                return null;
            });
            setIncomingCall(null);
        });

        // ── Receiver rejected the call ───────────────────────────────────────
        socket.on("call-rejected", () => {
            setActiveCall((prev) => {
                if (prev?.peer) prev.peer.destroy();
                return null;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // ── Listen for THIS TAB's own login/logout via CustomEvent ───────────────
    // CustomEvent ("roommate-auth-changed") fires ONLY in the tab that called it.
    // This keeps each tab's socket registration completely independent of other tabs.
    useEffect(() => {
        const handleAuthChange = (e) => {
            const userId = e.detail?.userId;
            if (userId) {
                // User logged in — register this tab's socket
                if (socketRef.current?.connected) {
                    socketRef.current.emit("register", userId);
                    registeredUserIdRef.current = userId;
                    console.log("[Socket] Registered after login:", userId);
                }
            } else {
                // User logged out — unregister (server handles on disconnect)
                registeredUserIdRef.current = null;
                console.log("[Socket] User logged out, cleared registration");
            }
        };

        window.addEventListener("roommate-auth-changed", handleAuthChange);
        return () => window.removeEventListener("roommate-auth-changed", handleAuthChange);
    }, []);

    return (
        <SocketContext.Provider
            value={{
                socket: socketRef,
                incomingCall,
                setIncomingCall,
                activeCall,
                setActiveCall,
                registerUser,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
