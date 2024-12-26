import FollowModel from '../models/FollowModel.js';
import UserModel from '../models/UserModel.js';
import threadModel from '../models/ThreadModel.js';
import jwt from "jsonwebtoken";
import NotificationController from './NotificationController.js';
import dotenv from 'dotenv';
dotenv.config();

const loadUserProfileData = async (req, res) => {

  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const idOfUser = decode.userId;
    const findUser = await UserModel.findOne({ _id: idOfUser }).lean();

    if (!findUser) {
      res.redirect("/login");
    } 
    const userData = {
      avatar: findUser.avatar,
      quote: findUser.quote == "" ? "No bio available" : findUser.quote,  
      fullname: findUser.fullname == "" ?  "No fullname available" : findUser.fullname,
      username: findUser.username
    };
  
    const threads = await threadModel.find({authorId: idOfUser}).populate({
      path: "authorId", 
      model: "Users",
      localField: "authorId",
      foreignField: "_id",
      select: "username avatar",
    }).lean();
    threads.reverse();

    const updatedThreads = threads.map((thread) => {
      const isLike = thread.likes.some(
        (like) => like.userId.toString() === idOfUser
      );
      const isAuthor = thread.authorId.toString() === idOfUser;
      return { ...thread, isLike, isAuthor };
    });

    const followData = await FollowModel.findOne({ userId: idOfUser })
    .populate({
        path: 'followers',
        select: 'username fullname avatar',
    })
    .populate({
        path: 'followings',
        select: 'username fullname avatar',
    })
    .lean();

  const followers = followData?.followers || [];
  const followings = followData?.followings || [];
  const updatedFollowings = followings.map(following => ({
    ...following,
    isFollowing: true
  }));
  const followingIds = followings.map(following => following._id.toString());


const updatedFollowers = followers.map(follower => ({
  ...follower,
  isFollowing: followingIds.includes(follower._id.toString()),
}));
    const renderData = {
      user: userData,
      threads: updatedThreads,
      followers: updatedFollowers,
      followings: updatedFollowings,
      followerCount: followers.length,
      followingCount: followings.length,
      isOwnProfile: true,
    };

    res.render("Profile", renderData);


  } catch (error) {
    console.error("Error loadUserProfileData:", error);
    res.status(500).json({ message: "An error occurred while loading profile data" });
  }
};

const deleteThread = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedThread = await threadModel.findByIdAndDelete(id);

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found." });
    }

    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/login");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const idOfUser = decode.userId;

    const threads = await threadModel.find({ authorId: idOfUser });

    if (threads.length === 0) {
      // Nếu không còn thread nào, gửi thông báo về "You have no thread"
      res.status(200).json({message: 'You have no thread' });
    } else {
      // Nếu còn thread, gửi về thông báo
      res.status(200).json({ message: 'Thread deleted successfully' });
    }
  } catch (error) {
    console.error("Error deleting thread:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

const redirectToSettings = async (req, res) => {
    res.redirect('/setting/account');
};

const FollowUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const userId = decode.userId;
    const followId = req.params.id;
    followOther(userId, followId);
    follower(userId, followId);
    res.status(200).json({ message: "Follow user successfully" });
  } catch (error) {
    console.error("Error FollowUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const followOther = async (followerId, followingId) => {
  const user = await FollowModel.findOne({ userId: followerId });
  const userFollow = await UserModel.findById(followerId);
  if (!user) {
    await FollowModel.create({ userId: followerId, followings: [followingId], followers: [] });
  }
  else {
    if (user.followings.includes(followingId)) {
      await FollowModel.findOneAndUpdate(
        { userId: followerId },
        { $pull: { followings: followingId } }
      );
    } else {
      NotificationController.addNotification(followingId, "started following you", userFollow.avatar, userFollow.username);
      await FollowModel.findOneAndUpdate(
        { userId: followerId },
        { $push: { followings: followingId } }
      );
}
  }
}
const follower = async (followerId, followingId) => {
  const user = await FollowModel.findOne({ userId: followingId });
  if (!user) {
    await FollowModel.create({ userId: followingId, followings: [], followers: [followerId] });
  }
  else {
    if (user.followers.includes(followerId)) {
      await FollowModel.findOneAndUpdate(
        { userId: followingId },
        { $pull: { followers: followerId } }
      );
    } else {
      await FollowModel.findOneAndUpdate(
        { userId: followingId },
        { $push: { followers: followerId } }
      ); 
    }
  }
}

const loadOtherProfileData = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const idOfUser = decode.userId;
    if (req.params.username == 'Threads'){
      return res.redirect('/');
    }
    const findUser = await UserModel.findOne({ username: req.params.username }).lean();
    const ownFollowData = await FollowModel.findOne({ userId: idOfUser });
    if (findUser._id == idOfUser) {
      return res.redirect("/profile");
    }
    const userData = {
      id: findUser._id,
      avatar: findUser.avatar,
      quote: findUser.quote == "" ? "No bio available" : findUser.quote,  
      fullname: findUser.fullname == "" ?  "No fullname available" : findUser.fullname,
      username: findUser.username
    };
    const threads = await threadModel.find({authorId: userData.id}).populate({
      path: "authorId", 
      model: "Users",
      localField: "authorId",
      foreignField: "_id",
      select: "username avatar",
    }).lean();
    threads.reverse();

    const updatedThreads = threads.map((thread) => {
      const isLike = thread.likes.some(
        (like) => like.userId.toString() === idOfUser
      );
      const isAuthor = thread.authorId.toString() === idOfUser;
      return { ...thread, isLike, isAuthor };
    });

    const followData = await FollowModel.findOne({ userId: findUser._id })
    .populate({
        path: 'followers',
        select: 'username fullname avatar',
    })
    .populate({
        path: 'followings',
        select: 'username fullname avatar',
    })
    .lean();

    const followers = followData?.followers || [];
    const followings = followData?.followings || [];
    const updatedFollowings = followings.map(following => ({
      ...following,
      isFollowing: true,
      isMe: following._id == idOfUser
    }));
    const followingIds = followings.map(following => following._id.toString());


    const updatedFollowers = followers.map(follower => ({
      ...follower,
      isFollowing: followingIds.includes(follower._id.toString()),
      isMe: follower._id == idOfUser
    }));
    const renderData = {
      user: userData,
      threads: updatedThreads,
      followers: updatedFollowers,
      followings: updatedFollowings,
      followerCount: followers.length,
      followingCount: followings.length,
      isOwnProfile: false,
      status: ownFollowData.followings.includes(findUser._id),
    };
    res.render("Profile", renderData);


  } catch (error) {
    console.error("Error loadUserProfileData:", error);
    res.status(500).json({ message: "An error occurred while loading profile data" });
  }
}

const ProfileController = {
    deleteThread: deleteThread,
    loadUserProfileData: loadUserProfileData,
    redirectToSettings: redirectToSettings,
    FollowUser: FollowUser,
    loadOtherProfileData: loadOtherProfileData,
};

export default ProfileController;
