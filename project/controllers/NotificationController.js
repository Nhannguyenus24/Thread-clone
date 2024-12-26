import NotificationModel from "../models/NotificationModel.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const loadNotifications = async (req, res) => {
        const token = req.cookies.token;
        if (!token) 
          return res.redirect("/login");
        const decode = jwt.verify(token, process.env.JWT_SECRET);
    try {
    const noti = await NotificationModel.findOne({ userId: decode.userId }).lean();
    noti.notifications.reverse();
    res.render("Notification", { notifications: noti ? noti.notifications : [] });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error" });
    }
}

const markAsRead = async (req, res) => {
    const token = req.cookies.token;
    if (!token) 
      return res.redirect("/login");
    const decode = jwt.verify(
    token, process.env.JWT_SECRET);
    try {
        const noti = await NotificationModel.findOne({ userId: decode.userId });
        if (!noti) 
            return res.status(404).json({ message: "Notification not found" });

        const notification = noti.notifications.id(req.params.id);
        if (!notification)
            return res.status(404).json({ message: "Notification not found" });

        notification.isRead = true;
        await noti.save();
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(500).json({message: "Internal server error" });
    }
}


const deleteNotification = async (req, res) => {
    const token = req.cookies.token;
    if (!token) 
      return res.redirect("/login");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    try {
        const noti = await NotificationModel.findOne({ userId: decode.userId });
        if (!noti) 
            return res.status(404).json({ message: "Notification not found" });

        const notification = noti.notifications.id(req.params.id);
        if (!notification)
            return res.status(404).json({ message: "Notification not found" });


        noti.notifications.pull({ _id: req.params.id });
        
        await noti.save();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        res.status(500).json({message: "Internal server error" });
    }
}

const addNotification = async (userId, content, senderAvatar, senderName, link) => {
    try {
        const userNotification = await NotificationModel.findOne({ userId });
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
                linkThread: link,
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
    addNotification: addNotification,
    deleteNotification: deleteNotification,
}

export default NotificationController;