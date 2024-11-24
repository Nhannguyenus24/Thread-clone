const { threads, comments } = require("../data");

const loadFeed = (req, res) => {
    const threadsWithComments = threads.map(thread => ({
        ...thread,
        comments: comments.filter(comment => comment.threadId === thread.id),
    }));
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

module.exports = FeedController;