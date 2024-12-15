import threadModel from "../models/ThreadModel.js";
import userModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const loadAllThread = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    const threads = await threadModel.find({}).populate({
      path: "author",
      model: "Users",
      localField: "author",
      foreignField: "username",
      select: "username avatar",
    }).lean();
    res.render("Feed", { threads: threads, isLogin: false });
  } else {
    const decode = jwt.verify(
      token,
      "741017f64f83c6884e275312409462130e6b4ad31a651a1d66bf7ca08ef64ca4377e229b4aa54757dfefc268d6dbca0f075bda7a23ea913666e4a78102896f60"
    );
    try {
      const userId = decode.userId;
      const user = await userModel.findById(userId);
      const threads = await threadModel
        .find({})
        .populate({
          path: "author",
          model: "Users",
          localField: "author",
          foreignField: "username",
          select: "username avatar",
        })
        .lean();
      const updatedThreads = threads.map((thread) => {
        const isLike = thread.likes.some(
          (like) => like.userId.toString() === userId
        );
        return { ...thread, isLike };
      });
      res.render("Feed", { threads: updatedThreads, avatar: user.avatar, isLogin: true });
    } catch (error) {
      console.error("Error fetching threads:", error);
      res
        .status(500)
        .json({ message: "An error occurred while loading the feed" });
    }
  }
};

const likeThread = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/login");
    return;
  }
  const decode = jwt.verify(
    token,
    "741017f64f83c6884e275312409462130e6b4ad31a651a1d66bf7ca08ef64ca4377e229b4aa54757dfefc268d6dbca0f075bda7a23ea913666e4a78102896f60"
  );
  const thread = await threadModel.findById(req.params.id);

  if (!thread) {
    return res.status(404).json({ message: "Thread not found" });
  }

  const userLiked = thread.likes.some(
    (like) => like.userId.toString() === decode.userId
  );

  if (userLiked) {
    thread.likes = thread.likes.filter(
      (like) => like.userId.toString() !== decode.userId
    );
  } else {
    thread.likes.push({ userId: decode.userId });
  }

  await thread.save();

  res.status(200).json({ message: "Thread updated successfully" });
};

const loadFollowingThread = async (req, res) => {
}

const addComment = async (req, res) => {
  const {content} = req.body;
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/login");
    return;
  }
  const decode = jwt.verify(
    token,
    "741017f64f83c6884e275312409462130e6b4ad31a651a1d66bf7ca08ef64ca4377e229b4aa54757dfefc268d6dbca0f075bda7a23ea913666e4a78102896f60"
  );
  try {
    const thread = await threadModel.findById(req.params.id);
    thread.comments.push({ commentId: decode.userId, comment: content });
    await thread.save();
    res.status(200).json({ message: "Comment added successfully" });
  } catch(error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "An error occurred while adding the comment" });
  }
}

const loadThread = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/login");
    return;
  }
  const decode = jwt.verify(
    token,
    "741017f64f83c6884e275312409462130e6b4ad31a651a1d66bf7ca08ef64ca4377e229b4aa54757dfefc268d6dbca0f075bda7a23ea913666e4a78102896f60"
  );
  try{
    const thread = await threadModel.findById(req.params.id).populate({
      path: "author",
      model: "Users",
      localField: "author",
      foreignField: "username",
      select: "username avatar",
    }).populate({
      path: "comments.commentId",
      localField: "comments.commentId",
      foreignField: "_id",
      model: "Users",
      select: "username avatar"
    }).lean();
    const isLike = thread.likes.some(
      (like) => like.userId.toString() === decode.userId
    );
    const user = await userModel.findById(decode.userId).lean();
    const updatedThread = { ...thread, isLike };
    res.render("Post", { threads: [updatedThread], comments: updatedThread.comments, avatar: user.avatar});
} catch (error) {
  console.error("Error fetching thread:", error);
  res.status(500).json({ message: "An error occurred while loading the thread" });
}
}

const FeedController = {
  loadAllThread: loadAllThread,
  likeThread: likeThread,
  loadFollowingThread: loadFollowingThread,
  addComment: addComment,
  loadThread: loadThread,
};

export default FeedController;
