import FollowModel from '../models/FollowModel.js';
import UserModel from '../models/UserModel.js';
import threadModel from '../models/ThreadModel.js';
import jwt from "jsonwebtoken";

const loadUserProfileData = async (req, res) => {

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
    const idOfUser = decode.userId;
    const findUser = await UserModel.findOne({ _id: idOfUser });

    if (!findUser) {
      res.redirect("/login");
    } 
    // Lấy dữ liệu user (avatar, fullname, quote)
    const userData = {
      avatar: findUser.avatar,
      quote: findUser.quote || "Chưa có tên",  
      fullname: findUser.fullname || "Chưa có tiểu sử",
      username: findUser.username
    };

  
    // Tìm các threads của user
    const threads = await threadModel.find({author: userData.username}).populate({
      path: "author", 
      model: "Users",
      localField: "author",
      foreignField: "username",
      select: "username avatar",
    });
    threads.reverse();

    const updatedThreads = threads.map((thread) => {
      const isLike = thread.likes.some(
        (like) => like.userId.toString() === idOfUser
      );
      return { ...thread, isLike };
    });


      // avatar, username, fullname, status
      // Dữ liệu followers và followings (giả sử dữ liệu này có sẵn hoặc có thể truy xuất từ DB)
    const followData = await FollowModel.findOne({ userId: idOfUser }).lean();


    // Khởi tạo dữ liệu mặc định
    const followers = followData?.followers || [];
    const followings = followData?.followings || [];

  
    const renderData = {
      user: userData,
      threads: updatedThreads,
      followers,
      followings,
      followerCount: followers.length,
      followingCount: followings.length,
    };

    res.render("Profile", renderData);


  } catch (error) {
    console.error("Error loadUserProfileData:", error);
    res.status(500).json({ message: "An error occurred while loading profile data" });
  }
};

  
const redirectToSettings = async (req, res) => {
    res.redirect('/setting/account');
};


const ProfileController = {
    loadUserProfileData: loadUserProfileData,
    redirectToSettings: redirectToSettings,
};

export default ProfileController;
