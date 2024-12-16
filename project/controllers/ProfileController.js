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
    }).lean();
    threads.reverse();

    const updatedThreads = threads.map((thread) => {
      const isLike = thread.likes.some(
        (like) => like.userId.toString() === idOfUser
      );
      const isAuthor = thread.authorId.toString() === idOfUser;
      return { ...thread, isLike, isAuthor };
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

const deleteThread = async (req, res) => {
  try {
    const { id } = req.body; // Lấy ID bài viết từ request body
    // Kiểm tra xem ID có tồn tại không
    if (!id) {
      return res.status(400).json({ error: "Thread ID is required." });
    }

    // Tìm và xóa bài viết trong database
    const deletedThread = await threadModel.findByIdAndDelete(id);

    // Nếu không tìm thấy bài viết
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found." });
    }

    const token = req.cookies.token;
    if (!token) {
      res.redirect("/login");
      return;
    }
    const decode = jwt.verify(
      token,
      "741017f64f83c6884e275312409462130e6b4ad31a651a1d66bf7ca08ef64ca4377e229b4aa54757dfefc268d6dbca0f075bda7a23ea913666e4a78102896f60"
    );
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


const ProfileController = {
    deleteThread: deleteThread,
    loadUserProfileData: loadUserProfileData,
    redirectToSettings: redirectToSettings,
};

export default ProfileController;
