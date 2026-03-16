import React, { useRef, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import ActiveCallUI from "./ActiveCallUI";

const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
    ],
};

const IncomingCallModal = () => {
    const { socket, incomingCall, setIncomingCall, activeCall, setActiveCall } = useSocket();
    const pcRef = useRef(null);
    const localStreamRef = useRef(null);

    useEffect(() => {
        return () => {
            pcRef.current?.close();
            localStreamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    if (!incomingCall && !activeCall) return null;

    const handleAccept = async () => {
        const rawUser = sessionStorage.getItem("sessionUserInfo") || localStorage.getItem("userInfo");
        if (!rawUser) return;
        const currentUser = JSON.parse(rawUser);

        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        } catch {
            alert("Microphone access is required. Please allow it in your browser settings.");
            return;
        }
        localStreamRef.current = stream;

        // ── Create RTCPeerConnection (receiver side) ───────────────────────────
        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;

        // Add local audio tracks
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // Play remote audio
        pc.ontrack = (e) => {
            const audio = new Audio();
            audio.srcObject = e.streams[0];
            audio.autoplay = true;
        };

        // Set the caller's offer
        await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.signal));

        // Create answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // Wait for ICE gathering to complete
        await new Promise((resolve) => {
            if (pc.iceGatheringState === "complete") { resolve(); return; }
            pc.onicegatheringstatechange = () => {
                if (pc.iceGatheringState === "complete") resolve();
            };
            setTimeout(resolve, 3000);
        });

        const callStartTime = new Date().toISOString();
        socket.current.emit("answer-call", {
            callerId: incomingCall.callerId,
            signal: pc.localDescription,  // SDP answer with all ICE candidates
            callStartTime,
        });

        setActiveCall({
            pc,
            localStream: stream,
            callerName: incomingCall.callerName,
            callStartTime,
            callerId: incomingCall.callerId,
            receiverId: currentUser._id,
        });
        setIncomingCall(null);
    };

    const handleReject = () => {
        const rawUser = sessionStorage.getItem("sessionUserInfo") || localStorage.getItem("userInfo");
        const currentUser = rawUser ? JSON.parse(rawUser) : {};
        socket.current.emit("call-rejected", {
            callerId: incomingCall.callerId,
            receiverId: currentUser._id,
        });
        setIncomingCall(null);
    };

    const handleEndCall = () => {
        if (!activeCall) return;
        socket.current.emit("call-ended", {
            callerId: activeCall.callerId,
            receiverId: activeCall.receiverId,
            callStartTime: activeCall.callStartTime,
            callEndTime: new Date().toISOString(),
            status: "answered",
        });
        pcRef.current?.close();
        pcRef.current = null;
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
        setActiveCall(null);
    };

    // Show in-call overlay once connected
    if (activeCall && !incomingCall) {
        return (
            <ActiveCallUI
                callerName={activeCall.callerName}
                status="connected"
                peer={activeCall.pc || pcRef.current}
                localStream={activeCall.localStream || localStreamRef.current}
                onEndCall={handleEndCall}
            />
        );
    }

    // Incoming call popup
    return (
        <div
            style={{
                position: "fixed", bottom: "30px", right: "30px",
                zIndex: 9999,
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                border: "1px solid rgba(99,102,241,0.4)",
                borderRadius: "20px", padding: "24px", width: "300px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(99,102,241,0.2)",
                color: "#fff",
                animation: "slideInUp 0.3s ease",
            }}
        >
            <style>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes ringPulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
                    50%     { box-shadow: 0 0 0 14px rgba(99,102,241,0); }
                }
            `}</style>

            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
                <div style={{
                    width: "52px", height: "52px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "22px", fontWeight: "700",
                    animation: "ringPulse 1.5s infinite", flexShrink: 0,
                }}>
                    {incomingCall.callerName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                    <div style={{ fontSize: "0.75rem", color: "#a5b4fc", marginBottom: "2px" }}>
                        Incoming Voice Call
                    </div>
                    <div style={{ fontWeight: "700", fontSize: "1rem" }}>
                        {incomingCall.callerName || "Unknown Caller"}
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
                <button
                    onClick={handleReject}
                    style={{
                        flex: 1, padding: "11px",
                        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                        color: "#fff", border: "none", borderRadius: "10px",
                        fontWeight: "600", fontSize: "0.9rem", cursor: "pointer",
                    }}
                >✕ Reject</button>
                <button
                    onClick={handleAccept}
                    style={{
                        flex: 1, padding: "11px",
                        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        color: "#fff", border: "none", borderRadius: "10px",
                        fontWeight: "600", fontSize: "0.9rem", cursor: "pointer",
                    }}
                >✓ Accept</button>
            </div>
        </div>
    );
};

export default IncomingCallModal;
