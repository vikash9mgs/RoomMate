import mongoose from "mongoose";

const callHistorySchema = new mongoose.Schema(
    {
        callerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        callStartTime: {
            type: Date,
            default: null,
        },
        callEndTime: {
            type: Date,
            default: null,
        },
        callDuration: {
            // in seconds
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["missed", "answered", "rejected"],
            default: "missed",
        },
    },
    {
        timestamps: true,
    }
);

const CallHistory = mongoose.model("CallHistory", callHistorySchema);

export default CallHistory;
