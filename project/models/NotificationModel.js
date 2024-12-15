import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    content: { type: String, required: true },
    senderAvatar: { type: String, required: true, default: "/image/thread.ico" },
    senderName: { type: String, required: true, default: "Threads" },
    date: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});

const UserNotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    notifications: { type: [NotificationSchema], default: [] }
});

const NotificationModel = mongoose.model("Notifications", UserNotificationSchema);

export default NotificationModel;