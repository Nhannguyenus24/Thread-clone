import threadModel from "../models/ThreadModel.js";
import userModel from "../models/UserModel.js";
import FollowModel from "../models/FollowModel.js";
import NotificationController from "./NotificationController.js";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
dotenv.config();

const loadAllThread = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    const threads = await threadModel
      .find({})
      .populate({
        path: "authorId",
        model: "Users",
        localField: "authorId",
        foreignField: "_id",
        select: "username avatar",
      })
      .lean();
      threads.reverse();
    res.render("Feed", { threads: threads, isLogin: false });
  } else {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    try {
      const userId = decode.userId;
      const user = await userModel.findById(userId);
      const threads = await threadModel
        .find({})
        .populate({
          path: "authorId",
          model: "Users",
          localField: "authorId",
          foreignField: "_id",
          select: "username avatar",
        })
        .lean();
      threads.reverse();
      const updatedThreads = threads.map((thread) => {
        const isLike = thread.likes.some(
          (like) => like.userId.toString() === userId
        );
        return { ...thread, isLike };
      });
      res.render("Feed", {
        threads: updatedThreads,
        avatar: user.avatar,
        isLogin: true,
      });
    } catch (error) {
      console.error("Error fetching threads:", error);
      res.status(500).json({ message: "An error occurred while loading the feed" });
    }
  }
};

const likeThread = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  const thread = await threadModel.findById(req.params.id);
  const user = await userModel.findById(decode.userId);
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
    if (decode.userId != thread.authorId)
      NotificationController.addNotification(thread.authorId, "liked your thread", user.avatar, user.username, `/${thread.author}/post/${thread._id}`);
  }

  await thread.save();

  res.status(200).json({ message: "Thread updated successfully" });
};

const loadFollowingThread = async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const userId = decode.userId;
    const user = await userModel.findById(userId);
    const followData = await FollowModel.findOne({ userId }).lean();
    if (
      !followData ||
      !followData.followings ||
      followData.followings.length === 0
    ) {
      return res.render("Feed", {
        threads: [],
        avatar: user.avatar,
        isLogin: true,
        message: "You are not following anyone yet!",
      });
    }

    const followedUserIds = followData.followings;
    const threads = await threadModel
      .find({ authorId: { $in: followedUserIds } })
      .populate({
        path: "authorId",
        model: "Users",
        localField: "authorId",
        foreignField: "_id",
        select: "username avatar",
      }).lean();

    threads.reverse();

    const updatedThreads = threads.map((thread) => {
      const isLike = thread.likes.some(
        (like) => like.userId.toString() === userId
      );
      return { ...thread, isLike };
    });

    // Render kết quả
    res.render("Feed", {
      threads: updatedThreads,
      avatar: user.avatar,
      isLogin: true,
    });
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ message: "An error occurred while loading the feed" });
  }
};

const addComment = async (req, res) => {
  const { content } = req.body;
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const thread = await threadModel.findById(req.params.id);
    const user = await userModel.findById(decode.userId);
    thread.comments.push({ commentId: decode.userId, comment: content });
    await thread.save();
    if (decode.userId != thread.authorId)
      NotificationController.addNotification(thread.authorId, "commented on your thread", user.avatar, user.username, `/${thread.author}/post/${thread._id}`);
    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "An error occurred while adding the comment" });
  }
};

const loadThread = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const thread = await threadModel
      .findById(req.params.id)
      .populate({
        path: "authorId",
        model: "Users",
        localField: "authorId",
        foreignField: "_id",
        select: "username avatar",
      })
      .populate({
        path: "comments.commentId",
        localField: "comments.commentId",
        foreignField: "_id",
        model: "Users",
        select: "username avatar",
      })
      .lean();
    const isLike = thread.likes.some(
      (like) => like.userId.toString() === decode.userId
    );
    const user = await userModel.findById(decode.userId).lean();
    const updatedThread = { ...thread, isLike };
    res.render("Post", {
      threads: [updatedThread],
      comments: updatedThread.comments,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ message: "An error occurred while loading the thread" });
  }
};

const FeedController = {
  loadAllThread: loadAllThread,
  likeThread: likeThread,
  loadFollowingThread: loadFollowingThread,
  addComment: addComment,
  loadThread: loadThread,
};

export default FeedController;
