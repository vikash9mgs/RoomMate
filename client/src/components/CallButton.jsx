import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import ActiveCallUI from "./ActiveCallUI";
import { BsTelephoneFill } from "react-icons/bs";

// STUN servers for NAT traversal
const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
    ],
};

const CallButton = ({ listingOwnerId, listingOwnerName }) => {
    const { socket, activeCall, setActiveCall, registerUser } = useSocket();
    const [callStatus, setCallStatus] = useState("idle"); // idle | calling | connected | ended
    const pcRef = useRef(null);          // RTCPeerConnection
    const localStreamRef = useRef(null);
    const currentUserRef = useRef(null);

    // ── Cleanup on unmount ────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            socket.current?.off("call-answered");
            socket.current?.off("call-rejected");
            socket.current?.off("call-failed");
            pcRef.current?.close();
            localStreamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    const startCall = async () => {
        const rawUser = sessionStorage.getItem("sessionUserInfo") || localStorage.getItem("userInfo");
        if (!rawUser) { alert("Please log in to make a call."); return; }
        const currentUser = JSON.parse(rawUser);
        currentUserRef.current = currentUser;

        // Re-register before calling
        registerUser(currentUser._id);

        // Request mic
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        } catch {
            alert("Microphone access is required to make a call. Please allow it in your browser settings.");
            return;
        }
        localStreamRef.current = stream;

        // Remove stale listeners
        socket.current.off("call-answered");
        socket.current.off("call-rejected");
        socket.current.off("call-failed");

        setCallStatus("calling");

        // ── Create RTCPeerConnection (initiator side) ─────────────────────────
        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;

        // Add local audio tracks
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // Play remote audio when it arrives
        pc.ontrack = (e) => {
            const audio = new Audio();
            audio.srcObject = e.streams[0];
            audio.autoplay = true;
        };

        // Collect ALL ICE candidates before sending offer (trickle=false style)
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Wait for ICE gathering to complete
        await new Promise((resolve) => {
            if (pc.iceGatheringState === "complete") { resolve(); return; }
            pc.onicegatheringstatechange = () => {
                if (pc.iceGatheringState === "complete") resolve();
            };
            setTimeout(resolve, 3000); // Max 3s wait
        });

        console.log("[Call] Sending call-user to:", listingOwnerId);
        socket.current.emit("call-user", {
            callerId: currentUser._id,
            callerName: currentUser.name,
            receiverId: listingOwnerId,
            signal: pc.localDescription,  // SDP offer with all ICE candidates
        });

        // Listen for the answer
        socket.current.once("call-answered", async ({ signal, callStartTime }) => {
            await pc.setRemoteDescription(new RTCSessionDescription(signal));
            setCallStatus("connected");
            setActiveCall({
                pc,
                localStream: localStreamRef.current,
                callerName: listingOwnerName,
                callStartTime,
                callerId: currentUser._id,
                receiverId: listingOwnerId,
            });
        });

        socket.current.once("call-rejected", () => {
            setCallStatus("ended");
            pc.close();
            stream.getTracks().forEach((t) => t.stop());
            setTimeout(() => setCallStatus("idle"), 2500);
        });

        socket.current.once("call-failed", ({ message }) => {
            alert(message || "The user is not available right now.");
            setCallStatus("idle");
            pc.close();
            stream.getTracks().forEach((t) => t.stop());
        });

        pc.oniceconnectionstatechange = () => {
            if (pc.iceConnectionState === "failed" || pc.iceConnectionState === "disconnected") {
                console.warn("[Call] ICE connection", pc.iceConnectionState);
            }
        };
    };

    const handleEndCall = (callerId, receiverId) => {
        socket.current.emit("call-ended", {
            callerId,
            receiverId,
            callStartTime: activeCall?.callStartTime,
            callEndTime: new Date().toISOString(),
            status: "answered",
        });
        socket.current.off("call-answered");
        socket.current.off("call-rejected");
        socket.current.off("call-failed");
        pcRef.current?.close();
        pcRef.current = null;
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
        setActiveCall(null);
        setCallStatus("ended");
        setTimeout(() => setCallStatus("idle"), 2500);
    };

    if (callStatus === "calling" || callStatus === "connected") {
        const rawUser = sessionStorage.getItem("sessionUserInfo") || localStorage.getItem("userInfo");
        const user = currentUserRef.current || (rawUser ? JSON.parse(rawUser) : {});
        return (
            <ActiveCallUI
                callerName={listingOwnerName}
                status={callStatus}
                peer={pcRef.current}
                localStream={localStreamRef.current}
                onEndCall={() => handleEndCall(user._id, listingOwnerId)}
            />
        );
    }

    return (
        <button
            onClick={startCall}
            disabled={callStatus === "ended"}
            style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", width: "100%", padding: "12px 20px",
                background: callStatus === "ended"
                    ? "linear-gradient(135deg, #555 0%, #333 100%)"
                    : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                color: "#fff", border: "none", borderRadius: "12px",
                fontSize: "1rem", fontWeight: "600",
                cursor: callStatus === "ended" ? "not-allowed" : "pointer",
                transition: "all 0.25s ease",
                boxShadow: "0 4px 15px rgba(34,197,94,0.3)",
            }}
            onMouseEnter={(e) => { if (callStatus !== "ended") e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
            <BsTelephoneFill size={16} />
            {callStatus === "ended" ? "Call Ended" : "Call Owner"}
        </button>
    );
};

export default CallButton;
