import React, { useState } from "react";
import { BsMicFill, BsMicMuteFill, BsTelephoneXFill } from "react-icons/bs";

const ActiveCallUI = ({ callerName, status, peer, localStream, onEndCall }) => {
    const [isMuted, setIsMuted] = useState(false);

    const handleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
        }
        setIsMuted((prev) => !prev);
    };

    const statusLabel = {
        calling: "Calling…",
        connected: "Connected",
        ended: "Call Ended",
    }[status] || status;

    const statusColor = {
        calling: "#facc15",
        connected: "#22c55e",
        ended: "#94a3b8",
    }[status] || "#fff";

    return (
        <div
            style={{
                position: "fixed",
                bottom: "30px",
                right: "30px",
                zIndex: 9999,
                background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)",
                border: "1px solid rgba(99,102,241,0.35)",
                borderRadius: "20px",
                padding: "24px",
                width: "290px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.15)",
                color: "#fff",
                textAlign: "center",
                animation: "slideInUp 0.3s ease",
            }}
        >
            <style>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes connectedPulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.45); }
                    50%     { box-shadow: 0 0 0 14px rgba(34,197,94,0); }
                }
                @keyframes callingPulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(250,204,21,0.45); }
                    50%     { box-shadow: 0 0 0 14px rgba(250,204,21,0); }
                }
            `}</style>

            {/* Animated avatar */}
            <div
                style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    fontWeight: "700",
                    margin: "0 auto 14px",
                    animation: status === "connected" ? "connectedPulse 1.8s infinite" : "callingPulse 1.2s infinite",
                }}
            >
                {callerName?.charAt(0)?.toUpperCase() || "?"}
            </div>

            {/* Name */}
            <div style={{ fontWeight: "700", fontSize: "1.05rem", marginBottom: "6px" }}>
                {callerName || "Unknown"}
            </div>

            {/* Status */}
            <div
                style={{
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    color: statusColor,
                    marginBottom: "22px",
                    letterSpacing: "0.03em",
                }}
            >
                ● {statusLabel}
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
                {/* Mute button */}
                <button
                    onClick={handleMute}
                    title={isMuted ? "Unmute" : "Mute"}
                    style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        border: "none",
                        background: isMuted
                            ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                            : "rgba(255,255,255,0.1)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontSize: "18px",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                    {isMuted ? <BsMicMuteFill /> : <BsMicFill />}
                </button>

                {/* End call button */}
                <button
                    onClick={onEndCall}
                    title="End Call"
                    style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        border: "none",
                        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontSize: "20px",
                        boxShadow: "0 4px 15px rgba(239,68,68,0.4)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                    <BsTelephoneXFill />
                </button>
            </div>

            {/* Mute label */}
            {isMuted && (
                <div
                    style={{
                        marginTop: "12px",
                        fontSize: "0.75rem",
                        color: "#f59e0b",
                        fontWeight: "600",
                    }}
                >
                    🔇 Microphone muted
                </div>
            )}
        </div>
    );
};

export default ActiveCallUI;
