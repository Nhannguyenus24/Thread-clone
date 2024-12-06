

const loadNotifications = (req, res) => {
    
  const notifications = [
    {
      avatar: "/image/anonymous-user.jpg",
      username: "John Doe",
      time: "2 phút trước",
      content: "Đây là thông báo 1"
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "Jane Smith",
      time: "5 phút trước",
      content: "Đây là thông báo 2"
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "Alice",
      time: "10 phút trước",
      content: "Đây là thông báo 3"
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "Bob",
      time: "15 phút trước",
      content: "Đây là thông báo 4"
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "Charlie",
      time: "20 phút trước",
      content: "Đây là thông báo 5"
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "David Gnộp",
      time: "25 phút trước",
      content: "Đây là David Gnộp"
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "Eve",
      time: "30 phút trước",
      content: "Đây là thông báo 7"
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "Frank",
      time: "35 phút trước",
      content: "Đây là thông báo 8"
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "Grace",
      time: "40 phút trước",
      content: "Đây là thông báo 9"
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "Hank",
      time: "45 phút trước",
      content: "Đây là thông báo 10"
    }
  ];
    res.render("Notification", { notifications: notifications });
}

const NotificationController = {
    loadNotifications: loadNotifications,
}

export default NotificationController;