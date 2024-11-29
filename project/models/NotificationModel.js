import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});

const UserNotificationSchema = new mongoose.Schema({
    user: { type: String, required: true },
    notifications: [NotificationSchema]
});

const NotificationModel = mongoose.model("Notifications", UserNotificationSchema);

export default NotificationModel;