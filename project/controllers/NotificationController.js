

const loadNotifications = (req, res) => {
    const notifications = [];
    res.render("Notification", { notifications: notifications });
}

const NotificationController = {
    loadNotifications: loadNotifications,
}

export default NotificationController;