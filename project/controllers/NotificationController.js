import NotificationModel from "../models/NotificationModel.js";
import jwt from 'jsonwebtoken';

const loadNotifications = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.redirect('/login');
        return;
    }
    
    const decode = jwt.verify(token, "741017f64f83c6884e275312409462130e6b4ad31a651a1d66bf7ca08ef64ca4377e229b4aa54757dfefc268d6dbca0f075bda7a23ea913666e4a78102896f60");
    try {
    const noti = await NotificationModel.findOne({ userId: decode.userId });
    res.render("Notification", { notifications: noti ? noti.notifications : [] });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error" });
    }
}

const markAsRead = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.redirect('/login');
        return;
    }
    const decode = jwt.verify(token, "741017f64f83c6884e275312409462130e6b4ad31a651a1d66bf7ca08ef64ca4377e229b4aa54757dfefc268d6dbca0f075bda7a23ea913666e4a78102896f60");
    try {
        const noti = await NotificationModel.findOne({ userId: decode.userId });
        if (!noti) {
            res.status(404).json({ message: "Notification not found" });
            return;
        }
        const notification = noti.notifications.id(req.params.id);
        if (!notification) {
            res.status(404).json({ message: "Notification not found" });
            return;
        }
        notification.isRead = true;
        await noti.save();
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(500).json({message: "Internal server error" });
    }
}

const addNotification = async (userId, content, senderAvatar, senderName) => {
    try {
        const userNotification = await NotificationModel.findOne({ userId });
        console.log(userId, content, senderAvatar, senderName)
        if (!userNotification) {
            const newNotification = new NotificationModel({
                userId,
                notifications: [
                    {
                        content: content,
                    },
                ],
            });

            await newNotification.save();
        } else {
            userNotification.notifications.push({
                content: content,
                senderAvatar: senderAvatar,
                senderName: senderName,
            });
            await userNotification.save();
        }
    } catch (error) {
        console.log('Error adding notification:', error);
    }
}

const NotificationController = {
    loadNotifications: loadNotifications,
    markAsRead: markAsRead, 
    addNotification: addNotification
}

export default NotificationController;