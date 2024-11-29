
const loadFeed = (req, res) => {
    const threadsWithComments = [];
    res.render('Feed', { threads: threadsWithComments});
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