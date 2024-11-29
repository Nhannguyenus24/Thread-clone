const {notifications} = require("../data");

const loadNotifications = (req, res) => {
    res.render("Notification", { notifications: notifications });
}

const NotificationController = {
    loadNotifications: loadNotifications,
}

export default NotificationController;