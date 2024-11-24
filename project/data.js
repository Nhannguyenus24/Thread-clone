const threads = [
    {
      id: 1,
      avatar: '/image/avatar_1.0.jpg',
      username: 'John Doe',
      time: '2 hours ago',
      content: 'This is a post content!',
      image: '/image/content_1.0.jpg',
      likes: 50,
      comment: 10
    },
    {
      id: 2,
      avatar: '/image/anonymous-user.jpg',
      username: 'Jane Smith',
      time: '1 day ago',
      content: 'Here is another post without an image.',
      image: null,
      likes: 30,
      comment: 5
    }
  ];
  const profiles = [
    {
      avatar: '/image/avatar_1.0.jpg',
      username: "John Doe",
      bio: "Web developer and tech enthusiast.",
      status: "Theo dõi",
      followers: 120
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "Jane Smith",
      bio: "Digital artist and illustrator.",
      status: "Đã theo dõi",
      followers: 250
    },
    {
      avatar: '/image/avatar_1.0.jpg',
      username: "Alice",
      bio: "Full-stack developer passionate about open-source.",
      status: "Theo dõi",
      followers: 320
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "Bob",
      bio: "Music lover and guitarist.",
      status: "Đã theo dõi",
      followers: 450
    },
    {
      avatar: '/image/avatar_1.0.jpg',
      username: "Charlie",
      bio: "Tech blogger and content creator.",
      status: "Theo dõi",
      followers: 100
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "David",
      bio: "Game developer and VR enthusiast.",
      status: "Đã theo dõi",
      followers: 600
    },
    {
      avatar: '/image/avatar_1.0.jpg',
      username: "Eve",
      bio: "Fitness trainer and wellness advocate.",
      status: "Theo dõi",
      followers: 890
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "Frank",
      bio: "Photographer and travel addict.",
      status: "Đã theo dõi",
      followers: 400
    },
    {
      avatar: '/image/avatar_1.0.jpg',
      username: "Grace",
      bio: "Foodie and amateur chef.",
      status: "Theo dõi",
      followers: 750
    },
    {
      avatar: "/image/anonymous-user.jpg",
      username: "Hank",
      bio: "Software engineer and AI researcher.",
      status: "Đã theo dõi",
      followers: 950
    }
  ];
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
  const links = [
    {
      content: "Trung tâm trợ giúp",
      link: "https://help.instagram.com/179980294969821/"
    },
    {
      content: "Chính sách quyền riêng tư của Meta",
      link: "https://www.facebook.com/privacy/policy/"
    },
    {
      content: "Điều khoản sử dụng của Meta",
      link: "https://help.instagram.com/581066165581870"
    },
    {
      content: "Chính sách quyền riêng tư bổ sung của Threads",
      link: "https://help.instagram.com/515230437301944"
    },
    {
      content: "Điều khoản sử dụng của Threads",
      link: "https://help.instagram.com/769983657850450"
    },
    {
      content: "Chính sách cookie",
      link: "https://privacycenter.instagram.com/policies/cookies/"
    },
    {
      content: "Hướng dẫn về mạng xã hội phi tập trung",
      link: "https://www.facebook.com/privacy/guide/fediverse/"
    }
  ];
  const comments = [
    { threadId: 1, username: 'Charlie', content: 'Nice post!', time: '10 phút trước' },
    { threadId: 2, username: 'Dave', content: 'I agree!', time: '20 phút trước' },
    { threadId: 1, username: 'Eve', content: 'Well said.', time: '5 phút trước' },
  ];
  module.exports = { threads, notifications, profiles, links, comments };