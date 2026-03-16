import CallHistory from "../models/CallHistory.js";

// In-memory map of userId -> socketId for active users
const userSocketMap = new Map();

export const setupCallHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        // Register user: map their userId -> socketId so we can route calls
        socket.on("register", (userId) => {
            if (userId) {
                userSocketMap.set(userId, socket.id);
                console.log(`[Socket] Registered user ${userId} -> socket ${socket.id}`);
            }
        });

        // Caller initiates a call
        // data: { callerId, callerName, receiverId, signal (WebRTC offer) }
        socket.on("call-user", (data) => {
            const { callerId, callerName, receiverId, signal } = data;
            const receiverSocketId = userSocketMap.get(receiverId);

            if (!receiverSocketId) {
                // Receiver is not online
                socket.emit("call-failed", { message: "User is not available right now." });
                return;
            }

            // Forward the incoming call notification to the receiver
            io.to(receiverSocketId).emit("incoming-call", {
                callerId,
                callerName,
                signal,
            });

            console.log(`[Socket] Call from ${callerId} (${callerName}) -> ${receiverId}`);
        });

        // Receiver accepted the call — send the WebRTC answer back to caller
        // data: { callerId, signal (WebRTC answer), callStartTime }
        socket.on("answer-call", (data) => {
            const { callerId, signal, callStartTime } = data;
            const callerSocketId = userSocketMap.get(callerId);

            if (callerSocketId) {
                io.to(callerSocketId).emit("call-answered", { signal, callStartTime });
                console.log(`[Socket] Call answered — notifying caller ${callerId}`);
            }
        });

        // Either party ended the call
        // data: { callerId, receiverId, callStartTime, callEndTime }
        socket.on("call-ended", async (data) => {
            const { callerId, receiverId, callStartTime, callEndTime, status = "answered" } = data;

            // Notify the other party
            const callerSocketId = userSocketMap.get(callerId);
            const receiverSocketId = userSocketMap.get(receiverId);

            if (callerSocketId) io.to(callerSocketId).emit("call-ended");
            if (receiverSocketId) io.to(receiverSocketId).emit("call-ended");

            // Persist to MongoDB
            try {
                const start = callStartTime ? new Date(callStartTime) : null;
                const end = callEndTime ? new Date(callEndTime) : null;
                const durationSecs = start && end ? Math.round((end - start) / 1000) : 0;

                await CallHistory.create({
                    callerId,
                    receiverId,
                    callStartTime: start,
                    callEndTime: end,
                    callDuration: durationSecs,
                    status,
                });
                console.log(`[Socket] Call history saved (${status}, ${durationSecs}s)`);
            } catch (err) {
                console.error("[Socket] Failed to save call history:", err.message);
            }
        });

        // Receiver rejected the call
        // data: { callerId, receiverId }
        socket.on("call-rejected", (data) => {
            const { callerId, receiverId } = data;
            const callerSocketId = userSocketMap.get(callerId);
            if (callerSocketId) {
                io.to(callerSocketId).emit("call-rejected");
            }
            // Save a "rejected" record
            if (callerId && receiverId) {
                CallHistory.create({
                    callerId,
                    receiverId,
                    status: "rejected",
                }).catch((err) => console.error("[Socket] Failed to save rejected call:", err.message));
            }
        });

        // Clean up when socket disconnects
        socket.on("disconnect", () => {
            for (const [userId, sockId] of userSocketMap.entries()) {
                if (sockId === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`[Socket] User ${userId} disconnected`);
                    break;
                }
            }
        });
    });
};
