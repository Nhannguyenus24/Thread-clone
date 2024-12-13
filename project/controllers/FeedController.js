import threadModel from '../models/ThreadModel.js';

const loadAllFeed = async (req, res) => {
  try {
    const threads = await threadModel.find({}).populate({
        path: "author", // Trường cần tham chiếu
        model: "Users", // Model cần liên kết
        localField: "author", // Trường trong ThreadSchema
        foreignField: "username", // Trường tương ứng trong UserSchema
        select: "username avatar", // Lấy các trường cần thiết từ Users
      });
      console.log(threads);
      res.render('Feed', {threads: threads });
  } catch (error) {
      console.error('Error fetching threads:', error);
      res.status(500).json({message: 'An error occurred while loading the feed'});
  }
};

const likeThread = (req, res) => {
    const { userid, threadid } = req.body;
    console.log(`User ${userid} liked thread ${threadid}`);
    res.status(200).json({ message: 'Đã nhận dữ liệu thành công!' });;
}

const FeedController = {
    loadAllFeed: loadAllFeed,
    likeThread: likeThread,
};

export default FeedController;