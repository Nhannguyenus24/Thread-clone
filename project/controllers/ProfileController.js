import FollowModel from '../models/FollowModel.js';
import UserModel from '../models/UserModel.js';
import threadModel from '../models/ThreadModel.js';

const loadUserThreadData = async (req, res, next) => {
    try {
      const threads = await threadModel.find({}).populate({
        path: "author", 
        model: "Users",
        localField: "author",
        foreignField: "username",
        select: "username avatar",
      });
      console.log("1");
      req.threads = threads; // Gắn dữ liệu threads vào req
      next(); // Chuyển sang middleware tiếp theo
    } catch (error) {
      console.error("Error loadUserThreadData:", error);
      res.status(500).json({ message: "An error occurred while loadUserThreadData" });
    }
  };
  
  const loadFollowsData = async (req, res, next) => {

  try {  
			const followers = [
				{ avatar: "/image/avatar_1.0.jpg", username: "Spectacular", fullname: "Anh Hùng", status: "Theo dõi lại" },
				{ avatar: "/image/avatar_1.0.jpg", username: "Betagen 22", fullname: "Trâm Anh", status: "Đang Theo dõi" },
				{ avatar: "/image/avatar_1.0.jpg", username: "Spectacular", fullname: "Anh Hùng", status: "Theo dõi lại" },
				{ avatar: "/image/avatar_1.0.jpg", username: "Betagen 22", fullname: "Trâm Anh", status: "Đang Theo dõi" },
				{ avatar: "/image/avatar_1.0.jpg", username: "Spectacular", fullname: "Anh Hùng", status: "Theo dõi lại" },
				{ avatar: "/image/avatar_1.0.jpg", username: "Betagen 22", fullname: "Trâm Anh", status: "Đang Theo dõi" },
				// Các đối tượng khác...
			];
			const followings = [
				{ avatar: "/image/Obito.jpg", username: "TechSavvy", fullname: "Minh Tú", status: "Theo dõi lại" },
				{ avatar: "/image/Obito.jpg", username: "Obito", fullname: "Hà My", status: "Theo dõi lại" },
				{ avatar: "/image/avatar_1.0.jpg", username: "Spectacular", fullname: "Anh Hùng", status: "Theo dõi lại" },
				{ avatar: "/image/avatar_1.0.jpg", username: "Betagen 22", fullname: "Trâm Anh", status: "Đang Theo dõi" },
				{ avatar: "/image/avatar_1.0.jpg", username: "Spectacular", fullname: "Anh Hùng", status: "Theo dõi lại" },
				{ avatar: "/image/avatar_1.0.jpg", username: "Betagen 22", fullname: "Trâm Anh", status: "Đang Theo dõi" },
				// Các đối tượng khác...
			];
			req.followers = followers; // Gắn dữ liệu followers vào req
			req.followings = followings; // Gắn dữ liệu followings vào req
			req.followerCount = followers.length;
			req.followingCount = followings.length;
			console.log("2");
			next(); // Chuyển sang middleware tiếp theo
    }
		catch(error) {
			console.error("Error loadFollowsData:", error);
      res.status(500).json({ message: "An error occurred while loadFollowsData" });
		}

  };

  const renderProfile = (req, res) => {
    // Tất cả dữ liệu từ các middleware được gắn vào req
    console.log("3");
    res.render("Profile", {
      threads: req.threads,
      followers: req.followers,
      followings: req.followings,
      followerCount: req.followerCount,
      followingCount: req.followingCount,
    });
  };
  
  

const redirectToSettings = async (req, res) => {
    res.redirect('/setting/account');
};

const loadUserProfile = async(req, res) => {

};


const ProfileController = {
    loadFollowsData: loadFollowsData,
    redirectToSettings: redirectToSettings,
    loadUserThreadData: loadUserThreadData,
    renderProfile: renderProfile
};

export default ProfileController;
