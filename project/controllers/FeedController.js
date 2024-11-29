const loadFeed = (req, res) => {
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
    res.render('Feed', { threads: threads});
}

const likeThread = (req, res) => {
    const { userid, threadid } = req.body;
    console.log(`User ${userid} liked thread ${threadid}`);
    res.status(200).json({ message: 'Đã nhận dữ liệu thành công!' });;
}

const FeedController = {
    loadFeed: loadFeed,
    likeThread: likeThread,
};

export default FeedController;